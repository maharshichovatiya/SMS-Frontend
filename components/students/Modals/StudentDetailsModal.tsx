"use client";

import Modal from "@/components/ui/Modal";
import { Student } from "@/components/tables/StudentTable";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

function formatAdmissionDate(iso: string) {
  const [y, m, d] = iso.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

function formatPhone(phone: string | undefined | null) {
  if (!phone) return "N/A";
  return `${phone.slice(0, 5)}  ${phone.slice(5)}`;
}

export default function StudentDetailsModal({
  isOpen,
  onClose,
  student,
}: StudentDetailsModalProps) {
  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Details"
      description="Complete information about the student."
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Personal Information Section */}
        <div className="bg-[var(--surface-2)] rounded-lg p-4 border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
            Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Full Name
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.firstName} {student.middleName} {student.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Email
              </p>
              <p className="text-sm text-[var(--text)]">{student.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Phone
              </p>
              <p className="text-sm text-[var(--text)]">
                {formatPhone(student.phone)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Date of Birth
              </p>
              <p className="text-sm text-[var(--text)]">{student.dob}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Gender
              </p>
              <p className="text-sm text-[var(--text)] capitalize">
                {student.gender || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Blood Group
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.bloodGroup || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Aadhaar Number
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.aadhaarNo || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                PAN Number
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.panNo || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="bg-[var(--surface-2)] rounded-lg p-4 border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
            Address Information
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Permanent Address
              </p>
              <p className="text-sm text-[var(--text)] break-words whitespace-pre-wrap">
                {student.permanentAddress || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Current Address
              </p>
              <p className="text-sm text-[var(--text)] break-words whitespace-pre-wrap">
                {student.currentAddress || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="bg-[var(--surface-2)] rounded-lg p-4 border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
            Academic Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Roll Number
              </p>
              <p className="text-sm text-[var(--text)]">{student.rollNo}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Admission Date
              </p>
              <p className="text-sm text-[var(--text)]">
                {formatAdmissionDate(student.admissionDate)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Class
              </p>
              <p className="text-sm text-[var(--text)]">{student.class}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Academic Year
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.academicYear || "Not assigned"}
              </p>
            </div>
          </div>
        </div>

        {/* Family Information Section */}
        <div className="bg-[var(--surface-2)] rounded-lg p-4 border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
            Family Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Father Name
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.fatherName || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Father Phone
              </p>
              <p className="text-sm text-[var(--text)]">
                {formatPhone(student.fatherPhone)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Mother Name
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.motherName || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Guardian Name
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.guardianName || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Family Annual Income
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.familyAnnualIncome || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Medical Conditions
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.medicalConditions || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="bg-[var(--surface-2)] rounded-lg p-4 border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
            Bank Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Bank Name
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.bankName || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Account Number
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.accountNo || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                IFSC Code
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.ifscCode || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Branch
              </p>
              <p className="text-sm text-[var(--text)]">
                {student.branch || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="bg-[var(--surface-2)] rounded-lg p-4 border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
            Status Information
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Current Status
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                    ${
                      student.status === "Active"
                        ? "bg-[var(--green-light)] text-[var(--green)]"
                        : "bg-[var(--rose-light)] text-[var(--rose)]"
                    }
                  `}
                >
                  {student.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
