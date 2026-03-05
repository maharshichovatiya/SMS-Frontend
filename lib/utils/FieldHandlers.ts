import { StudentFormValues } from "@/lib/validations/StudentSchema";

// Helper function to handle string field assignments
export const handleStringField = (
  key: string,
  formValue: string,
  changedFields: Partial<StudentFormValues>,
) => {
  switch (key) {
    case "firstName":
      changedFields.firstName = formValue;
      break;
    case "middleName":
      changedFields.middleName = formValue;
      break;
    case "lastName":
      changedFields.lastName = formValue;
      break;
    case "email":
      changedFields.email = formValue;
      break;
    case "phone":
      changedFields.phone = formValue;
      break;
    case "rollNo":
      changedFields.rollNo = formValue;
      break;
    case "admissionDate":
      changedFields.admissionDate = formValue;
      break;
    case "dob":
      changedFields.dob = formValue;
      break;
    case "fatherName":
      changedFields.fatherName = formValue;
      break;
    case "fatherPhone":
      changedFields.fatherPhone = formValue;
      break;
    case "motherName":
      changedFields.motherName = formValue;
      break;
    case "guardianName":
      changedFields.guardianName = formValue;
      break;
    case "familyAnnualIncome":
      changedFields.familyAnnualIncome = formValue;
      break;
    case "medicalConditions":
      changedFields.medicalConditions = formValue;
      break;
    case "gender":
      changedFields.gender = formValue as "male" | "female" | "other" | "";
      break;
    case "password":
      changedFields.password = formValue;
      break;
    case "classId":
      changedFields.classId = formValue;
      break;
    case "academicYearId":
      changedFields.academicYearId = formValue;
      break;
    default:
      // Handle status field separately
      if (key === "status") {
        const typedChangedFields =
          changedFields as Partial<StudentFormValues> & {
            status?: "active" | "inactive";
          };
        if (formValue === "active" || formValue === "inactive") {
          typedChangedFields.status = formValue;
        }
      }
  }
};

// Helper function to handle non-string field assignments
export const handleNonStringField = (
  key: string,
  formValue: unknown,
  changedFields: Partial<StudentFormValues>,
) => {
  switch (key) {
    case "firstName":
      changedFields.firstName = formValue as string;
      break;
    case "middleName":
      changedFields.middleName = formValue as string;
      break;
    case "lastName":
      changedFields.lastName = formValue as string;
      break;
    case "email":
      changedFields.email = formValue as string;
      break;
    case "phone":
      changedFields.phone = formValue as string;
      break;
    case "rollNo":
      changedFields.rollNo = formValue as string;
      break;
    case "admissionDate":
      changedFields.admissionDate = formValue as string;
      break;
    case "dob":
      changedFields.dob = formValue as string;
      break;
    case "fatherName":
      changedFields.fatherName = formValue as string;
      break;
    case "fatherPhone":
      changedFields.fatherPhone = formValue as string;
      break;
    case "motherName":
      changedFields.motherName = formValue as string;
      break;
    case "guardianName":
      changedFields.guardianName = formValue as string;
      break;
    case "familyAnnualIncome":
      changedFields.familyAnnualIncome = formValue as string;
      break;
    case "medicalConditions":
      changedFields.medicalConditions = formValue as string;
      break;
    case "gender":
      changedFields.gender = formValue as "male" | "female" | "other" | "";
      break;
    case "password":
      changedFields.password = formValue as string;
      break;
    case "classId":
      changedFields.classId = formValue as string;
      break;
    case "academicYearId":
      changedFields.academicYearId = formValue as string;
      break;
  }
};

// Helper function to handle status field with proper type checking
export const handleStatusField = (
  formValue: string,
  changedFields: Partial<StudentFormValues>,
) => {
  if (formValue === "active" || formValue === "inactive") {
    const typedChangedFields = changedFields as Partial<StudentFormValues> & {
      status?: "active" | "inactive";
    };
    typedChangedFields.status = formValue;
  }
};
