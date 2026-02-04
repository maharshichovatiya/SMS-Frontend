import React, { useState } from "react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LoginPost } from "../apis/services";
import { SetitemsToLocalstorage } from "../components/LocalstorageItems";
import { SmallLoader } from "../components/smallLoader";

interface IFormData {
  email: string;
  password: string;
}

interface IFormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate=useNavigate()
  const [loading,setLoading]=useState<boolean>(false)
  const [formData, setFormData] = useState<IFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<IFormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof IFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: IFormErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const res = await LoginPost(formData);
        SetitemsToLocalstorage(res)
        navigate('/')
        setLoading(false);
      } catch (err:any) {
        const message = err?.message;
        toast.error(message + " or use other credentials");
      }
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div> */}
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
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

          {/* Password field */}
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
          {/* <button
            type="submit"
            className="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
          >
            Sign In
          </button> */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg mt-6 disabled:opacity-70"
          >
            {loading && (
              <SmallLoader/>
            )}
            {loading ? "Processing..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-slate-700"></div>
          <span className="px-3 text-slate-500 text-sm">or</span>
          <div className="flex-1 border-t border-slate-700"></div>
        </div>

        {/* Sign up link */}
        <p className="text-center text-slate-300">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
