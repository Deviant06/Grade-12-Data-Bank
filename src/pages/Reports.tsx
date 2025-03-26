
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { dummyStudents } from '@/utils/studentData';
import EnrollmentReport from '@/components/reports/EnrollmentReport';
import AcademicReport from '@/components/reports/AcademicReport';
import AttendanceReport from '@/components/reports/AttendanceReport';
import ReportFilters from '@/components/reports/ReportFilters';

const Reports = () => {
  const [reportType, setReportType] = useState('enrollment');
  const [academicYear, setAcademicYear] = useState('2023-2024');
  const [gradeLevel, setGradeLevel] = useState('all');
  
  const renderActiveReport = () => {
    switch (reportType) {
      case 'enrollment':
        return <EnrollmentReport students={dummyStudents} />;
        
      case 'academic':
        return <AcademicReport />;
        
      case 'attendance':
        return <AttendanceReport students={dummyStudents} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 px-4 pb-10 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and view reports on student data
          </p>
        </div>
        
        {/* Report filters */}
        <ReportFilters 
          reportType={reportType}
          setReportType={setReportType}
          academicYear={academicYear}
          setAcademicYear={setAcademicYear}
          gradeLevel={gradeLevel}
          setGradeLevel={setGradeLevel}
        />
        
        {/* Report content */}
        {renderActiveReport()}
      </main>
    </div>
  );
};

export default Reports;
