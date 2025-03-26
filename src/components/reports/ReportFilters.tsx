
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileDown, Printer } from 'lucide-react';

interface ReportFiltersProps {
  reportType: string;
  setReportType: (value: string) => void;
  academicYear: string;
  setAcademicYear: (value: string) => void;
  gradeLevel: string;
  setGradeLevel: (value: string) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  reportType,
  setReportType,
  academicYear,
  setAcademicYear,
  gradeLevel,
  setGradeLevel
}) => {
  return (
    <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
      <Tabs value={reportType} onValueChange={setReportType} className="w-full md:w-auto">
        <TabsList>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-wrap gap-3 items-center ml-auto">
        <div className="flex items-center gap-2">
          <span className="text-sm">Academic Year:</span>
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2022-2023">2022-2023</SelectItem>
              <SelectItem value="2021-2022">2021-2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Grade Level:</span>
          <Select value={gradeLevel} onValueChange={setGradeLevel}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="7">Grade 7</SelectItem>
              <SelectItem value="8">Grade 8</SelectItem>
              <SelectItem value="9">Grade 9</SelectItem>
              <SelectItem value="10">Grade 10</SelectItem>
              <SelectItem value="11">Grade 11</SelectItem>
              <SelectItem value="12">Grade 12</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
