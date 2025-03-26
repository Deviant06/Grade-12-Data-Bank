import { useState } from 'react'
import { Button } from './ui/button'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

export function FileUpload() {
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    try {
      setUploading(true)

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('files')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(filePath)

      // Insert record into database
      const { error: dbError } = await supabase
        .from('files')
        .insert([
          {
            name: file.name,
            size: file.size,
            type: file.type,
            url: publicUrl,
            uploaded_at: new Date().toISOString()
          }
        ])

      if (dbError) {
        throw dbError
      }

      toast.success('File uploaded successfully!')
      setFile(null)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          Select File
        </label>
        {file && (
          <span className="text-sm text-muted-foreground">
            {file.name}
          </span>
        )}
      </div>
      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  )
} 