import React from "react";

function Header() {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="w-10 h-10 bg-gray-300 rounded-full" />
    </header>
  );
}

export default Header;
