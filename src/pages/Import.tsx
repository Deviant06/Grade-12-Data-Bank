import React, { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { InfoIcon, Upload, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

interface Student {
  student_id: string;
  name: string;
  grade: string;
  section: string;
}

const Import = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState<Student[]>([]);
  const [invalidRows, setInvalidRows] = useState<number[]>([]);
  const navigate = useNavigate();

  const validateAndPreviewFile = async (file: File) => {
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            throw new Error('No data read from file');
          }

          // Parse the Excel data
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            throw new Error('No valid data found in file');
          }

          // Transform and validate the data
          const students = jsonData.map((row: any) => ({
            student_id: String(row["Student ID"] || "").trim(),
            name: String(row["Name"] || "").trim(),
            grade: String(row["Grade"] || "").trim(),
            section: String(row["Section"] || "").trim(),
          }));

          // Find invalid rows
          const invalid = students.reduce((acc: number[], student, index) => {
            if (!student.student_id || !student.name || !student.grade || !student.section) {
              acc.push(index);
            }
            return acc;
          }, []);

          setPreviewData(students);
          setInvalidRows(invalid);

          if (invalid.length > 0) {
            toast.warning(`${invalid.length} records have missing required fields. Please check the preview below.`);
          } else {
            toast.success('File validated successfully. Review the data below before importing.');
          }
        } catch (error) {
          console.error('Error previewing file:', error);
          toast.error(error instanceof Error ? error.message : 'Error previewing file');
          setFile(null);
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Error reading file');
      setFile(null);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile(file);
      validateAndPreviewFile(file);
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
      if (rejectedFiles[0]?.errors[0]?.code === 'file-too-large') {
        toast.error('File is too large. Maximum size is 5MB.');
      } else if (rejectedFiles[0]?.errors[0]?.code === 'file-invalid-type') {
        toast.error('Invalid file type. Please upload an Excel or CSV file.');
      }
    }
  });

  const handleImport = async () => {
    if (!file || invalidRows.length > 0) {
      toast.error(invalidRows.length > 0 ? "Please fix invalid records before importing" : "Please select a file first");
      return;
    }

    try {
      setUploading(true);

      // Transform data to match Supabase schema
      const studentsToImport = previewData.map(student => ({
        student_id: student.student_id,
        name: student.name,
        grade: student.grade,
        section: student.section
      }));

      console.log('Importing students:', studentsToImport);

      // Try a single record first to test the connection
      const testResult = await supabase
        .from("students")
        .insert([studentsToImport[0]])
        .select();

      console.log('Test import result:', testResult);

      if (testResult.error) {
        throw new Error(`Database error: ${testResult.error.message}`);
      }

      // If test successful, proceed with batch import
      const batchSize = 50;
      const batches = [];
      
      for (let i = 0; i < studentsToImport.length; i += batchSize) {
        const batch = studentsToImport.slice(i, i + batchSize);
        batches.push(batch);
      }

      let importedCount = 0;
      
      for (const batch of batches) {
        const { data, error } = await supabase
          .from("students")
          .insert(batch)
          .select();

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        console.log('Batch import result:', data);
        importedCount += batch.length;
        toast.success(`Imported ${importedCount} of ${studentsToImport.length} students...`);
      }

      toast.success(`Successfully imported ${importedCount} students!`);
      navigate('/students');
      setFile(null);
      setPreviewData([]);
      setInvalidRows([]);
    } catch (error: any) {
      console.error('Error importing students:', error);
      toast.error(`Failed to import students: ${error.message}`);
      
      // Additional error details
      if (error.code) {
        console.error('Error code:', error.code);
      }
      if (error.details) {
        console.error('Error details:', error.details);
      }
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    try {
      // Create a sample Excel template
      const ws = XLSX.utils.json_to_sheet([{
        'Student ID': '2024-0001',
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

          {previewData.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Data Preview</h3>
                <p className="text-sm text-muted-foreground">
                  Showing {previewData.length} records
                </p>
              </div>

              {invalidRows.length > 0 && (
                <Alert className="mb-4" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Invalid Records Found</AlertTitle>
                  <AlertDescription>
                    {invalidRows.length} records have missing required fields (highlighted in red).
                    Please fix these records in your Excel file and upload again.
                  </AlertDescription>
                </Alert>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Row #</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Section</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((student, index) => (
                      <TableRow 
                        key={index}
                        className={invalidRows.includes(index) ? 'bg-red-50' : undefined}
                      >
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className={!student.student_id ? 'text-red-500' : undefined}>
                          {student.student_id || 'Missing'}
                        </TableCell>
                        <TableCell className={!student.name ? 'text-red-500' : undefined}>
                          {student.name || 'Missing'}
                        </TableCell>
                        <TableCell className={!student.grade ? 'text-red-500' : undefined}>
                          {student.grade || 'Missing'}
                        </TableCell>
                        <TableCell className={!student.section ? 'text-red-500' : undefined}>
                          {student.section || 'Missing'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {invalidRows.length === 0 ? (
                    <span className="text-green-600">✓ All records are valid</span>
                  ) : (
                    <span className="text-red-500">
                      ⚠ {invalidRows.length} invalid records found
                    </span>
                  )}
                </p>
                <Button
                  onClick={handleImport}
                  disabled={uploading || invalidRows.length > 0}
                  className="ml-auto"
                >
                  {uploading ? "Importing..." : "Import Students"}
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-green-600 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span>
              Bulk import automatically validates data
            </p>
            <Button variant="outline" onClick={downloadTemplate}>
              Download Template
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Import;
