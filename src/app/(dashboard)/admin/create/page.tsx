"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export default function CreateAdmin() {
  const [personnelNumber, setPersonnelNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [adminRole, setAdminRole] = useState("");
  
  useEffect(() => {
    const { role } = JSON.parse(window.localStorage.getItem("nasfa-dbms-admin") || "{}");
    setAdminRole(role);
  }, [])

  useEffect(() => {
    if (adminRole !== "admin") {
      window.history.back();
    }
  }, [adminRole]);

  const handleSignUp = async () => {
    if (!personnelNumber || !password || !role) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const { data, error } = await supabase.from("admins").insert([
        {
          personnel_number: personnelNumber,
          password: hashedPassword,
          role,
        },
      ]);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Admin registration successful!");
        setPersonnelNumber("")
        setPassword("")
      }
    } catch (err) {
      toast.error("Error hashing password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex gap-5 justify-start items-center mb-5 text-sm font-light">
        <span>Admin</span>
      </div>
      <div className="w-96 p-4 bg-white shadow-md rounded">
        <h1 className="text-xl font-bold mb-6">Admin Registration</h1>
        <input
          className="w-full mb-2 p-2 border rounded text-sm"
          type="text"
          name="personnelNumber"
          placeholder="Personnel Number"
          value={personnelNumber}
          onChange={(e) => setPersonnelNumber(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 border rounded text-sm"
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="w-full mb-2 p-2 border rounded text-sm"
          value={role}
          name="role"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="results_admin">Results Admin</option>
          <option value="registration_admin">Registration Admin</option>
        </select>
        <div className="my-5 flex gap-5">
          <button
            className="w-full bg-gray-300 text-black py-2 rounded"
            onClick={handleSignUp}
          >
            Register Admin
          </button>
        </div>
      </div>
    </div>
  );
}
