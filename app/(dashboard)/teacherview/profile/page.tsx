"use client";
import React, { useState } from "react";
import teacherApiResponse from "@/lib/data/teacher.json";
import type {
  ProfileTab,
  ProfileFieldProps,
} from "@/lib/types/teacher-profile";

interface ApiTeacherData {
  id: string;
  status: string;
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
    { id: "professional", label: "Professional" },
    { id: "academic", label: "Qualification" },
    { id: "classes", label: "School" },
  ];

  return (
    <div className="flex gap-1 bg-white border-[1.5px] border-[#dde3f5] rounded-xl p-1.5 mb-5 flex-wrap shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)]">
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

const ProfileHeader: React.FC<{
  teacher: ApiTeacherData;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ teacher, isEditing, onEditToggle, onSave, onCancel }) => {
  const { user } = teacher;

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
                teacher.status === "active" ? "bg-[#12a47e]" : "bg-[#e83b6a]"
              }`}
            />
          </div>

          <div>
            <div className="text-2xl font-extrabold tracking-[-0.5px] text-[#111827] font-[var(--font-sans)] leading-[1.2]">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-[13.5px] text-[#5c6a8a] mt-1 font-[var(--font-sans)]">
              {teacher.designation} · {teacher.department} Dept.
            </div>
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full bg-[#eef1ff] text-[#3d6cf4] font-mono">
                {teacher.employeeCode}
              </span>

              <span
                className={`text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full font-[var(--font-sans)] ${
                  teacher.status === "active"
                    ? "bg-[#e6faf5] text-[#12a47e]"
                    : "bg-[#fff0f4] text-[#e83b6a]"
                }`}
              >
                {teacher.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 items-center">
          {isEditing ? (
            <>
              <button
                onClick={onCancel}
                className="px-5 py-2.5 rounded-[11px] border-[1.5px] border-[#dde3f5] bg-white text-[13.5px] font-semibold text-[#5c6a8a] cursor-pointer font-[var(--font-sans)] transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="px-[22px] py-2.5 rounded-[11px] border-none bg-[#3d6cf4] text-[13.5px] font-semibold text-white cursor-pointer font-[var(--font-sans)] shadow-[0_4px_14px_rgba(61,108,244,0.3)] transition-all duration-180 flex items-center gap-1.5"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEditToggle}
                className="px-[22px] py-2.5 rounded-[11px] border-none bg-[#3d6cf4] text-[13.5px] font-semibold text-white cursor-pointer font-[var(--font-sans)] shadow-[0_4px_14px_rgba(61,108,244,0.3)] transition-all duration-180 flex items-center gap-1.5"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="bg-[#eef1ff] border-t border-[#c8d1ed] px-7 py-2.5 text-[13px] font-medium text-[#3d6cf4] font-[var(--font-sans)] flex items-center gap-2">
          You are in edit mode. Make your changes and click{" "}
          <strong>Save Changes</strong> to update.
        </div>
      )}
    </div>
  );
};

const TeacherProfilePage: React.FC = () => {
  const [teacherData, setTeacherData] = useState<ApiTeacherData>(
    teacherApiResponse.data,
  );
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [isEditing, setIsEditing] = useState(false);

  const [draft, setDraft] = useState<ApiTeacherData>(teacherApiResponse.data);

  const handleEditToggle = () => {
    setDraft(JSON.parse(JSON.stringify(teacherData)));
    setIsEditing(true);
  };

  const handleSave = () => {
    setTeacherData(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(JSON.parse(JSON.stringify(teacherData)));
    setIsEditing(false);
  };

  const setUserField = (key: string, val: string) => {
    setDraft(prev => ({
      ...prev,
      user: { ...prev.user, [key]: val },
    }));
  };

  const setTeacherField = (key: string, val: string) => {
    setDraft(prev => ({
      ...prev,
      [key]: val,
    }));
  };

  const current = isEditing ? draft : teacherData;

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
            mono
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
        title="Professional Details"
        subtitle="Employment information"
        delay={0.1}
      >
        <FieldGrid>
          <ProfileField
            label="Employee Code"
            value={current.employeeCode}
            isEditing={false}
            mono
          />
          <ProfileField
            label="Designation"
            value={current.designation}
            isEditing={false}
          />
          <ProfileField
            label="Department"
            value={current.department}
            isEditing={false}
          />
          <ProfileField
            label="Staff Category"
            value={current.staffCategory}
            isEditing={false}
          />
          <ProfileField
            label="Date of Joining"
            value={current.dateOfJoining}
            isEditing={false}
          />
          <ProfileField
            label="Experience"
            value={`${current.totalExpMonths} months`}
            isEditing={false}
          />
        </FieldGrid>
      </SectionCard>

      <SectionCard
        title="Academic Info"
        subtitle="Qualifications & specializations"
        delay={0.15}
        className="lg:col-span-2"
      >
        <div className="mb-[14px]">
          <div className="text-[11px] font-bold text-[#9aa5c4] uppercase tracking-[0.5px] mb-2 font-[var(--font-sans)]">
            Highest Qualification
          </div>
          <div className="text-[14px] font-semibold text-[#111827] font-[var(--font-sans)]">
            {current.highestQualification}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-bold text-[#9aa5c4] uppercase tracking-[0.5px] mb-2 font-[var(--font-sans)]">
            Specialization
          </div>
          <div className="text-[14px] font-semibold text-[#111827] font-[var(--font-sans)]">
            {current.specialization || "Not specified"}
          </div>
        </div>
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
            onChange={v => setUserField("firstName", v)}
          />
          <ProfileField
            label="Middle Name"
            value={current.user.middleName || ""}
            isEditing={isEditing}
            onChange={v => setUserField("middleName", v)}
          />
          <ProfileField
            label="Last Name"
            value={current.user.lastName}
            isEditing={isEditing}
            onChange={v => setUserField("lastName", v)}
          />
          <ProfileField
            label="Email"
            value={current.user.email}
            isEditing={isEditing}
            type="email"
            onChange={v => setUserField("email", v)}
            readOnly
          />
          <ProfileField
            label="Phone"
            value={current.user.phone}
            isEditing={isEditing}
            type="tel"
            onChange={v => setUserField("phone", v)}
            mono
          />
          <ProfileField
            label="Date of Birth"
            value={current.user.dob}
            isEditing={isEditing}
            type="date"
            onChange={v => setUserField("dob", v)}
          />
          <ProfileField
            label="Gender"
            value={current.user.gender}
            isEditing={isEditing}
            onChange={v => setUserField("gender", v)}
          />
          <ProfileField
            label="Blood Group"
            value={current.user.bloodGroup || ""}
            isEditing={isEditing}
            onChange={v => setUserField("bloodGroup", v)}
          />
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Address" delay={0.08}>
        <div className="mb-4">
          <ProfileField
            label="Permanent Address"
            value={current.user.permanentAddress || ""}
            isEditing={isEditing}
            onChange={v => setUserField("permanentAddress", v)}
          />
        </div>
        <div className="mb-4">
          <ProfileField
            label="Current Address"
            value={current.user.currentAddress || ""}
            isEditing={isEditing}
            onChange={v => setUserField("currentAddress", v)}
          />
        </div>
      </SectionCard>
    </>
  );

  const renderProfessional = () => (
    <>
      <SectionCard title="Employment Details" delay={0.04}>
        <FieldGrid>
          <ProfileField
            label="Employee Code"
            value={current.employeeCode}
            isEditing={isEditing}
            onChange={v => setTeacherField("employeeCode", v)}
            readOnly
            mono
          />
          <ProfileField
            label="Designation"
            value={current.designation}
            isEditing={isEditing}
            onChange={v => setTeacherField("designation", v)}
            readOnly
          />
          <ProfileField
            label="Department"
            value={current.department}
            isEditing={isEditing}
            onChange={v => setTeacherField("department", v)}
            readOnly
          />
          <ProfileField
            label="Staff Category"
            value={current.staffCategory}
            isEditing={isEditing}
            onChange={v => setTeacherField("staffCategory", v)}
            readOnly
          />
          <ProfileField
            label="Date of Joining"
            value={current.dateOfJoining}
            isEditing={isEditing}
            type="date"
            onChange={v => setTeacherField("dateOfJoining", v)}
            readOnly
          />
          <ProfileField
            label="Experience (months)"
            value={String(current.totalExpMonths)}
            isEditing={isEditing}
            type="number"
            onChange={v => setTeacherField("totalExpMonths", v)}
          />
          <ProfileField
            label="Salary Package"
            value={current.salaryPackage}
            isEditing={isEditing}
            onChange={v => setTeacherField("salaryPackage", v)}
          />
          <ProfileField
            label="Highest Qualification"
            value={current.highestQualification}
            isEditing={isEditing}
            onChange={v => setTeacherField("highestQualification", v)}
          />
        </FieldGrid>
      </SectionCard>
    </>
  );

  const renderAcademic = () => (
    <>
      <SectionCard title="Qualification Details" delay={0.04}>
        <FieldGrid>
          <ProfileField
            label="Highest Qualification"
            value={current.highestQualification}
            isEditing={isEditing}
            onChange={v => setTeacherField("highestQualification", v)}
          />
          <ProfileField
            label="Specialization"
            value={current.specialization || ""}
            isEditing={isEditing}
            onChange={v => setTeacherField("specialization", v)}
          />
          <ProfileField
            label="Total Experience"
            value={`${current.totalExpMonths} months`}
            isEditing={false}
          />
        </FieldGrid>
      </SectionCard>
    </>
  );

  const renderClasses = () => (
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

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "personal":
        return renderPersonal();
      case "professional":
        return renderProfessional();
      case "academic":
        return renderAcademic();
      case "classes":
        return renderClasses();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="font-[var(--font-sans)] min-h-screen">
      <ProfileHeader
        teacher={current}
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <ProfileTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {renderTab()}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TeacherProfilePage;
