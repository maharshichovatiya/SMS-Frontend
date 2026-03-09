import {
  Droplet,
  FileText,
  CreditCard,
  Building,
  Banknote,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TeacherFormData } from "@/lib/validations/TeacherSchema";

interface AdditionalInfoSectionProps {
  register: UseFormRegister<TeacherFormData>;
  errors: FieldErrors<TeacherFormData>;
}

export default function AdditionalInfoSection({
  register,
  errors,
}: AdditionalInfoSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="section-label">Additional Information</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="label-base">Blood Group</label>
          <div className="relative">
            <Droplet
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <select
              {...register("bloodGroup")}
              className={`input-base pl-9 appearance-none ${
                errors.bloodGroup ? "error" : ""
              }`}
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
          </div>
          {errors.bloodGroup && (
            <span className="text-xs text-[var(--rose)]">
              {errors.bloodGroup.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">Aadhaar Number</label>
          <div className="relative">
            <FileText
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("aadhaarNo")}
              type="text"
              placeholder="123456789012"
              maxLength={12}
              onKeyDown={e => {
                if (
                  !/[0-9]/.test(e.key) &&
                  ![
                    "Backspace",
                    "Delete",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              className={`input-base pl-9 ${errors.aadhaarNo ? "error" : ""}`}
            />
          </div>
          {errors.aadhaarNo && (
            <span className="text-xs text-[var(--rose)]">
              {errors.aadhaarNo.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">PAN Number</label>
          <div className="relative">
            <CreditCard
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("panNo")}
              type="text"
              placeholder="ABCDE1234F"
              maxLength={10}
              className={`input-base pl-9 uppercase ${errors.panNo ? "error" : ""}`}
              onInput={e => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.toUpperCase();
              }}
            />
          </div>
          {errors.panNo && (
            <span className="text-xs text-[var(--rose)]">
              {errors.panNo.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">Bank Name</label>
          <div className="relative">
            <Building
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("bankName")}
              type="text"
              placeholder="State Bank of India"
              onKeyDown={e => {
                if (
                  !/[a-zA-Z\s&.-]/.test(e.key) &&
                  ![
                    "Backspace",
                    "Delete",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              className={`input-base pl-9 ${errors.bankName ? "error" : ""}`}
            />
          </div>
          {errors.bankName && (
            <span className="text-xs text-[var(--rose)]">
              {errors.bankName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">Account Number</label>
          <div className="relative">
            <Banknote
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("accountNo")}
              type="number"
              placeholder="123456789012345"
              maxLength={18}
              className={`input-base pl-9 ${errors.accountNo ? "error" : ""}`}
              onInput={e => {
                const value = e.currentTarget.value;
                // Only allow numbers, max 18 digits for teacher
                const numericValue = value.replace(/\D/g, "").slice(0, 18);
                if (value !== numericValue) {
                  e.currentTarget.value = numericValue;
                }
              }}
            />
          </div>
          {errors.accountNo && (
            <span className="text-xs text-[var(--rose)]">
              {errors.accountNo.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">IFSC Code</label>
          <div className="relative">
            <CreditCard
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("ifscCode")}
              type="text"
              placeholder="SBIN0001234"
              maxLength={11}
              className={`input-base pl-9 ${errors.ifscCode ? "error" : ""}`}
            />
          </div>
          {errors.ifscCode && (
            <span className="text-xs text-[var(--rose)]">
              {errors.ifscCode.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">Bank Branch</label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("branch")}
              type="text"
              placeholder="Main Branch"
              onKeyDown={e => {
                if (
                  !/[a-zA-Z\s&.-]/.test(e.key) &&
                  ![
                    "Backspace",
                    "Delete",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              className={`input-base pl-9 ${errors.branch ? "error" : ""}`}
            />
          </div>
          {errors.branch && (
            <span className="text-xs text-[var(--rose)]">
              {errors.branch.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
