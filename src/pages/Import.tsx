import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { InfoIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as XLSX from 'xlsx';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setUploading(true);

      // Read the Excel file
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (!data) return;

        // Parse the Excel data
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Transform the data to match our database schema
        const students = jsonData.map((row: any) => ({
          student_id: row["Student ID"] || "",
          name: row["Name"] || "",
          grade: row["Grade"] || "",
          section: row["Section"] || "",
          // Add other fields as needed
        }));

        // Upload to Supabase
        const { error } = await supabase
          .from("students")
          .insert(students);

        if (error) {
          throw error;
        }

        toast.success(`${students.length} student records have been imported successfully!`);
        setFile(null);
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error("Error importing students:", error);
      toast.error("Error importing students");
    } finally {
      setUploading(false);
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
        
        <Alert className="mb-6 max-w-3xl mx-auto">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Bulk Import Instructions</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              Upload an Excel (.xlsx, .xls) or CSV file with student information. The system will automatically map columns and import the data.
            </p>
            <p className="text-sm">
              For best results, use column names like: First Name, Last Name, Gender, Date of Birth, etc. You can download a template below.
            </p>
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".xlsx,.xls"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Select Excel File
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
            {uploading ? "Importing..." : "Import"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Import;
