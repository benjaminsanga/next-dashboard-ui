"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import { BiLeftArrowAlt } from "react-icons/bi";
import Link from "next/link";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Capture role from user input
  const [isLogin, setIsLogin] = useState(true);

  const handleSignUp = async () => {
    if (!role) {
      toast.error("Please select a role.");
      return;
    }

    const { error } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: {
            role,
          },
        },
      }
    );

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Sign-up successful!");
    }
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error?.message);
    else {
      toast.success("Login successful!");
      location.href = "/admin";
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
        <h1 className="text-xl font-bold mb-6">{isLogin ? "Login" : "Sign Up"}</h1>
        <input
          className="w-full mb-2 p-2 border rounded text-sm"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 border rounded text-sm"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLogin && (
          <select
            className="w-full mb-2 p-2 border rounded text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="results_admin">Results Admin</option>
            <option value="registration_admin">Registration Admin</option>
          </select>
        )}
        <div className="my-5 flex gap-5">
          {isLogin ? (
            <button
              className="w-full bg-blue-500 text-white py-2 rounded"
              onClick={handleSignIn}
            >
              Continue
            </button>
          ) : (
            <button
              className="w-full bg-gray-300 text-black py-2 rounded"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          )}
        </div>
      </div>
      <div>
        <span
          className="text-center text-xs text-gray-500 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          Or {isLogin ? "Sign up" : "Login"} instead
        </span>
      </div>
    </div>
  );
}
