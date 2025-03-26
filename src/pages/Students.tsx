
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import StudentTable from '@/components/StudentTable';
import { dummyStudents } from '@/utils/studentData';

const Students = () => {
  const [students, setStudents] = useState(dummyStudents);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 px-4 pb-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Student Records</h1>
          <p className="text-muted-foreground">
            View, search, and manage all student records
          </p>
        </div>
        
        <StudentTable students={students} />
      </main>
    </div>
  );
};

export default Students;
