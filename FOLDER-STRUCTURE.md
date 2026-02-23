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
