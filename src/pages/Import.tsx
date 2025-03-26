import React, { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { InfoIcon, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';

interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  // Add other fields as needed
}

const Import = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      console.log('File selected:', acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
    onDropRejected: (rejectedFiles) => {
      console.log('Files rejected:', rejectedFiles);
      if (rejectedFiles[0]?.errors[0]?.code === 'file-too-large') {
        toast.error('File is too large. Maximum size is 5MB.');
      } else if (rejectedFiles[0]?.errors[0]?.code === 'file-invalid-type') {
        toast.error('Invalid file type. Please upload an Excel or CSV file.');
      }
    }
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      console.log('Starting file upload process...');

      // Read the Excel file
      const reader = new FileReader();
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        toast.error('Error reading file');
        setUploading(false);
      };

      reader.onload = async (e) => {
        try {
          console.log('File read successfully');
          const data = e.target?.result;
          if (!data) {
            throw new Error('No data read from file');
          }

          // Parse the Excel data
          console.log('Parsing Excel data...');
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          console.log('Parsed data:', jsonData);

          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            throw new Error('No valid data found in file');
          }

          // Transform the data to match our database schema
          console.log('Transforming data...');
          const students = jsonData.map((row: any) => ({
            student_id: row["Student ID"] || "",
            name: row["Name"] || "",
            grade: row["Grade"] || "",
            section: row["Section"] || "",
            // Add other fields as needed
          }));

          // Validate data
          const invalidStudents = students.filter(student => 
            !student.student_id || !student.name || !student.grade || !student.section
          );

          if (invalidStudents.length > 0) {
            throw new Error(`${invalidStudents.length} records are missing required fields`);
          }

          // Upload to Supabase
          console.log('Uploading to Supabase...');
          const { error } = await supabase
            .from("students")
            .insert(students);

          if (error) {
            throw error;
          }

          console.log('Upload successful');
          toast.success(`${students.length} student records have been imported successfully!`);
          setFile(null);
        } catch (error) {
          console.error('Error in reader.onload:', error);
          toast.error(error instanceof Error ? error.message : 'Error processing file');
        } finally {
          setUploading(false);
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error("Error in handleUpload:", error);
      toast.error("Error importing students");
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    try {
      // Create a sample Excel template
      const ws = XLSX.utils.json_to_sheet([{
        'Student ID': 'Sample-001',
        'Name': 'Juan Dela Cruz',
        'Grade': '12',
        'Section': 'A'
      }]);
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Students');
      
      // Save the file
      XLSX.writeFile(wb, 'student-import-template.xlsx');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Error downloading template');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 px-4 pb-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
          <p className="text-muted-foreground">
            Upload student information from Excel files
          </p>
        </div>
        
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Bulk Import Instructions</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              Upload an Excel (.xlsx, .xls) or CSV file with student information. The system will automatically map columns and import the data.
            </p>
            <p className="text-sm">
              For best results, use column names like: Student ID, Name, Grade, Section. You can download a template below.
            </p>
          </AlertDescription>
        </Alert>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Import Student Records</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Upload an Excel or CSV file containing student information
          </p>

          <div 
            {...getRootProps()} 
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200 ease-in-out
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              hover:border-primary hover:bg-primary/5
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-lg font-medium">Drag and drop your file here</p>
              <p className="text-sm text-muted-foreground">or click the button below to browse files</p>
              <Button variant="secondary" className="mt-2">
                Select File
              </Button>
            </div>
            {file && (
              <p className="mt-4 text-sm text-muted-foreground">
                Selected file: {file.name}
              </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Supports Excel (.xlsx, .xls) and CSV files up to 5MB
            </p>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-green-600 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span>
              Bulk import automatically validates data
            </p>
            <Button variant="outline" onClick={downloadTemplate}>
              Download Template
            </Button>
          </div>

          {file && (
            <Button 
              className="mt-6 w-full"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Importing..." : "Import Students"}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Import;
