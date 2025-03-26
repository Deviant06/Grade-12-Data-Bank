
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  address: string;
  contactNumber?: string;
  email?: string;
  guardianName?: string;
  guardianContact?: string;
  gradeLevel: number;
  section: string;
  academicYear: string;
  lrn: string; // Learner Reference Number
  enrollment: {
    status: 'Enrolled' | 'Transferred' | 'Graduated' | 'Dropped';
    date: string;
  };
  attendanceRate?: number;
  subjects?: {
    name: string;
    grades: {
      quarter: number;
      score: number;
    }[];
  }[];
  profileImage?: string;
}

// Generate dummy data for testing
export const generateDummyStudents = (count: number = 50): Student[] => {
  const sections = ['Peace', 'Love', 'Hope', 'Faith', 'Charity'];
  const subjects = ['Math', 'Science', 'English', 'Filipino', 'History', 'P.E.', 'Values Education'];
  
  return Array.from({ length: count }, (_, i) => {
    const id = (i + 1).toString().padStart(4, '0');
    const gradeLevel = Math.floor(Math.random() * 6) + 7; // Grade 7-12
    const section = sections[Math.floor(Math.random() * sections.length)];
    
    // Generate random grades
    const studentSubjects = subjects.map(name => ({
      name,
      grades: Array.from({ length: 4 }, (_, q) => ({
        quarter: q + 1,
        score: Math.floor(Math.random() * 31) + 70 // 70-100
      }))
    }));
    
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    
    return {
      id,
      firstName: `FirstName${id}`,
      lastName: `LastName${id}`,
      middleName: `M.`,
      gender,
      dateOfBirth: new Date(2000 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      address: `${Math.floor(Math.random() * 1000) + 1} Example St., City`,
      contactNumber: `09${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
      email: `student${id}@example.com`,
      guardianName: `Guardian${id}`,
      guardianContact: `09${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
      gradeLevel,
      section,
      academicYear: '2023-2024',
      lrn: Math.floor(Math.random() * 10000000000).toString().padStart(12, '0'),
      enrollment: {
        status: 'Enrolled',
        date: new Date(2023, 5, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0]
      },
      attendanceRate: Math.floor(Math.random() * 20) + 80, // 80-100%
      subjects: studentSubjects,
      profileImage: gender === 'Male' 
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&gender=male` 
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&gender=female`
    };
  });
};

// Sample dummy data
export const dummyStudents = generateDummyStudents(50);

// Helper function to filter students
export const filterStudents = (
  students: Student[],
  searchTerm: string
): Student[] => {
  if (!searchTerm.trim()) return students;
  
  const lowercasedTerm = searchTerm.toLowerCase().trim();
  
  return students.filter(student => {
    return (
      student.firstName.toLowerCase().includes(lowercasedTerm) ||
      student.lastName.toLowerCase().includes(lowercasedTerm) ||
      student.middleName?.toLowerCase().includes(lowercasedTerm) ||
      student.id.toLowerCase().includes(lowercasedTerm) ||
      student.lrn.toLowerCase().includes(lowercasedTerm) ||
      student.section.toLowerCase().includes(lowercasedTerm) ||
      student.email?.toLowerCase().includes(lowercasedTerm) ||
      `${student.firstName.toLowerCase()} ${student.lastName.toLowerCase()}`.includes(lowercasedTerm) ||
      `${student.lastName.toLowerCase()}, ${student.firstName.toLowerCase()}`.includes(lowercasedTerm)
    );
  });
};

// Excel import helper
export interface ExcelRow {
  [key: string]: any;
}

export const processExcelData = (rows: ExcelRow[]): Student[] => {
  return rows.map((row, index) => {
    const id = (index + 1).toString().padStart(4, '0');
    const gender = row.gender?.toLowerCase() === 'male' ? 'Male' : 
                  row.gender?.toLowerCase() === 'female' ? 'Female' : 'Other';
    
    return {
      id: row.id || id,
      firstName: row.firstName || row['first_name'] || row['First Name'] || '',
      lastName: row.lastName || row['last_name'] || row['Last Name'] || '',
      middleName: row.middleName || row['middle_name'] || row['Middle Name'] || '',
      gender: gender,
      dateOfBirth: row.dateOfBirth || row['date_of_birth'] || row['Date of Birth'] || new Date().toISOString().split('T')[0],
      address: row.address || row['Address'] || '',
      contactNumber: row.contactNumber || row['contact_number'] || row['Contact Number'] || '',
      email: row.email || row['Email'] || '',
      guardianName: row.guardianName || row['guardian_name'] || row['Guardian Name'] || '',
      guardianContact: row.guardianContact || row['guardian_contact'] || row['Guardian Contact'] || '',
      gradeLevel: parseInt(row.gradeLevel || row['grade_level'] || row['Grade Level'] || '0', 10),
      section: row.section || row['Section'] || '',
      academicYear: row.academicYear || row['academic_year'] || row['Academic Year'] || '2023-2024',
      lrn: row.lrn || row['LRN'] || row['Learner Reference Number'] || '',
      enrollment: {
        status: 'Enrolled',
        date: row.enrollmentDate || row['enrollment_date'] || row['Enrollment Date'] || new Date().toISOString().split('T')[0]
      },
      attendanceRate: parseFloat(row.attendanceRate || row['attendance_rate'] || row['Attendance Rate'] || '100'),
      subjects: [],
      profileImage: gender === 'Male' 
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&gender=male` 
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&gender=female`
    };
  });
};
