import { User } from "./User";

export type Teacher = {
  id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  dob: string;
  employeeCode: string;
  staffCategory: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  salaryPackage: number;
  highestQualification: string;
  experienceYears: number;
  userId?: string;
  schoolId?: string;
  roleId?: string;
  profilePhoto?: File | null;
};

export type GetTeachers = {
  id: string;
  status: "active" | "inactive";
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

  user: User;
};
