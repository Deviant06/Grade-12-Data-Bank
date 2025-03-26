
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Student } from '@/utils/studentData';
import { getGradeDistribution } from '@/utils/reportUtils';

interface AttendanceReportProps {
  students: Student[];
}

const AttendanceReport: React.FC<AttendanceReportProps> = ({ students }) => {
  const gradeDistribution = getGradeDistribution(students);
  
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
                  // Fixed type error by making sure it's a number
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
};

export default AttendanceReport;
