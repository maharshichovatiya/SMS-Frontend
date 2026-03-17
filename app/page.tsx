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
      redirect("/dashboard");
    } else if (role === "student") {
      redirect("/dashboard");
    }
    redirect("/dashboard");
  }, [role]);

  return null;
}
