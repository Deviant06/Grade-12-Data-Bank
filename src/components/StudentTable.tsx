
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  MoreHorizontal, 
  FileEdit, 
  Trash2, 
  FilePlus, 
  Filter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { filterStudents, Student } from '@/utils/studentData';
import { useToast } from '@/hooks/use-toast';

interface StudentTableProps {
  students: Student[];
}

const StudentTable: React.FC<StudentTableProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Student>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { toast } = useToast();

  const rowsPerPage = 10;
  
  // Get available grade levels and sections
  const gradeOptions = Array.from(new Set(students.map(s => s.gradeLevel))).sort();
  const sectionOptions = Array.from(new Set(students.map(s => s.section))).sort();

  // Filter students based on search term, grade level, and section
  const filteredStudents = students.filter(student => {
    let matchesGrade = true;
    let matchesSection = true;
    let matchesSearch = true;
    
    if (selectedGrade !== null) {
      matchesGrade = student.gradeLevel === selectedGrade;
    }
    
    if (selectedSection !== null) {
      matchesSection = student.section === selectedSection;
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      matchesSearch = 
        student.firstName.toLowerCase().includes(search) ||
        student.lastName.toLowerCase().includes(search) ||
        student.id.toLowerCase().includes(search) ||
        student.section.toLowerCase().includes(search) ||
        student.lrn.toLowerCase().includes(search) ||
        `${student.firstName.toLowerCase()} ${student.lastName.toLowerCase()}`.includes(search) ||
        `${student.lastName.toLowerCase()}, ${student.firstName.toLowerCase()}`.includes(search);
    }
    
    return matchesGrade && matchesSection && matchesSearch;
  });

  // Sort filtered students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // Paginate sorted students
  const totalPages = Math.ceil(sortedStudents.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedStudents = sortedStudents.slice(startIndex, startIndex + rowsPerPage);

  // Handle sort
  const handleSort = (field: keyof Student) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSelectedGrade(null);
    setSelectedSection(null);
    setSearchTerm('');
  };

  const handleAction = (action: string, student: Student) => {
    switch (action) {
      case 'edit':
        toast({
          title: "Edit Student",
          description: `Editing ${student.firstName} ${student.lastName}'s record`,
        });
        break;
      case 'delete':
        toast({
          title: "Delete Student",
          description: `${student.firstName} ${student.lastName}'s record would be deleted`,
          variant: "destructive",
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 h-10">
                <Filter className="h-4 w-4" /> 
                Filter
                {(selectedGrade !== null || selectedSection !== null) && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1">
                    {(selectedGrade !== null && selectedSection !== null) ? 2 :
                     (selectedGrade !== null || selectedSection !== null) ? 1 : 0}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pt-2">
                Grade Level
              </DropdownMenuLabel>
              <div className="p-2 grid grid-cols-3 gap-1">
                {gradeOptions.map(grade => (
                  <Badge 
                    key={grade}
                    variant={selectedGrade === grade ? "default" : "outline"}
                    className="cursor-pointer hover:bg-muted text-center justify-center"
                    onClick={() => setSelectedGrade(selectedGrade === grade ? null : grade)}
                  >
                    {grade}
                  </Badge>
                ))}
              </div>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pt-2">
                Section
              </DropdownMenuLabel>
              <div className="p-2 grid grid-cols-2 gap-1">
                {sectionOptions.map(section => (
                  <Badge 
                    key={section}
                    variant={selectedSection === section ? "default" : "outline"}
                    className="cursor-pointer hover:bg-muted text-center justify-center"
                    onClick={() => setSelectedSection(selectedSection === section ? null : section)}
                  >
                    {section}
                  </Badge>
                ))}
              </div>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-center cursor-pointer justify-center"
                onClick={resetFilters}
              >
                Reset Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button>
            <FilePlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-[250px]">
                <div 
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort('lastName')}
                >
                  Student Name
                  {sortField === 'lastName' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort('lrn')}
                >
                  LRN
                  {sortField === 'lrn' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort('gradeLevel')}
                >
                  Grade & Section
                  {sortField === 'gradeLevel' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Gender</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student, index) => (
                <TableRow 
                  key={student.id} 
                  className="hover-scale transition-all-200 cursor-pointer hover:bg-slate-50"
                >
                  <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-slate-200">
                        <AvatarImage src={student.profileImage} alt={`${student.firstName} ${student.lastName}`} />
                        <AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.lastName}, {student.firstName} {student.middleName}</div>
                        <div className="text-xs text-muted-foreground">ID: {student.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.lrn}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-normal">
                        Grade {student.gradeLevel}
                      </Badge>
                      <Badge variant="secondary" className="font-normal">
                        {student.section}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction('edit', student)}>
                          <FileEdit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('delete', student)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <div className="text-lg font-medium">No students found</div>
                    <div className="text-sm text-muted-foreground">
                      {searchTerm || selectedGrade || selectedSection ? 
                        "Try adjusting your search or filters" : 
                        "No student records available"}
                    </div>
                    {(searchTerm || selectedGrade || selectedSection) && (
                      <Button variant="outline" onClick={resetFilters} className="mt-2">
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
      <div className="mt-4 text-sm text-muted-foreground text-center">
        Showing {paginatedStudents.length} of {filteredStudents.length} students
      </div>
    </div>
  );
};

export default StudentTable;
