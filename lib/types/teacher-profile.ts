export interface Teacher {
  id: string;
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  academicInfo: AcademicInfo;
  bankInfo?: BankInfo | null;
  governmentIds?: GovernmentId | null;
  stats?: TeacherStats;
  assignedClasses?: AssignedClass[];
  documents?: Document[];
  createdAt?: string;
  updatedAt?: string;
  lastModifiedBy?: string;
  avatar?: string | null;
  signature?: string | null;
  isActive?: boolean;
  isVerified?: boolean;
  roles?: string[];
}

export interface PersonalInfo {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  initials: string;
  avatarGradient: [string, string];
  email: string;
  phone: string;
  alternatePhone?: string | null;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | null;
  maritalStatus?: "single" | "married" | "divorced" | "widowed" | null;
  nationality: string;
  religion?: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;
}

export interface ProfessionalInfo {
  employeeId: string;
  designation: string;
  department: string;
  role: string;
  classTeacherOf?: string | null;
  joiningDate: string;
  employmentType: "permanent" | "contract" | "probation" | "part-time";
  salary: number;
  salaryGrade: string;
  status: "Active" | "Inactive" | "On Leave";
  reportingTo?: string | null;
  workEmail?: string | null;
  workPhone?: string | null;
}

export interface AcademicInfo {
  qualifications: Qualification[];
  specializations: string[];
  languagesKnown: string[];
  certifications?: string[];
  highestQualification?: string | null;
  university?: string | null;
  yearOfPassing?: number;
}

export interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: number;
  grade?: string | null;
}

export interface BankInfo {
  bankName?: string | null;
  accountNumber?: string | null;
  ifscCode?: string | null;
  branch?: string | null;
  accountType?: "Savings" | "Current" | "Salary Account" | null;
  accountHolderName?: string | null;
}

export interface GovernmentId {
  aadhaarNumber?: string | null;
  panNumber?: string | null;
  passportNumber?: string | null;
  voterId?: string | null;
  drivingLicense?: string | null;
}

export interface TeacherStats {
  totalStudents: number;
  classesAssigned: number;
  homeworkAssigned: number;
  avgAttendance: number;
  yearsOfExperience: number;
  resourcesUploaded: number;
}

export interface AssignedClass {
  id: string;
  code: string;
  grade: string;
  subject: string;
  students: number;
  isClassTeacher: boolean;
  room?: string;
  schedule?: ClassSchedule;
}

export interface ClassSchedule {
  day: string;
  startTime: string;
  endTime: string;
  period: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: "verified" | "pending" | "rejected";
  url?: string;
  size?: number;
  description?: string;
}

export interface TeacherProfileEditProps {
  teacherData: Teacher;
  onSuccess: (updatedData: Teacher) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface ProfileFieldProps {
  label: string;
  value: string | number | undefined;
  isEditing: boolean;
  type?: "text" | "email" | "tel" | "date" | "select" | "number";
  options?: Array<{ label: string; value: string }>;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  mono?: boolean;
  placeholder?: string;
  required?: boolean;
}

export interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export interface ProfileStatsProps {
  stats: TeacherStats;
}

export interface ProfileTabBarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export interface ProfileHeaderProps {
  teacher: Teacher;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface AssignedClassCardProps {
  cls: AssignedClass;
}

export interface DocumentRowProps {
  doc: Document;
}

export type ProfileTab =
  | "overview"
  | "personal"
  | "professional"
  | "academic"
  | "classes"
  | "documents";

export interface FormState {
  isEditing: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TeacherListResponse {
  teachers: Teacher[];
  total: number;
  page: number;
  limit: number;
}

export interface TeacherFilters {
  department?: string;
  designation?: string;
  status?: string;
  employmentType?: string;
  search?: string;
}

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

export interface TeacherProfileState {
  teacher: Teacher;
  draft: Teacher;
  activeTab: ProfileTab;
  formState: FormState;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type TeacherPersonalInfo = PersonalInfo;
export type TeacherProfessionalInfo = ProfessionalInfo;
export type TeacherAcademicInfo = AcademicInfo;
