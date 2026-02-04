import React, { useState, type ChangeEvent } from "react";
import { Mail, Lock, User, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SignupPost } from "../apis/services";
import toast from "react-hot-toast";
import { SetitemsToLocalstorage } from "../components/LocalstorageItems";
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const res = await SignupPost(formData);
        if (res.token) {
          SetitemsToLocalstorage(res)
          toast.success("Successfully registered the user");
          navigate("/");
        }
        setLoading(false);
      } catch (err: any) {
        const message = err?.message;
        setLoading(false)
        toast.error(message + " or use other credentials");
      }
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Join us today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 font-semibold mb-2 text-sm">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-700/30 border-2 rounded-lg focus:outline-none transition-all text-white placeholder-slate-500 ${
                  errors.name
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-600/50 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.name && (
              <div className="flex items-center gap-1 text-red-400 text-sm mt-1.5">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </div>
            )}
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-2 text-sm">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-700/30 border-2 rounded-lg focus:outline-none transition-all text-white placeholder-slate-500 ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-600/50 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1 text-red-400 text-sm mt-1.5">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </div>
            )}
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-2 text-sm">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-700/30 border-2 rounded-lg focus:outline-none transition-all text-white placeholder-slate-500 ${
                  errors.password
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-600/50 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.password && (
              <div className="flex items-center gap-1 text-red-400 text-sm mt-1.5">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </div>
            )}
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-2 text-sm">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-700/30 border-2 rounded-lg focus:outline-none transition-all text-white placeholder-slate-500 ${
                  errors.confirmPassword
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-600/50 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center gap-1 text-red-400 text-sm mt-1.5">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmPassword}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg mt-6 disabled:opacity-70"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading ? "Processing..." : "Create Account"}
          </button>
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-700"></div>
            <span className="px-3 text-slate-500 text-sm">or</span>
            <div className="flex-1 border-t border-slate-700"></div>
          </div>
          <p className="text-center text-slate-300">
            Have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
