import os
import re
from typing import List
from dotenv import load_dotenv
from pydantic import BaseModel, Field

from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
try:
    from langfuse.langchain import CallbackHandler
except ImportError:
    try:
        from langfuse.callback import CallbackHandler
    except ImportError:
        # For even newer versions or different structures
        from langfuse.openai import CallbackHandler as _CH # fallback placeholder if needed
        CallbackHandler = _CH


import fitz  # PyMuPDF


basedir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(basedir, "..", ".env")
load_dotenv(env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
LANGFUSE_PUBLIC_KEY = os.getenv("LANGFUSE_PUBLIC_KEY")
LANGFUSE_SECRET_KEY = os.getenv("LANGFUSE_SECRET_KEY")
LANGFUSE_BASE_URL = os.getenv("LANGFUSE_BASE_URL", "https://cloud.langfuse.com")

# Ensure LANGFUSE_HOST is set for the SDK
if not os.getenv("LANGFUSE_HOST") and LANGFUSE_BASE_URL:
    os.environ["LANGFUSE_HOST"] = LANGFUSE_BASE_URL

langfuse_handler = CallbackHandler()

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    api_key=GEMINI_API_KEY,
    temperature=0
)



class StoreState(BaseModel):
    pdf_bytes: bytes
    text: str = ""
    images: List[bytes] = Field(default_factory=list)
    urls: List[str] = Field(default_factory=list)
    ocr_text: str = ""
    url_text: str = ""
    combined_text: str = ""
    chunks: List[str] = Field(default_factory=list)
    scores: List[float] = Field(default_factory=list)
    final_score: float = 0.0
    report: str = ""


class ChunkAnalysis(BaseModel):
    ai_score: float = Field(..., ge=0, le=100)
    confidence: str
    reason: str

structured_llm = llm.with_structured_output(ChunkAnalysis)



def pdf_extraction_node(state: StoreState) -> StoreState:
    try:
        doc = fitz.open(stream=state.pdf_bytes, filetype="pdf")

        full_text = ""
        images = []
        urls = []

        for page in doc:
            text = page.get_text()
            full_text += text

            found_urls = re.findall(r'https?://\S+', text)
            urls.extend(found_urls)

            for img in page.get_images(full=True):
                xref = img[0]
                base_img = doc.extract_image(xref)
                image_bytes = base_img["image"]
                images.append(image_bytes)

        state.text = full_text
        state.images = images
        state.urls = urls

    except Exception as e:
        print("PDF extraction error:", e)

    return state


def content_merger_node(state: StoreState) -> StoreState:
    parts = []

    if state.text:
        parts.append(f"PDF CONTENT:\n{state.text}")

    if state.ocr_text:
        parts.append(f"OCR CONTENT:\n{state.ocr_text}")

    if state.url_text:
        parts.append(f"URL CONTENT:\n{state.url_text}")

    state.combined_text = "\n\n".join(parts)
    return state


def chunking_node(state: StoreState) -> StoreState:
    text = state.combined_text.strip()

    if not text:
        state.chunks = []
        return state

    chunk_size = 1200
    overlap = 200

    chunks = []
    start = 0

    # create all chunks
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        start += chunk_size - overlap

    # 🔥 SMART SAMPLING
    total = len(chunks)

    if total <= 5:
        selected = chunks
    else:
        selected = [
            chunks[0],                 # beginning
            chunks[total // 2],        # middle
            chunks[-1],                # end
            chunks[total // 3],        # early-mid
            chunks[(2 * total) // 3]   # late-mid
        ]

    state.chunks = selected

    print(f"Total chunks: {total}")
    print(f"Selected chunks: {len(selected)}")

    return state


def llm_scoring_node(state: StoreState) -> StoreState:
    scores = []

    for chunk in state.chunks:
        try:
            prompt = f"""
You are an AI detection expert.

Analyze the following text and estimate the likelihood that it is AI-generated.

Consider:
- Repetition patterns
- Sentence uniformity
- Lack of personal tone
- Predictable structure

Return STRICT JSON:
{{
  "ai_score": number (0-100),
  "confidence": "low/medium/high",
  "reason": "brief explanation"
}}

Text:
{chunk}
"""

            result = structured_llm.invoke(prompt)

            scores.append(result.ai_score)
        except Exception as e:
            print(f"Error analyzing chunk: {e}")
            scores.append(0.0)

    state.scores = scores
    return state


def aggregation_node(state: StoreState) -> StoreState:
    if not state.scores:
        state.final_score = 0.0
        return state

    valid_scores = [s for s in state.scores if s > 0]

    if not valid_scores:
        state.final_score = 0.0
        return state

    final_score = sum(valid_scores) / len(valid_scores)

    high_count = len([s for s in valid_scores if s > 70])
    if high_count > len(valid_scores) * 0.5:
        final_score += 5

    state.final_score = round(min(final_score, 100), 2)
    return state


def report_node(state: StoreState) -> StoreState:
    score = state.final_score

    if score < 40:
        level = "LOW"
        message = "Mostly human-written."
    elif score < 70:
        level = "MEDIUM"
        message = "Some AI patterns detected."
    else:
        level = "HIGH"
        message = "Strong AI-generated patterns detected."

    state.report = f"""
AI Detection Result: {score}% – {level} RISK

{message}

Chunks analyzed: {len(state.scores)}
High-risk chunks: {len([s for s in state.scores if s > 70])}
""".strip()

    return state



graph = StateGraph(StoreState)

graph.add_node("pdf_extract", pdf_extraction_node)
graph.add_node("merge_content", content_merger_node)
graph.add_node("chunking", chunking_node)
graph.add_node("llm_scoring", llm_scoring_node)
graph.add_node("aggregation", aggregation_node)
graph.add_node("generate_report", report_node)

graph.add_edge(START, "pdf_extract")
graph.add_edge("pdf_extract", "merge_content")
graph.add_edge("merge_content", "chunking")
graph.add_edge("chunking", "llm_scoring")
graph.add_edge("llm_scoring", "aggregation")
graph.add_edge("aggregation", "generate_report")
graph.add_edge("generate_report", END)

app = graph.compile()



if __name__ == "__main__":
    with open("final_report.pdf", "rb") as f:
        pdf_bytes = f.read()

    result = app.invoke({
        "pdf_bytes": pdf_bytes
    })

    print("\nFINAL SCORE:", result["final_score"])
    print("\nREPORT:\n", result["report"])