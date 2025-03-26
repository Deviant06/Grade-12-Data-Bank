import { FileUpload } from './components/FileUpload'
import { FileList } from './components/FileList'
import { Toaster } from 'sonner'

function App() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Data Bridge HQ</h1>
      <div className="space-y-8">
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Upload Files</h2>
          <FileUpload />
        </div>
        <FileList />
      </div>
      <Toaster />
    </div>
  )
}

export default App
