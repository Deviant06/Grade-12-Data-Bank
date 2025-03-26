import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import StudentTable from '@/components/StudentTable';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface Student {
  id: string;
  student_id: string;
  name: string;
  grade: string;
  section: string;
  created_at: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 px-4 pb-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Records</h1>
            <p className="text-muted-foreground">
              View, search, and manage all student records
            </p>
          </div>
          <Button variant="outline" onClick={fetchStudents} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <StudentTable students={students} onRefresh={fetchStudents} />
        )}
      </main>
    </div>
  );
};

export default Students;
