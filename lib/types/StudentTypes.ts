export enum RecordStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
  PENDING = "pending",
}

export interface School {
  id: string;
  name: string;
  address: string;
  affiliationBoard: string;
  establishmentYear: string | null;
  schoolCode: string | null;
  contact: string;
  emailOfficial: string;
  emailAdmin: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  schoolTimingStart: string | null;
  schoolTimingEnd: string | null;
  mediumOfInstruction: string;
  type: string;
}

export interface Role {
  id: string;
  roleName: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  middleName: string | null;
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
  school: School;
  role: Role;
}

export interface Academic {
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
    createdAt: string;
    updatedAt: string;
  };
  class: {
    id: string;
    className: string;
    section: string;
  };
}

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string;
  admissionDate: string;
  fatherName: string | null;
  fatherPhone: string | null;
  motherName: string | null;
  guardianName: string | null;
  familyAnnualIncome: string | null;
  medicalConditions: string | null;
  status: string;
  user: User;
  academics: Academic[];
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StudentListResponse {
  data: Student[];
  meta: Meta;
}

export interface StudentQueryParams {
  page?: number | string;
  limit?: number | string;
  take?: number | string;
  pageSize?: number | string;
  search?: string;
  status?: RecordStatus;
  classId?: string;
  sectionId?: string;
  schoolId?: string;
  gender?: string;
  academicYearId?: string;
  fromDate?: string;
  toDate?: string;
  fromFamilyIncome?: number;
  toFamilyIncome?: number;
}
