"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import { BiLeftArrowAlt } from "react-icons/bi";
import Link from "next/link";
import bcrypt from "bcryptjs";

export default function Auth() {
  const [personnelNumber, setPersonnelNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!personnelNumber || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Fetch the admin record by personnel number
      const { data, error } = await supabase
        .from("admins")
        .select("id, password, role")
        .eq("personnel_number", personnelNumber)
        .single();

      if (error || !data) {
        toast.error("Invalid personnel number or password.");
        return;
      }

      // Compare the entered password with the hashed password
      const isMatch = await bcrypt.compare(password, data.password);

      if (!isMatch) {
        toast.error("Invalid personnel number or password.");
      } else {
        toast.success("Login successful!");
        localStorage.setItem("nasfa-dbms-admin", JSON.stringify(data))
        location.href = `/admin?role=${data.role}`;
      }
    } catch (err) {
      toast.error("Error verifying credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Link href={"/"}>
        <div className="flex gap-5 justify-start items-center mb-5 text-sm font-light">
          <BiLeftArrowAlt /> <span>Back To Home</span>
        </div>
      </Link>
      <div className="w-96 p-4 bg-white shadow-md rounded">
        <h1 className="text-xl font-bold mb-6">Login</h1>
        <input
          className="w-full mb-2 p-2 border rounded text-sm"
          type="text"
          placeholder="Personnel Number"
          value={personnelNumber}
          onChange={(e) => setPersonnelNumber(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 border rounded text-sm"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="my-5 flex gap-5">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={handleSignIn}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
