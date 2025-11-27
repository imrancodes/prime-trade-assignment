"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const confirmation = confirm("Do you really want to logout!");
    if (!confirmation) return;
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    
    router.push("/login");
  };

  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <div className="text-xl font-semibold">MyApp</div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
        >
          Home
        </Link>

        <Link
          href="/profile"
          className="px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
        >
          Profile
        </Link>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
