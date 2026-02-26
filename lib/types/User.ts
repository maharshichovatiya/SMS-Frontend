import { Role } from "./Role";
import { School } from "./School";

export type User = {
  id: string;
  email: string;
  password: string;

  firstName: string;
  middleName: string;
  lastName: string;

  phone: string;
  gender: "male" | "female" | "other";
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

  school: School;
  role: Role;
};
