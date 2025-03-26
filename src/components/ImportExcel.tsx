
import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { processExcelData, ExcelRow, Student } from '@/utils/studentData';
import { useToast } from '@/hooks/use-toast';
import { ProgressCircle } from './ProgressCircle';
import * as XLSX from 'xlsx';

interface ImportExcelProps {
  onImportComplete: (students: Student[]) => void;
}

const ImportExcel: React.FC<ImportExcelProps> = ({ onImportComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Check file type
    const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileType !== 'xlsx' && fileType !== 'xls' && fileType !== 'csv') {
      setError('Please upload an Excel or CSV file');
      setFile(null);
      e.target.value = '';
      return;
    }
    
    // Check file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      setFile(null);
      e.target.value = '';
      return;
    }
    
    setFile(selectedFile);
    readFileData(selectedFile);
  };

  const readFileData = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];
        
        if (jsonData.length === 0) {
          setError('The file contains no data');
          setPreviewData([]);
          return;
        }
        
        // Process the Excel data
        const processedData = processExcelData(jsonData);
        setPreviewData(processedData.slice(0, 5)); // Show preview of first 5 rows
      } catch (err) {
        console.error('Error parsing Excel file:', err);
        setError('Failed to parse the Excel file. Please check the format.');
        setPreviewData([]);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading the file');
      setPreviewData([]);
    };
    
    reader.readAsBinaryString(file);
  };

  const handleFileUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Simulate processing time
          setTimeout(() => {
            processFile();
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const processFile = () => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];
          
          // Process the Excel data
          const processedData = processExcelData(jsonData);
          
          // Notify parent component
          onImportComplete(processedData);
          
          // Show success toast
          toast({
            title: "Import Successful",
            description: `${processedData.length} student records imported successfully.`,
          });
          
          // Reset state
          setFile(null);
          setIsUploading(false);
          setPreviewData([]);
          if (fileInputRef.current) fileInputRef.current.value = '';
          
        } catch (err) {
          console.error('Error processing Excel file:', err);
          setError('Failed to process the Excel file');
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Error reading the file');
        setIsUploading(false);
      };
      
      reader.readAsBinaryString(file);
      
    } catch (err) {
      console.error('Error during file processing:', err);
      setError('An unexpected error occurred');
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError(null);
    const droppedFile = e.dataTransfer.files[0];
    
    if (!droppedFile) return;
    
    // Check file type
    const fileType = droppedFile.name.split('.').pop()?.toLowerCase();
    if (fileType !== 'xlsx' && fileType !== 'xls' && fileType !== 'csv') {
      setError('Please upload an Excel or CSV file');
      return;
    }
    
    // Check file size (5MB limit)
    if (droppedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }
    
    setFile(droppedFile);
    readFileData(droppedFile);
    
    // Update the file input for consistency
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewData([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    // Create template data
    const template = [
      {
        'First Name': 'John',
        'Last Name': 'Doe',
        'Middle Name': 'Smith',
        'Gender': 'Male',
        'Date of Birth': '2005-01-15',
        'Address': '123 Main St',
        'Contact Number': '09123456789',
        'Email': 'john.doe@example.com',
        'Guardian Name': 'Jane Doe',
        'Guardian Contact': '09987654321',
        'Grade Level': 10,
        'Section': 'Peace',
        'Academic Year': '2023-2024',
        'LRN': '123456789012',
        'Enrollment Date': '2023-06-01'
      },
      // Add a few more example rows
    ];
    
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Student Template');
    
    // Generate Excel file
    XLSX.writeFile(wb, 'student_import_template.xlsx');
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Import Student Records</CardTitle>
          <CardDescription>
            Upload an Excel or CSV file containing student information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div 
            className={`relative border-2 border-dashed rounded-lg p-6 ${
              file ? 'border-primary/50 bg-primary/5' : 'border-gray-300 hover:border-primary/30 hover:bg-slate-50'
            } transition-all text-center`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={isUploading}
            />
            
            {!file ? (
              <div className="py-4">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Drag and drop your file here</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  or click the button below to browse files
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Select File
                </Button>
                <div className="mt-4 text-xs text-muted-foreground">
                  Supports Excel (.xlsx, .xls) and CSV files up to 5MB
                </div>
              </div>
            ) : (
              <div className="py-4">
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <ProgressCircle value={uploadProgress} size={80} />
                    <div className="text-sm font-medium">
                      {uploadProgress < 100 ? 'Uploading...' : 'Processing file...'}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">{file.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Button onClick={handleFileUpload} className="px-4">
                        Process File
                      </Button>
                      <Button variant="outline" onClick={resetForm} className="px-4">
                        Change File
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Preview section */}
          {previewData.length > 0 && !isUploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Preview (First 5 records)</h3>
                <Button variant="ghost" size="sm" onClick={resetForm} className="h-8 px-2">
                  <X className="h-4 w-4 mr-1" /> Clear
                </Button>
              </div>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs">
                    <tr>
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">LRN</th>
                      <th className="px-3 py-2 text-left">Grade</th>
                      <th className="px-3 py-2 text-left">Section</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((student, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-2">{student.lastName}, {student.firstName}</td>
                        <td className="px-3 py-2">{student.lrn}</td>
                        <td className="px-3 py-2">{student.gradeLevel}</td>
                        <td className="px-3 py-2">{student.section}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
            <span>Bulk import automatically validates data</span>
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImportExcel;
