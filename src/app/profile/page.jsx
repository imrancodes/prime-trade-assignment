"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";

const page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    
    const profileFetch = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
    
      setName(data.user.name);
      setEmail(data.user.email);
    };

    profileFetch();
  }, []);

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();

    setName(data.user.name);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="grow flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-center">Your Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full p-3 border rounded-xl bg-gray-100 cursor-not-allowed"
              />
            </div>

            <button
              onClick={handleNameUpdate}
              className="w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
