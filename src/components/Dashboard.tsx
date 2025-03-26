
import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  GraduationCap,
  TrendingUp,
  Calendar,
  Clock,
  FileSpreadsheet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dummyStudents } from '@/utils/studentData';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

const Dashboard = () => {
  // Count students by grade level
  const studentsByGrade = dummyStudents.reduce((acc, student) => {
    acc[student.gradeLevel] = (acc[student.gradeLevel] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const gradeDistribution = Object.entries(studentsByGrade).map(([grade, count]) => ({
    name: `Grade ${grade}`,
    value: count
  }));

  // Calculate enrollment statistics
  const enrolled = dummyStudents.filter(s => s.enrollment.status === 'Enrolled').length;
  const transferred = dummyStudents.filter(s => s.enrollment.status === 'Transferred').length;
  const graduated = dummyStudents.filter(s => s.enrollment.status === 'Graduated').length;
  const dropped = dummyStudents.filter(s => s.enrollment.status === 'Dropped').length;
  const totalStudents = dummyStudents.length;

  // Average attendance rate
  const averageAttendance = dummyStudents.reduce((sum, student) => 
    sum + (student.attendanceRate || 0), 0) / totalStudents;

  // Gender distribution
  const maleCount = dummyStudents.filter(s => s.gender === 'Male').length;
  const femaleCount = dummyStudents.filter(s => s.gender === 'Female').length;
  
  const genderData = [
    { name: 'Male', value: maleCount },
    { name: 'Female', value: femaleCount }
  ];

  // Fake academic performance data
  const performanceData = [
    { subject: 'Math', averageScore: Math.floor(Math.random() * 11) + 80 },
    { subject: 'Science', averageScore: Math.floor(Math.random() * 11) + 80 },
    { subject: 'English', averageScore: Math.floor(Math.random() * 11) + 80 },
    { subject: 'Filipino', averageScore: Math.floor(Math.random() * 11) + 80 },
    { subject: 'History', averageScore: Math.floor(Math.random() * 11) + 80 },
    { subject: 'P.E.', averageScore: Math.floor(Math.random() * 11) + 80 },
  ];

  // Mock monthly attendance data
  const attendanceData = [
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
  ];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vedasto R. Santiago High School Student Information System overview
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="hover-scale glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Students</p>
                <h3 className="text-2xl font-bold">{totalStudents}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Enrolled</p>
                <h3 className="text-2xl font-bold">{enrolled}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Dropped</p>
                <h3 className="text-2xl font-bold">{dropped}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Graduated</p>
                <h3 className="text-2xl font-bold">{graduated}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-8">
        {/* Attendance chart */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Attendance Trend</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'white', border: 'none', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value) => [`${value}%`, 'Attendance Rate']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#0284c7" 
                    strokeWidth={2}
                    fill="url(#colorRate)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Academic performance */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Academic Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="subject" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'white', border: 'none', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value) => [`${value}%`, 'Average Score']}
                  />
                  <Bar dataKey="averageScore" radius={[4, 4, 0, 0]}>
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {/* Grade distribution */}
        <Card className="glass-card md:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Grade Level Distribution</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'Students']}
                    contentStyle={{ background: 'white', border: 'none', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gender distribution */}
        <Card className="glass-card md:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Gender Distribution</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    <Cell fill="#0088FE" />
                    <Cell fill="#FF8042" />
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'Students']}
                    contentStyle={{ background: 'white', border: 'none', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attendance summary */}
        <Card className="glass-card md:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Attendance Summary</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Average Attendance Rate</div>
                  <div className="text-sm font-medium">{averageAttendance.toFixed(1)}%</div>
                </div>
                <Progress value={averageAttendance} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 p-4 rounded-lg">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Highest Attendance</div>
                    <div className="text-xl font-bold">98%</div>
                    <div className="text-xs text-muted-foreground mt-1">Grade 10 - Faith</div>
                  </div>
                  <div className="bg-slate-100 p-4 rounded-lg">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Lowest Attendance</div>
                    <div className="text-xl font-bold">88%</div>
                    <div className="text-xs text-muted-foreground mt-1">Grade 7 - Peace</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Today's Attendance Status</div>
                  <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center font-medium">
                    92% of students present today
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

export default Dashboard;
