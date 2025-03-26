
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ImportExcel from '@/components/ImportExcel';
import { Student, dummyStudents } from '@/utils/studentData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const Import = () => {
  const [importedStudents, setImportedStudents] = useState<Student[]>([]);

  const handleImportComplete = (students: Student[]) => {
    setImportedStudents(students);
    // In a real app, you would save these to a database
    console.log('Imported students:', students);
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
        
        <ImportExcel onImportComplete={handleImportComplete} />
        
        {importedStudents.length > 0 && (
          <div className="mt-8 max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-xl font-semibold mb-2">Import Successful</h2>
            <p className="text-muted-foreground mb-4">
              {importedStudents.length} student records have been imported. In a real application, these would be saved to your database.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Import;
