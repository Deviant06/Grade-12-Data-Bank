
import { Student } from '@/utils/studentData';

// Process data for grade level distribution
export const getGradeDistribution = (students: Student[]) => {
  return Object.entries(
    students.reduce((acc, student) => {
      acc[student.gradeLevel] = (acc[student.gradeLevel] || 0) + 1;
      return acc;
    }, {} as Record<number, number>)
  )
  .map(([grade, count]) => ({
    name: `Grade ${grade}`,
    value: count
  }))
  .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
};

// Process data for section distribution
export const getSectionDistribution = (students: Student[]) => {
  return Object.entries(
    students.reduce((acc, student) => {
      acc[student.section] = (acc[student.section] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
  .map(([section, count]) => ({
    name: section,
    value: count
  }));
};

// Process data for gender distribution
export const getGenderDistribution = (students: Student[]) => {
  return Object.entries(
    students.reduce((acc, student) => {
      acc[student.gender] = (acc[student.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
  .map(([gender, count]) => ({
    name: gender,
    value: count
  }));
};

// Process data for enrollment status
export const getEnrollmentStatus = (students: Student[]) => {
  return Object.entries(
    students.reduce((acc, student) => {
      acc[student.enrollment.status] = (acc[student.enrollment.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
  .map(([status, count]) => ({
    name: status,
    value: count
  }));
};

// Mock academic performance data by grade level
export const generatePerformanceData = () => {
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
