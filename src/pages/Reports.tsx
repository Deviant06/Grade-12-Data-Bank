import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { dummyStudents } from '@/utils/studentData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileDown, Printer } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('enrollment');
  const [academicYear, setAcademicYear] = useState('2023-2024');
  const [gradeLevel, setGradeLevel] = useState('all');
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Process data for grade level distribution
  const gradeDistribution = Object.entries(
    dummyStudents.reduce((acc, student) => {
      acc[student.gradeLevel] = (acc[student.gradeLevel] || 0) + 1;
      return acc;
    }, {} as Record<number, number>)
  )
  .map(([grade, count]) => ({
    name: `Grade ${grade}`,
    value: count
  }))
  .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
  
  // Process data for section distribution
  const sectionDistribution = Object.entries(
    dummyStudents.reduce((acc, student) => {
      acc[student.section] = (acc[student.section] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
  .map(([section, count]) => ({
    name: section,
    value: count
  }));
  
  // Process data for gender distribution
  const genderDistribution = Object.entries(
    dummyStudents.reduce((acc, student) => {
      acc[student.gender] = (acc[student.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
  .map(([gender, count]) => ({
    name: gender,
    value: count
  }));
  
  // Process data for enrollment status
  const enrollmentStatus = Object.entries(
    dummyStudents.reduce((acc, student) => {
      acc[student.enrollment.status] = (acc[student.enrollment.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
  .map(([status, count]) => ({
    name: status,
    value: count
  }));
  
  // Mock academic performance data by grade level
  const generatePerformanceData = () => {
    const subjects = ['Math', 'Science', 'English', 'Filipino', 'History', 'P.E.'];
    
    return Array.from({ length: 6 }, (_, i) => {
      const gradeLevel = i + 7; // Grade 7-12
      
      return {
        name: `Grade ${gradeLevel}`,
        ...subjects.reduce((acc, subject) => {
          acc[subject] = Math.floor(Math.random() * 11) + 80; // 80-90
          return acc;
        }, {} as Record<string, number>)
      };
    });
  };
  
  const performanceData = generatePerformanceData();
  
  const renderActiveReport = () => {
    switch (reportType) {
      case 'enrollment':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Grade Level Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeDistribution} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [value, 'Students']}
                        contentStyle={{ 
                          background: 'white', 
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Section Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectionDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {sectionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [value, 'Students']}
                        contentStyle={{ 
                          background: 'white', 
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [value, 'Students']}
                        contentStyle={{ 
                          background: 'white', 
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Enrollment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={enrollmentStatus}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {enrollmentStatus.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={
                              entry.name === 'Enrolled' ? '#22c55e' :
                              entry.name === 'Transferred' ? '#f59e0b' :
                              entry.name === 'Graduated' ? '#3b82f6' : '#ef4444'
                            } 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [value, 'Students']}
                        contentStyle={{ 
                          background: 'white', 
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'academic':
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Academic Performance by Grade Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[75, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Average Score']}
                        contentStyle={{ 
                          background: 'white', 
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="Math" fill="#0088FE" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Science" fill="#00C49F" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="English" fill="#FFBB28" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Filipino" fill="#FF8042" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="History" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="P.E." fill="#82ca9d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Top Performing Grade Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceData
                      .map(grade => ({
                        name: grade.name,
                        average: Object.entries(grade)
                          .filter(([key]) => key !== 'name')
                          .reduce((sum, [_, value]) => sum + (value as number), 0) / 6
                      }))
                      .sort((a, b) => b.average - a.average)
                      .slice(0, 3)
                      .map((grade, index) => (
                        <div key={grade.name} className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="text-sm font-medium">{grade.name}</div>
                            <div className="flex items-center mt-1">
                              <div className="h-2 bg-primary rounded-full" style={{ width: `${grade.average}%` }} />
                              <span className="ml-2 text-sm text-muted-foreground">{grade.average.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Subject Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Math', 'Science', 'English', 'Filipino', 'History', 'P.E.'].map(subject => {
                      const average = performanceData.reduce((sum, grade) => sum + (grade[subject] as number), 0) / performanceData.length;
                      return (
                        <div key={subject} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">{subject}</div>
                            <div className="text-sm text-muted-foreground">{average.toFixed(1)}%</div>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${average}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 'attendance':
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Attendance Rate by Grade Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={gradeDistribution.map(grade => ({
                        name: grade.name,
                        rate: Number(Math.floor(Math.random() * 10) + 88)
                      }))} 
                      margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Attendance Rate']}
                        contentStyle={{ 
                          background: 'white', 
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="rate" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Attendance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={[
                          { month: 'Jun', rate: 92 },
                          { month: 'Jul', rate: 94 },
                          { month: 'Aug', rate: 90 },
                          { month: 'Sep', rate: 88 },
                          { month: 'Oct', rate: 95 },
                          { month: 'Nov', rate: 97 },
                          { month: 'Dec', rate: 93 },
                          { month: 'Jan', rate: 91 },
                          { month: 'Feb', rate: 96 },
                          { month: 'Mar', rate: 98 }
                        ]} 
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis domain={[80, 100]} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Attendance Rate']}
                          contentStyle={{ 
                            background: 'white', 
                            border: 'none',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar dataKey="rate" fill="#22c55e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg text-center">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Overall Attendance</div>
                        <div className="text-3xl font-bold">93.5%</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg text-center">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Perfect Attendance</div>
                        <div className="text-3xl font-bold">18%</div>
                        <div className="text-xs text-muted-foreground mt-1">of all students</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Attendance by Gender</div>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">Male</div>
                            <div className="text-sm text-muted-foreground">92.8%</div>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '92.8%' }} />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">Female</div>
                            <div className="text-sm text-muted-foreground">94.2%</div>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: '94.2%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
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
        
        {/* Report content */}
        {renderActiveReport()}
      </main>
    </div>
  );
};

export default Reports;
