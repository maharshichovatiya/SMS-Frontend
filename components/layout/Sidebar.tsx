import Home from "@/app/page";
import { HomeIcon, Settings, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg p-5">
      <h2 className="text-xl font-bold mb-8">My Dashboard</h2>

      <nav className="space-y-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
        >
          <HomeIcon size={18} />
          Home
        </Link>

        <Link
          href="/dashboard/users"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
        >
          <Users size={18} />
          Users
        </Link>

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
        >
          <Settings size={18} />
          Settings
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
