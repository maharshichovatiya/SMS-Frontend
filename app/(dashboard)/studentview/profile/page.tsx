"use client";

import React, { useState, useEffect } from "react";
import { Award } from "lucide-react";
import type {
  ProfileTab,
  ProfileFieldProps,
} from "@/lib/types/student-profile";
import PageHeader from "@/components/layout/PageHeader";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import Modal from "@/components/ui/Modal";
import StudentForm from "@/components/forms/StudentSections/StudentForm";
import {
  getStudentProfile,
  type StudentProfileData,
} from "@/lib/api/StudentProfile";

interface ApiStudentData {
  id: string;
  status: string;
  userId: string;
  rollNumber: string;
  grade: string;
  section: string;
  enrollmentDate: string;
  guardianName: string;
  guardianPhone: string;
  createdAt: string;
  updatedAt: string;
  academicYear?: {
    id: string;
    yearName: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  class?: {
    id: string;
    className: string;
    section: string;
  };
  user: {
    id: string;
    email: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    phone: string;
    gender: string;
    dob: string;
    bloodGroup: string | null;
    permanentAddress: string | null;
    currentAddress: string | null;
    profilePhoto: string | null;
    school: {
      id: string;
      name: string;
      address: string;
      affiliationBoard: string;
    };
    role: {
      id: string;
      roleName: string;
    };
  };
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  isEditing,
  type = "text",
  options = [],
  onChange,
  readOnly = false,
  mono = false,
}) => {
  const optionValues = Array.isArray(options)
    ? options.map(opt => (typeof opt === "string" ? opt : opt.value))
    : [];

  return (
    <div className="min-w-0">
      <div className="text-[11px] font-bold text-[#9aa5c4] uppercase tracking-[0.5px] mb-1.5 font-[var(--font-sans)] flex items-center gap-1">
        {label}
        {readOnly && (
          <span className="text-[9px] bg-[#f0f4ff] text-[#3d6cf4] px-1.5 py-0.5 rounded-full ml-1">
            Read Only
          </span>
        )}
      </div>

      {!isEditing || readOnly ? (
        <div
          className={`${mono ? "text-[13px]" : "text-sm"} font-medium text-[#111827] ${mono ? "font-[var(--font-mono)]" : "font-[var(--font-sans)]"} py-0.5 leading-6 break-words`}
        >
          {value || <span className="text-[#9aa5c4] italic">Not provided</span>}
        </div>
      ) : type === "select" ? (
        <select
          value={String(value || "")}
          onChange={e => onChange?.(e.target.value)}
          className={`w-full px-3 py-2 border-[1.5px] border-[#dde3f5] rounded-lg ${mono ? "font-[var(--font-mono)] text-[13px]" : "font-[var(--font-sans)] text-[13.5px]"} text-[#111827] outline-none transition-all duration-200 bg-white cursor-pointer focus:border-[#3d6cf4] focus:shadow-[0_0_0_3px_rgba(61,108,244,0.1)]`}
        >
          {optionValues.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={String(value || "")}
          onChange={e => onChange?.(e.target.value)}
          className={`w-full px-3 py-2 border-[1.5px] border-[#dde3f5] rounded-lg ${mono ? "font-[var(--font-mono)] text-[13px]" : "font-[var(--font-sans)] text-[13.5px]"} text-[#111827] outline-none transition-all duration-200 ${readOnly ? "bg-[#fafbff] cursor-not-allowed" : "bg-white cursor-text"} focus:border-[#3d6cf4] focus:shadow-[0_0_0_3px_rgba(61,108,244,0.1)]`}
          disabled={readOnly}
        />
      )}
    </div>
  );
};

const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ title, subtitle, children, delay = 0, className = "" }) => (
  <div
    className={`bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden mb-[18px] animate-fadeUp ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="px-[22px] py-4 border-b border-[#dde3f5] bg-[#fafbff] flex items-center justify-between">
      <div>
        <div className="text-[15px] font-bold text-[#111827] font-[var(--font-sans)]">
          {title}
        </div>
        {subtitle && (
          <div className="text-[12px] text-[#9aa5c4] mt-[2px] font-[var(--font-sans)]">
            {subtitle}
          </div>
        )}
      </div>
    </div>
    <div className="px-[22px] py-5">{children}</div>
  </div>
);

const FieldGrid: React.FC<{ children: React.ReactNode; cols?: number }> = ({
  children,
  cols = 2,
}) => (
  <div
    className={`grid gap-[18px] ${
      cols === 2
        ? "grid-cols-1 md:grid-cols-2"
        : cols === 3
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : cols === 4
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"
            : "grid-cols-1"
    }`}
  >
    {children}
  </div>
);

const ProfileTabBar: React.FC<{
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "personal", label: "Personal" },
    { id: "academic", label: "Academics" },
    { id: "school", label: "School" },
  ];

  return (
    <div className="mt-5 flex gap-1 bg-white border-[1.5px] border-[#dde3f5] rounded-xl p-1.5 mb-5 flex-wrap shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)]">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-[14px] py-2.5 rounded-xl border-none font-[var(--font-sans)] text-[13px] cursor-pointer transition-all duration-180 flex items-center justify-center gap-1.5 whitespace-nowrap ${
              isActive
                ? "bg-[#3d6cf4] text-white font-bold shadow-[0_4px_14px_rgba(61,108,244,0.3)]"
                : "bg-transparent text-[#5c6a8a] font-medium hover:bg-[#f0f4ff] hover:text-[#111827]"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const _ProfileHeader: React.FC<{
  student: ApiStudentData;
  isEditing: boolean;
  onEditToggle: () => void;
}> = ({ student, onEditToggle }) => {
  const { user } = student;

  const initials =
    `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  const avatarGradient = ["#3d6cf4", "#6c47f5"];

  return (
    <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl mb-[18px] shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden animate-fadeUp">
      <div
        className="h-1.5"
        style={{
          background: `linear-gradient(90deg, ${avatarGradient[0]}, ${avatarGradient[1]})`,
        }}
      />

      <div className="px-7 py-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-[18px]">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-extrabold text-white font-[var(--font-sans)] flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${avatarGradient[0]}, ${avatarGradient[1]})`,
                boxShadow: `0 6px 20px ${avatarGradient[0]}50`,
              }}
            >
              {initials}
            </div>

            <div
              className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-[2.5px] border-white ${
                student.status === "active" ? "bg-[#12a47e]" : "bg-[#e83b6a]"
              }`}
            />
          </div>

          <div>
            <div className="text-2xl font-extrabold tracking-[-0.5px] text-[#111827] font-[var(--font-sans)] leading-[1.2]">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-[13.5px] text-[#5c6a8a] mt-1 font-[var(--font-sans)]">
              Grade {student.grade} · Section {student.section}
            </div>
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full bg-[#eef1ff] text-[#3d6cf4] font-mono">
                {student.rollNumber}
              </span>

              <span
                className={`text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full font-[var(--font-sans)] ${
                  student.status === "active"
                    ? "bg-[#e6faf5] text-[#12a47e]"
                    : "bg-[#fff0f4] text-[#e83b6a]"
                }`}
              >
                {student.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 items-center">
          <button
            onClick={onEditToggle}
            className="px-[22px] py-2.5 rounded-[11px] border-none bg-[#3d6cf4] text-[13.5px] font-semibold text-white cursor-pointer font-[var(--font-sans)] shadow-[0_4px_14px_rgba(61,108,244,0.3)] transition-all duration-180 flex items-center gap-1.5"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [studentData, setStudentData] = useState<ApiStudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData: StudentProfileData = await getStudentProfile();

      // Map API response to existing interface
      const mappedData: ApiStudentData = {
        id: profileData.id,
        status: profileData.status,
        userId: profileData.user.id,
        rollNumber: profileData.rollNo || "",
        grade: profileData.academics[0]?.class.className || "",
        section: profileData.academics[0]?.class.section || "",
        enrollmentDate: profileData.admissionDate,
        guardianName: profileData.fatherName || profileData.guardianName || "",
        guardianPhone: profileData.fatherPhone || "",
        createdAt: "",
        updatedAt: "",
        academicYear: profileData.academics[0]?.academicYear,
        class: profileData.academics[0]?.class,
        user: {
          id: profileData.user.id,
          email: profileData.user.email,
          firstName: profileData.user.firstName,
          middleName: profileData.user.middleName,
          lastName: profileData.user.lastName,
          phone: profileData.user.phone,
          gender: profileData.user.gender,
          dob: profileData.user.dob,
          bloodGroup: profileData.user.bloodGroup,
          permanentAddress: profileData.user.permanentAddress,
          currentAddress: profileData.user.currentAddress,
          profilePhoto: profileData.user.profilePhoto,
          school: {
            id: profileData.user.school.id,
            name: profileData.user.school.name,
            address: profileData.user.school.address,
            affiliationBoard: profileData.user.school.affiliationBoard,
          },
          role: {
            id: profileData.user.role.id,
            roleName: profileData.user.role.roleName,
          },
        },
      };

      setStudentData(mappedData);
    } catch (err) {
      setError("Failed to load student profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Student Profile"
          description="Manage your personal and academic information"
          icon={Award}
          iconBgColor="--blue-light"
          iconColor="--blue"
        />
        <ProfileSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No profile data available</p>
        </div>
      </div>
    );
  }

  const handleEditToggle = () => {
    setShowForm(true);
  };

  const handleFormSave = async () => {
    setShowForm(false);
    // Refetch student profile data after successful update
    await fetchStudentProfile();
  };

  const _handleFormCancel = () => {
    setShowForm(false);
  };

  const _handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleFieldChange = (field: string, value: string) => {
    setStudentData((prev: ApiStudentData | null) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleUserFieldChange = (field: string, value: string) => {
    setStudentData((prev: ApiStudentData | null) => ({
      ...prev!,
      user: {
        ...prev!.user,
        [field]: value,
      },
    }));
  };

  const current = isEditing ? studentData! : (studentData! as ApiStudentData);

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
      <SectionCard
        title="Personal Details"
        subtitle="Basic contact information"
        delay={0.05}
      >
        <FieldGrid>
          <ProfileField
            label="Full Name"
            value={`${current.user.firstName} ${current.user.lastName}`}
            isEditing={false}
          />
          <ProfileField
            label="Email"
            value={current.user.email}
            isEditing={false}
          />
          <ProfileField
            label="Phone"
            value={current.user.phone || ""}
            isEditing={false}
          />
          <ProfileField
            label="Date of Birth"
            value={current.user.dob || ""}
            isEditing={false}
          />
          <ProfileField
            label="Gender"
            value={current.user.gender || ""}
            isEditing={false}
          />
          <ProfileField
            label="Blood Group"
            value={current.user.bloodGroup || ""}
            isEditing={false}
          />
        </FieldGrid>
      </SectionCard>

      <SectionCard
        title="Academic Details"
        subtitle="Grade and section information"
        delay={0.1}
      >
        <FieldGrid>
          <ProfileField
            label="Roll Number"
            value={current.rollNumber}
            isEditing={false}
            mono
          />
          <ProfileField label="Grade" value={current.grade} isEditing={false} />
          <ProfileField
            label="Section"
            value={current.section}
            isEditing={false}
          />
          <ProfileField
            label="Enrollment Date"
            value={current.enrollmentDate}
            isEditing={false}
            type="date"
          />
        </FieldGrid>
      </SectionCard>
    </div>
  );

  const renderPersonal = () => (
    <>
      <SectionCard title="Basic Information" delay={0.04}>
        <FieldGrid>
          <ProfileField
            label="First Name"
            value={current.user.firstName}
            isEditing={isEditing}
            onChange={v => handleUserFieldChange("firstName", v)}
          />
          <ProfileField
            label="Middle Name"
            value={current.user.middleName || ""}
            isEditing={isEditing}
            onChange={v => handleUserFieldChange("middleName", v)}
          />
          <ProfileField
            label="Last Name"
            value={current.user.lastName}
            isEditing={isEditing}
            onChange={v => handleUserFieldChange("lastName", v)}
          />
          <ProfileField
            label="Email"
            value={current.user.email}
            isEditing={isEditing}
            type="email"
            onChange={v => handleUserFieldChange("email", v)}
            readOnly
          />
          <ProfileField
            label="Phone"
            value={current.user.phone}
            isEditing={isEditing}
            type="tel"
            onChange={v => handleUserFieldChange("phone", v)}
            mono
          />
          <ProfileField
            label="Date of Birth"
            value={current.user.dob}
            isEditing={isEditing}
            type="date"
            onChange={v => handleUserFieldChange("dob", v)}
          />
          <ProfileField
            label="Gender"
            value={current.user.gender}
            isEditing={isEditing}
            onChange={v => handleUserFieldChange("gender", v)}
          />
          <ProfileField
            label="Blood Group"
            value={current.user.bloodGroup || ""}
            isEditing={isEditing}
            onChange={v => handleUserFieldChange("bloodGroup", v)}
          />
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Address" delay={0.08}>
        <div className="mb-4">
          <ProfileField
            label="Permanent Address"
            value={current.user.permanentAddress || ""}
            isEditing={isEditing}
            onChange={v => handleUserFieldChange("permanentAddress", v)}
          />
        </div>
        <div className="mb-4">
          <ProfileField
            label="Current Address"
            value={current.user.currentAddress || ""}
            isEditing={isEditing}
            onChange={v => handleUserFieldChange("currentAddress", v)}
          />
        </div>
      </SectionCard>
    </>
  );

  const renderAcademic = () => (
    <SectionCard
      title="Academic Information"
      subtitle="Grade and section information"
      delay={0.04}
    >
      <FieldGrid>
        <ProfileField
          label="Roll Number"
          value={current.rollNumber}
          isEditing={isEditing}
          onChange={v => handleFieldChange("rollNumber", v)}
          mono
        />
        <ProfileField
          label="Grade"
          value={current.grade}
          isEditing={isEditing}
          onChange={v => handleFieldChange("grade", v)}
        />
        <ProfileField
          label="Section"
          value={current.section}
          isEditing={isEditing}
          onChange={v => handleFieldChange("section", v)}
        />
        <ProfileField
          label="Enrollment Date"
          value={current.enrollmentDate}
          isEditing={isEditing}
          type="date"
          onChange={v => handleFieldChange("enrollmentDate", v)}
        />
      </FieldGrid>
    </SectionCard>
  );

  const renderSchool = () => (
    <SectionCard
      title="School Information"
      subtitle={`${current.user.school.name}`}
      delay={0.04}
    >
      <FieldGrid>
        <ProfileField
          label="School Name"
          value={current.user.school.name}
          isEditing={false}
        />
        <ProfileField
          label="School Address"
          value={current.user.school.address}
          isEditing={false}
        />
        <ProfileField
          label="Affiliation Board"
          value={current.user.school.affiliationBoard}
          isEditing={false}
        />
        <ProfileField
          label="Role"
          value={current.user.role.roleName}
          isEditing={false}
        />
      </FieldGrid>
    </SectionCard>
  );

  const _renderGuardian = () => (
    <SectionCard title="Guardian Information" delay={0.12}>
      <FieldGrid>
        <ProfileField
          label="Guardian Name"
          value={current.guardianName}
          isEditing={isEditing}
          onChange={v => handleFieldChange("guardianName", v)}
        />
        <ProfileField
          label="Guardian Phone"
          value={current.guardianPhone}
          isEditing={isEditing}
          type="tel"
          onChange={v => handleFieldChange("guardianPhone", v)}
        />
      </FieldGrid>
    </SectionCard>
  );

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "personal":
        return renderPersonal();
      case "academic":
        return renderAcademic();
      case "school":
        return renderSchool();
      default:
        return renderOverview();
    }
  };

  return (
    <div>
      <PageHeader
        title="Student Profile"
        description="Manage your personal and academic information"
        icon={Award}
        iconBgColor="--blue-light"
        iconColor="--blue"
        buttonText="Edit Profile"
        onButtonClick={handleEditToggle}
      />
      <ProfileTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTab()}

      {/* Edit Profile Modal */}
      {showForm && studentData && (
        <Modal
          isOpen={showForm}
          onClose={_handleFormCancel}
          title="Edit Profile"
          description="Update your personal information"
          className="max-w-3xl"
        >
          <StudentForm
            initialData={{
              id: studentData.id,
              firstName: studentData.user.firstName || "",
              middleName: studentData.user.middleName || undefined,
              lastName: studentData.user.lastName || "",
              email: studentData.user.email || "",
              phone: studentData.user.phone || "",
              gender:
                (studentData.user.gender as "male" | "female" | "other" | "") ||
                "",
              dob: studentData.user.dob || undefined,
              bloodGroup: studentData.user.bloodGroup || undefined,
              rollNo:
                (studentData.rollNumber === "N/A"
                  ? ""
                  : studentData.rollNumber) || "",
              admissionDate: studentData.enrollmentDate || "",
              guardianName:
                (studentData.guardianName === "N/A"
                  ? ""
                  : studentData.guardianName) || "",
              guardianPhone:
                (studentData.guardianPhone === "N/A"
                  ? ""
                  : studentData.guardianPhone) || "",
              fatherName:
                (studentData.guardianName === "N/A"
                  ? ""
                  : studentData.guardianName) || "",
              fatherPhone:
                (studentData.guardianPhone === "N/A"
                  ? ""
                  : studentData.guardianPhone) || "",
              permanentAddress: studentData.user.permanentAddress || "",
              currentAddress: studentData.user.currentAddress || "",
              academicYearId: studentData.academicYear?.id || "",
              classId: studentData.class?.id || "",
              user: {
                gender: studentData.user.gender || "",
              },
            }}
            onSubmitSuccess={handleFormSave}
            onClose={_handleFormCancel}
            roleId={studentData.user.role.id}
          />
        </Modal>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default StudentProfilePage;
