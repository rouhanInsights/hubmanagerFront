"use client";
import React from "react";
import { logout } from "../../utils/api"; // Import logout function
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Call logout function
    router.push("/login"); // Redirect to login page
  };

  return (
    <nav className="flex justify-between p-4 bg-gray-100 shadow-md">
      <h1 className="text-xl font-bold">Speech Fix</h1>
      <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
        Logout
      </button>
    </nav>
  );
};

export default Navbar; // Ensure this is a default export
