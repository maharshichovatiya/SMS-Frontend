"use client";

import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/lib/store/Index";

export default function Home() {
  const role = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    if (role === "admin") {
      redirect("/dashboard");
    } else if (role === "teacher") {
      redirect("/teacherview");
    } else if (role === "student") {
      redirect("/dashboard");
    }
  }, [role]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
