export interface StudentTeacher {
  id: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  gender: string;
  dob: string;
  profilePhoto: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  teacher: {
    id: string;
    status: string;
    userId: string;
    employeeCode: string;
    staffCategory: string;
    department: string;
    designation: string;
    highestQualification: string;
    specialization: string | null;
    totalExpMonths: number;
    salaryPackage: string;
    dateOfJoining: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      middleName: string;
      lastName: string;
      phone: string;
      gender: string;
      dob: string;
      profilePhoto: string | null;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  userId: string;
  employeeCode: string;
  staffCategory: string;
  department: string;
  designation: string;
  highestQualification: string;
  specialization: string | null;
  totalExpMonths: number;
  salaryPackage: string;
  dateOfJoining: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    gender: string;
    dob: string;
    profilePhoto: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Chapter {
  id: string;
  chapterName: string;
  chapterNo: number;
  status: string;
}

export interface StudentHomework {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  chapterId: string | null;
  classno: string | null;
  assignedDate: string;
  dueDate: string;
  status: string;
  schoolId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  subject: Subject;
  chapter: Chapter | null;
  attachments: Array<{
    id: string;
    homeworkId: string;
    submissionId: string | null;
    fileName: string;
    fileUrl: string;
    fileSize: string;
    fileType: string;
    createdAt: string;
    updatedAt: string;
  }>;
  homeworkId: string;
  teacher: StudentTeacher;
  assignmentType: string;
  isOverdue: boolean;
}

export interface StudentHomeworkListResponse {
  statusCode: number;
  message: string;
  data: {
    success: boolean;
    data: {
      count: number;
      homework: StudentHomework[];
    };
  };
}

export interface Subject {
  id: string;
  schoolId: string;
  subjectName: string;
  subjectCode: string;
  passingMarks: number;
  maxMarks: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  homeworkId: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  homeworkId: string;
  classId: string | null;
  studentId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  class?: {
    id: string;
    schoolId: string;
    className: string;
    section: string;
    classTeacherId: string;
    studentCapacity: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    classStudents?: Array<{
      id: string;
      rollNo: string | null;
      promotionStatus: string | null;
      percentage: string | null;
      remarks: string | null;
      status: string;
      createdAt: string;
      updatedAt: string;
      student: {
        id: string;
        admissionNo: string;
        rollNo: string | null;
        admissionDate: string;
        fatherName: string | null;
        fatherPhone: string | null;
        motherName: string | null;
        guardianName: string | null;
        familyAnnualIncome: string | null;
        medicalConditions: string | null;
        status: string;
        user: {
          id: string;
          email: string;
          firstName: string;
          middleName: string;
          lastName: string;
          phone: string;
          gender: string | null;
          dob: string | null;
          profilePhoto: string | null;
          status: string;
          createdAt: string;
          updatedAt: string;
        };
      };
    }>;
    classTeacher?: {
      id: string;
      status: string;
      userId: string;
      employeeCode: string;
      staffCategory: string;
      department: string;
      designation: string;
      highestQualification: string;
      specialization: string | null;
      totalExpMonths: number;
      salaryPackage: string;
      dateOfJoining: string;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        email: string;
        password: string;
        firstName: string;
        middleName: string;
        lastName: string;
        phone: string;
        gender: string;
        dob: string;
        bloodGroup: string | null;
        aadhaarNo: string | null;
        panNo: string | null;
        permanentAddress: string;
        currentAddress: string;
        profilePhoto: string | null;
        bankName: string;
        accountNo: string | null;
        ifscCode: string | null;
        branch: string;
        tokenVersion: number;
      };
    };
  };
  student?: {
    id: string;
    admissionNo: string;
    rollNo: string | null;
    admissionDate: string;
    fatherName: string | null;
    fatherPhone: string | null;
    motherName: string | null;
    guardianName: string | null;
    familyAnnualIncome: string | null;
    medicalConditions: string | null;
    status: string;
    user: {
      id: string;
      email: string;
      password: string;
      firstName: string;
      middleName: string;
      lastName: string;
      phone: string;
      gender: string | null;
      dob: string | null;
      bloodGroup: string | null;
      aadhaarNo: string | null;
      panNo: string | null;
      permanentAddress: string | null;
      currentAddress: string | null;
      profilePhoto: string | null;
      bankName: string | null;
      accountNo: string | null;
      ifscCode: string | null;
      branch: string | null;
      tokenVersion: number;
    };
    academics: Array<{
      id: string;
      rollNo: string | null;
      promotionStatus: string | null;
      percentage: string | null;
      remarks: string | null;
      status: string;
      createdAt: string;
      updatedAt: string;
      class: {
        id: string;
        schoolId: string;
        className: string;
        section: string;
        classTeacherId: string;
        studentCapacity: number;
        status: string;
        createdAt: string;
        updatedAt: string;
      };
    }>;
  };
}

export interface Teacher {
  id: string;
  email: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  gender: string;
  dob: string;
  bloodGroup: string | null;
  aadhaarNo: string | null;
  panNo: string | null;
  permanentAddress: string | null;
  currentAddress: string;
  profilePhoto: string | null;
  bankName: string;
  accountNo: string | null;
  ifscCode: string | null;
  branch: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  tokenVersion: number;
  teacher: {
    id: string;
    status: string;
    userId: string;
    employeeCode: string;
    staffCategory: string;
    department: string;
    designation: string;
    highestQualification: string;
    specialization: string | null;
    totalExpMonths: number;
    salaryPackage: string;
    dateOfJoining: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      email: string;
      password: string;
      firstName: string;
      middleName: string;
      lastName: string;
      phone: string;
      gender: string;
      dob: string;
      bloodGroup: string | null;
      aadhaarNo: string | null;
      panNo: string | null;
      permanentAddress: string | null;
      currentAddress: string;
      profilePhoto: string | null;
      bankName: string;
      accountNo: string | null;
      ifscCode: string | null;
      branch: string;
      tokenVersion: number;
    };
  };
  userId: string;
  employeeCode: string;
  staffCategory: string;
  department: string;
  designation: string;
  highestQualification: string;
  specialization: string | null;
  totalExpMonths: number;
  salaryPackage: string;
  dateOfJoining: string;
  user: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    gender: string;
    dob: string;
    bloodGroup: string | null;
    aadhaarNo: string | null;
    panNo: string | null;
    permanentAddress: string | null;
    currentAddress: string;
    profilePhoto: string | null;
    bankName: string;
    accountNo: string | null;
    ifscCode: string | null;
    branch: string;
    tokenVersion: number;
  };
}

export interface Homework {
  id: string;
  homeworkId: string;
  title: string;
  description?: string;
  subjectId: string;
  subject: Subject;
  chapterId?: string | null;
  chapter?: {
    id: string;
    chapterName: string;
    chapterNo: number;
    status: string;
  } | null;
  assignedDate: string;
  dueDate: string;
  status: "assigned" | "draft" | "completed" | "expired";
  classno?: string;
  instructions?: string;
  attachments?: Attachment[];
  assignments?: Assignment[];
  teacher: Teacher;
  submittedCount: number;
  gradedCount: number;
  pendingCount: number;
  totalAssignedTo: number;
  schoolId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHomeworkPayload {
  title: string;
  subjectId: string;
  assignedDate: string;
  dueDate: string;
  description?: string;
  classno?: string;
  instructions?: string;
  chapterId?: string | null;
  assignToClasses?: Array<{ classId: string }>;
  assignToStudents?: Array<{ studentId: string }>;
  attachments?: File[];
}

export interface AssignToClassesPayload {
  classes: Array<{ classId: string }>;
}

export interface AssignToStudentsPayload {
  students: Array<{ studentId: string }>;
}

export interface HomeworkListResponse {
  statusCode: number;
  message: string;
  data: {
    success: boolean;
    data: {
      count: number;
      homework: Homework[];
    };
  };
}

export interface HomeworkResponse {
  success: boolean;
  data: Homework;
}

export interface CreateHomeworkResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    status: string;
  };
}

export interface AssignResponse {
  success: boolean;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  data: null;
}
