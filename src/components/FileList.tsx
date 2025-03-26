import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface File {
  id: number
  name: string
  size: number
  type: string
  url: string
  uploaded_at: string
}

export function FileList() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) {
        throw error
      }

      setFiles(data || [])
    } catch (error) {
      console.error('Error fetching files:', error)
      toast.error('Error fetching files')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Uploaded Files</h2>
      <div className="grid gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{file.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)} • {new Date(file.uploaded_at).toLocaleDateString()}
                </p>
              </div>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 