
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';
import { generatePerformanceData } from '@/utils/reportUtils';

const AcademicReport: React.FC = () => {
  const performanceData = generatePerformanceData();

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
};

export default AcademicReport;
