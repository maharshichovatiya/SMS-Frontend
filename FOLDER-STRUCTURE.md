# School Management System - Production Folder Structure

```
school_management_system_frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group for auth pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Route group for dashboard
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── students/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── teachers/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── classes/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── attendance/
│   │   │   ├── page.tsx
│   │   │   └── take/
│   │   │       └── page.tsx
│   │   ├── grades/
│   │   │   ├── page.tsx
│   │   │   └── [studentId]/
│   │   │       └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── loading.tsx
├── components/                   # Reusable UI components
│   ├── ui/                      # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Card.tsx
│   │   ├── Loading.tsx
│   │   ├── Badge.tsx
│   │   └── index.ts
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── forms/                   # Form components
│   │   ├── StudentForm.tsx
│   │   ├── TeacherForm.tsx
│   │   ├── ClassForm.tsx
│   │   └── AttendanceForm.tsx
│   ├── tables/                  # Table components
│   │   ├── StudentTable.tsx
│   │   ├── TeacherTable.tsx
│   │   ├── AttendanceTable.tsx
│   │   └── GradeTable.tsx
│   └── charts/                  # Chart components
│       ├── AttendanceChart.tsx
│       ├── GradeChart.tsx
│       └── PerformanceChart.tsx
├── lib/                         # Utility libraries
│   ├── api/                     # API utilities
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── students.ts
│   │   ├── teachers.ts
│   │   ├── classes.ts
│   │   ├── attendance.ts
│   │   └── grades.ts
│   ├── validations/             # Form validations
│   │   ├── authSchema.ts
│   │   ├── studentSchema.ts
│   │   ├── teacherSchema.ts
│   │   └── classSchema.ts
│   ├── utils/                   # Helper functions
│   │   ├── date.ts
│   │   ├── format.ts
│   │   ├── storage.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── usePagination.ts
│   ├── providers/               # Context providers
│   │   ├── AuthProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ApiProvider.tsx
│   └── types/                   # TypeScript types
│       ├── auth.ts
│       ├── student.ts
│       ├── teacher.ts
│       ├── class.ts
│       ├── attendance.ts
│       ├── grade.ts
│       └── api.ts
├── hooks/                       # Global custom hooks
│   ├── useAuth.ts
│   ├── useStudents.ts
│   ├── useTeachers.ts
│   └── useAttendance.ts
├── store/                       # State management
│   ├── authStore.ts
│   ├── studentStore.ts
│   └── index.ts
├── styles/                      # Global styles
│   ├── globals.css
│   └── components.css
├── public/                      # Static assets
│   ├── icons/
│   ├── images/
│   └── favicon.ico
└── config/                      # Configuration files
    ├── constants.ts
    ├── routes.ts
    └── env.ts
```

## 📁 Function Organization Examples

### 1. API Functions (lib/api/)

```typescript
// lib/api/students.ts
import { apiClient } from "./client";
import { Student, CreateStudentData, UpdateStudentData } from "../types";

export const studentApi = {
  getAll: async (): Promise<Student[]> => {
    const response = await apiClient.get("/students");
    return response.data;
  },

  getById: async (id: string): Promise<Student> => {
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  },

  create: async (data: CreateStudentData): Promise<Student> => {
    const response = await apiClient.post("/students", data);
    return response.data;
  },

  update: async (id: string, data: UpdateStudentData): Promise<Student> => {
    const response = await apiClient.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  },
};
```

### 2. Form Handlers (components/forms/)

```typescript
// components/forms/StudentForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema } from '@/lib/validations/studentSchema';
import { studentApi } from '@/lib/api/students';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type StudentFormData = z.infer<typeof studentSchema>;

export function StudentForm({ initialData, onSuccess }: StudentFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData
  });

  const onSubmit = async (data: StudentFormData) => {
    setIsLoading(true);
    try {
      if (initialData?.id) {
        await studentApi.update(initialData.id, data);
      } else {
        await studentApi.create(data);
      }
      onSuccess?.();
      reset();
    } catch (error) {
      console.error('Error saving student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="First Name"
        {...register('firstName')}
        error={errors.firstName?.message}
      />
      <Input
        label="Last Name"
        {...register('lastName')}
        error={errors.lastName?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : initialData?.id ? 'Update' : 'Create'} Student
      </Button>
    </form>
  );
}
```

### 3. Custom Hooks (hooks/)

```typescript
// hooks/useStudents.ts
"use client";

import { useState, useEffect } from "react";
import { studentApi } from "@/lib/api/students";
import { Student } from "@/lib/types";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentApi.getAll();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData: CreateStudentData) => {
    try {
      const newStudent = await studentApi.create(studentData);
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    } catch (err) {
      setError("Failed to create student");
      throw err;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await studentApi.delete(id);
      setStudents(prev => prev.filter(student => student.id !== id));
    } catch (err) {
      setError("Failed to delete student");
      throw err;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    fetchStudents,
    createStudent,
    deleteStudent,
  };
}
```

### 4. Page Components (app/dashboard/students/page.tsx)

```typescript
// app/dashboard/students/page.tsx
'use client';

import { useStudents } from '@/hooks/useStudents';
import { StudentTable } from '@/components/tables/StudentTable';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

export default function StudentsPage() {
  const { students, loading, error, createStudent, deleteStudent } = useStudents();

  const handleCreateStudent = () => {
    // Open create student modal
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      await deleteStudent(id);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <Button onClick={handleCreateStudent}>
          Add New Student
        </Button>
      </div>

      <StudentTable
        students={students}
        onDelete={handleDeleteStudent}
      />
    </div>
  );
}
```

## 🎯 Key Principles

1. **Separation of Concerns**: API calls, UI, and business logic are separate
2. **Reusability**: Components and hooks are reusable across the app
3. **Type Safety**: TypeScript types for all data structures
4. **Error Handling**: Consistent error handling throughout
5. **Performance**: Lazy loading, caching, and optimization
6. **Scalability**: Easy to add new features and modify existing ones

This structure supports a production-level application with proper organization, maintainability, and scalability.
