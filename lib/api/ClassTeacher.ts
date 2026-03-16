import api from "../Axios";

export interface ClassTeacherStudent {
  id: string;
  admissionNo: string;
  rollNo: string | null;
  admissionDate: string;
  firstName: string;
  middleName: string;
  lastName: string;
  name: string;
  email: string;
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
  fatherName: string | null;
  fatherPhone: string | null;
  motherName: string | null;
  guardianName: string | null;
  familyAnnualIncome: string | null;
  medicalConditions: string | null;
  status: string;
  role: {
    id: string;
    roleName: string;
  };
  school: {
    id: string;
    name: string;
    address: string;
  };
  academics: {
    id: string;
    rollNo: string | null;
    promotionStatus: string | null;
    percentage: string | null;
    remarks: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    academicYear: {
      id: string;
      yearName: string;
      startDate: string;
      endDate: string;
      isCurrent: boolean;
      status: string;
    };
    class: {
      id: string;
      className: string;
      section: string;
    };
  }[];
}

export interface ClassTeacherClass {
  id: string;
  className: string;
  students: ClassTeacherStudent[];
}

export interface ClassTeacherData {
  class: ClassTeacherClass;
}

export interface Subject {
  id: string;
  subjectName: string;
  students: ClassTeacherStudent[];
}

export interface ClassWithSubjects {
  id: string;
  className: string;
  subjects: Subject[];
}

export interface StudentSummary {
  totalStudents: number;
  totalActiveStudents: number;
  totalInactiveStudents: number;
}

export interface ClassTeacherResponse {
  statusCode: number;
  message: string;
  data: {
    statusCode: number;
    message: string;
    data: {
      classTeacher: ClassTeacherData;
      classes: ClassWithSubjects[];
      studentSummary: StudentSummary;
    };
  };
}

export const fetchClassTeacherData = async (): Promise<ClassTeacherData> => {
  const response = await api.get<ClassTeacherResponse>("/dashboard/teacher");
  return response.data.data.data.classTeacher;
};
