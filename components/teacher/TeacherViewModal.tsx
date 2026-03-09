"use client";

// Teacher view modal component with student-details-matching UI
import Modal from "@/components/ui/Modal";
import { GetTeachers } from "@/lib/types/Teacher";
import { formatExperience } from "@/lib/utils/TotalExpMonths";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teacher: GetTeachers;
}

function formatJoiningDate(iso: string) {
  if (!iso) return "Not specified";
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

function formatSalary(salary: number | undefined | null) {
  if (!salary) return "Not specified";
  return `₹${Math.floor(Number(salary)).toLocaleString("en-IN")}/year`;
}

export default function TeacherViewModal({ isOpen, onClose, teacher }: Props) {
  const fullName = `${teacher.user.firstName} ${teacher.user.lastName}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Teacher Details"
      description="Complete information about the teacher."
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
              <p className="text-sm text-[var(--text)]">{fullName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Email
              </p>
              <p className="text-sm text-[var(--text)]">{teacher.user.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Phone
              </p>
              <p className="text-sm text-[var(--text)]">
                {formatPhone(teacher.user.phone)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Date of Birth
              </p>
              <p className="text-sm text-[var(--text)]">
                {teacher.user.dob || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Gender
              </p>
              <p className="text-sm text-[var(--text)] capitalize">
                {teacher.user.gender || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Blood Group
              </p>
              <p className="text-sm text-[var(--text)]">
                {teacher.user.bloodGroup || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Aadhaar Number
              </p>
              <p className="text-sm text-[var(--text)]">
                {teacher.user.aadhaarNo || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                PAN Number
              </p>
              <p className="text-sm text-[var(--text)]">
                {teacher.user.panNo || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="bg-[var(--surface-2)] rounded-lg p-4 border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
            Professional Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Employee Code
              </p>
              <p className="text-sm text-[var(--text)]">
                {teacher.employeeCode}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Department
              </p>
              <p className="text-sm text-[var(--text)]">{teacher.department}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Designation
              </p>
              <p className="text-sm text-[var(--text)]">
                {teacher.designation}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Date of Joining
              </p>
              <p className="text-sm text-[var(--text)]">
                {formatJoiningDate(teacher.dateOfJoining)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Highest Qualification
              </p>
              <p className="text-sm text-[var(--text)]">
                {teacher.highestQualification}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Salary Package
              </p>
              <p className="text-sm text-[var(--text)]">
                {formatSalary(Number(teacher.salaryPackage))}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Total Experience
              </p>
              <p className="text-sm text-[var(--text)]">
                {formatExperience(Number(teacher.totalExpMonths) || 0)}
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
                {teacher.user.permanentAddress || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Current Address
              </p>
              <p className="text-sm text-[var(--text)] break-words whitespace-pre-wrap">
                {teacher.user.currentAddress || "Not specified"}
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
                {teacher.user.bankName || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Account Number
              </p>
              <p className="text-sm text-[var(--text)]">
                {teacher.user.accountNo || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                IFSC Code
              </p>
              <p className="text-sm text-[var(--text)]">
                {teacher.user.ifscCode || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1">
                Branch
              </p>
              <p className="text-sm text-[var(--text)]">
                {teacher.user.branch || "Not specified"}
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
                      teacher.status === "active"
                        ? "bg-[var(--green-light)] text-[var(--green)]"
                        : "bg-[var(--rose-light)] text-[var(--rose)]"
                    }
                  `}
                >
                  {teacher.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
