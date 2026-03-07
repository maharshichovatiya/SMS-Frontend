"use client";

import {
  Mail,
  Phone,
  Calendar,
  IndianRupee,
  Award,
  GraduationCap,
  Droplet,
  User,
  Briefcase,
  Building2,
  CreditCard,
  MapPin,
  FileText,
  Home,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import { GetTeachers } from "@/lib/types/Teacher";
import { formatExperience } from "@/lib/utils/TotalExpMonths";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teacher: GetTeachers;
}

export default function TeacherViewModal({ isOpen, onClose, teacher }: Props) {
  const fullName = `${teacher.user.firstName} ${teacher.user.lastName}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={fullName}
      description={`${teacher.designation} · ${teacher.department}`}
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* First Row: Basic Info & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
              Basic Information
            </h4>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <User size={14} className="shrink-0 text-[var(--text-3)]" />
              <span className="font-semibold">{fullName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <Award size={14} className="shrink-0 text-[var(--text-3)]" />
              <span>{teacher.designation}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <Building2 size={14} className="shrink-0 text-[var(--text-3)]" />
              <span>{teacher.employeeCode}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <User size={14} className="shrink-0 text-[var(--text-3)]" />
              <span>Status: {teacher.status}</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
              Contact Information
            </h4>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <Mail size={14} className="shrink-0 text-[var(--text-3)]" />
              <span className="truncate">{teacher.user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <Phone size={14} className="shrink-0 text-[var(--text-3)]" />
              <span>{teacher.user.phone}</span>
            </div>
          </div>
        </div>

        {/* Second Row: Personal Info & Employment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
              Personal Information
            </h4>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <Calendar size={14} className="shrink-0 text-[var(--text-3)]" />
              <span>DOB: {teacher.user.dob}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <User size={14} className="shrink-0 text-[var(--text-3)]" />
              <span>Gender: {teacher.user.gender}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <Droplet size={14} className="shrink-0 text-[var(--text-3)]" />
              <span>Blood Group: {teacher.user.bloodGroup}</span>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
              Employment Information
            </h4>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <Building2 size={14} className="shrink-0 text-[var(--text-3)]" />
              <span>Department: {teacher.department}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <Briefcase size={14} className="shrink-0 text-[var(--text-3)]" />
              <span>Designation: {teacher.designation}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <Calendar size={14} className="shrink-0 text-[var(--text-3)]" />
              <span>Date of Joining: {teacher.dateOfJoining}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <GraduationCap
                size={14}
                className="shrink-0 text-[var(--text-3)]"
              />
              <span>Highest Qualification: {teacher.highestQualification}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <IndianRupee
                size={14}
                className="shrink-0 text-[var(--text-3)]"
              />
              <span>
                Salary Package: ₹
                {Math.floor(Number(teacher.salaryPackage)).toLocaleString(
                  "en-IN",
                )}
                /year
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <Briefcase size={14} className="shrink-0 text-[var(--text-3)]" />
              <span>
                Experience: {formatExperience(teacher.totalExpMonths)}
              </span>
            </div>
          </div>
        </div>

        {/* Third Row: Bank Details & Personal Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Details */}
          {(teacher.user.bankName ||
            teacher.user.accountNo ||
            teacher.user.ifscCode ||
            teacher.user.branch) && (
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
                Bank Details
              </h4>
              {teacher.user.bankName && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                  <Building2
                    size={14}
                    className="shrink-0 text-[var(--text-3)]"
                  />
                  <span>Bank: {teacher.user.bankName}</span>
                </div>
              )}
              {teacher.user.accountNo && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                  <CreditCard
                    size={14}
                    className="shrink-0 text-[var(--text-3)]"
                  />
                  <span>Account: {teacher.user.accountNo}</span>
                </div>
              )}
              {teacher.user.ifscCode && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                  <CreditCard
                    size={14}
                    className="shrink-0 text-[var(--text-3)]"
                  />
                  <span>IFSC: {teacher.user.ifscCode}</span>
                </div>
              )}
              {teacher.user.branch && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                  <MapPin size={14} className="shrink-0 text-[var(--text-3)]" />
                  <span>Branch: {teacher.user.branch}</span>
                </div>
              )}
            </div>
          )}

          {/* Personal Data */}
          {(teacher.user.bloodGroup ||
            teacher.user.aadhaarNo ||
            teacher.user.panNo) && (
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
                Personal Data
              </h4>
              {teacher.user.bloodGroup && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                  <Droplet
                    size={14}
                    className="shrink-0 text-[var(--text-3)]"
                  />
                  <span>Blood Group: {teacher.user.bloodGroup}</span>
                </div>
              )}
              {teacher.user.aadhaarNo && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                  <FileText
                    size={14}
                    className="shrink-0 text-[var(--text-3)]"
                  />
                  <span>Aadhaar: {teacher.user.aadhaarNo}</span>
                </div>
              )}
              {teacher.user.panNo && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                  <CreditCard
                    size={14}
                    className="shrink-0 text-[var(--text-3)]"
                  />
                  <span>PAN: {teacher.user.panNo}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Address Details */}
        {(teacher.user.permanentAddress || teacher.user.currentAddress) && (
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
              Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teacher.user.permanentAddress && (
                <div className="flex items-start gap-2 text-sm text-[var(--text-2)]">
                  <Home
                    size={14}
                    className="shrink-0 text-[var(--text-3)] mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">Permanent: </span>
                    <div className="whitespace-pre-wrap break-words">
                      {teacher.user.permanentAddress.length > 200
                        ? `${teacher.user.permanentAddress.substring(0, 200)}...`
                        : teacher.user.permanentAddress}
                    </div>
                  </div>
                </div>
              )}
              {teacher.user.currentAddress && (
                <div className="flex items-start gap-2 text-sm text-[var(--text-2)]">
                  <MapPin
                    size={14}
                    className="shrink-0 text-[var(--text-3)] mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">Current: </span>
                    <div className="whitespace-pre-wrap break-words">
                      {teacher.user.currentAddress.length > 200
                        ? `${teacher.user.currentAddress.substring(0, 200)}...`
                        : teacher.user.currentAddress}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
