"use client";

import Modal from "@/components/ui/Modal";
import StudentForm from "@/components/forms/StudentForm";
import { Student } from "@/components/tables/StudentTable";

interface StudentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  roleId: string;
  onSubmitSuccess: () => void;
}

export default function StudentEditModal({
  isOpen,
  onClose,
  student,
  roleId,
  onSubmitSuccess,
}: StudentEditModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Student"
      description="Update the student's information below."
    >
      <div className="w-[560px]">
        {student && (
          <StudentForm
            initialData={{
              id: student.id,
              firstName: student.firstName,
              middleName: student.middleName || "",
              lastName: student.lastName,
              email: student.email,
              phone: student.phone || "",
              rollNo: student.rollNo,
              admissionDate: student.admissionDate,
              dob:
                student.dob === "N/A" || student.dob === null
                  ? ""
                  : student.dob,
              gender:
                (student.gender as "male" | "female" | "other" | "") || "",
              fatherName: student.fatherName,
              fatherPhone: student.fatherPhone,
              motherName: student.motherName,
              guardianName: student.guardianName,
              familyAnnualIncome: student.familyAnnualIncome,
              medicalConditions: student.medicalConditions,
              isAssigned: student.class !== "Unassigned",
              classId: student.classId,
              academicYearId: student.academicYearId,
              className: student.class,

              // Add missing fields
              bloodGroup: student.bloodGroup,
              aadhaarNo: student.aadhaarNo,
              panNo: student.panNo,
              permanentAddress: student.permanentAddress,
              currentAddress: student.currentAddress,
              bankName: student.bankName,
              accountNo: student.accountNo,
              ifscCode: student.ifscCode,
              branch: student.branch,
            }}
            onSubmitSuccess={onSubmitSuccess}
            onClose={onClose}
            roleId={roleId}
          />
        )}
      </div>
    </Modal>
  );
}
