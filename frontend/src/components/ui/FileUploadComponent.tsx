import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  maxSizeMB?: number
  acceptedFileTypes?: Record<string, string[]>
  disabled?: boolean
}

export default function FileUploadComponent({ 
  onFileSelect, 
  maxSizeMB = 5, 
  acceptedFileTypes = { 'application/pdf': ['.pdf'] },
  disabled = false
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      setError(`File must be a PDF and smaller than ${maxSizeMB}MB`)
      return
    }
    
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      setError(null)
      simulateUpload(selectedFile)
    }
  }, [maxSizeMB])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
    disabled: disabled || uploading
  })

  const simulateUpload = (file: File) => {
    setUploading(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          onFileSelect(file)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setFile(null)
    setProgress(0)
    setUploading(false)
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...getRootProps()}
            className={clsx(
              'drop-zone p-8 flex flex-col items-center justify-center cursor-pointer transition-all',
              isDragActive && 'dragging',
              (disabled || uploading) && 'opacity-50 cursor-not-allowed grayscale-[0.5]'
            )}
          >
            <input {...getInputProps()} />
            <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
              <Upload className="text-primary-600" size={24} />
            </div>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Click or drag to upload
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              PDF only (max. {maxSizeMB}MB)
            </p>
            {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
          </motion.div>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl border"
            style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • {uploading ? 'Uploading...' : 'Ready'}
                </p>
              </div>
              <button 
                onClick={removeFile}
                className="p-2 rounded-xl btn-ghost hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted text-slate-500">Upload Progress</span>
                <span className="text-[10px] font-bold text-primary-600">{progress}%</span>
              </div>
              <div className="progress-bar h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={clsx(
                    'h-full transition-all duration-300',
                    progress === 100 ? 'bg-green-500' : 'bg-primary-500'
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {progress === 100 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 flex items-center gap-2 text-xs text-green-600 font-semibold"
              >
                <CheckCircle2 size={14} /> File uploaded successfully
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
