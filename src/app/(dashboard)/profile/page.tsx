"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs"; 

const schema = z
  .object({
    current_password: z.string().min(6, "Password must be at least 6 characters long"),
    new_password: z.string().min(6, "New password must be at least 6 characters long"),
    confirm_new_password: z.string().min(6, "Confirm new password must be at least 6 characters long"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords must match",
    path: ["confirm_new_password"],
  });

type Inputs = z.infer<typeof schema>;

const ProfilePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: Inputs) => {
    const { current_password, new_password } = data;
  
    setLoading(true);
    toast.loading("Updating password...", { id: "update-password" });
    const { id } = JSON.parse(localStorage.getItem("nasfa-dbms-admin") || '{}')
  
    try {
      // Fetch the currently logged-in user
      const { data: userData, error: userError } = await supabase
        .from("admins")
        .select("id, personnel_number, password")
        .eq("id", id)
        .single();
  
      if (userError || !userData) {
        throw new Error("User not found or not logged in.");
      }
  
      // Validate current password
      const isMatch = await bcrypt.compare(current_password, userData.password);
      if (!isMatch) {
        throw new Error("Current password is incorrect.");
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(new_password, 10);
  
      // Update the password in the database
      const { error: updateError } = await supabase
        .from("admins")
        .update({ password: hashedPassword })
        .eq("id", userData.id);
  
      if (updateError) {
        throw new Error("Failed to update password.");
      }
  
      toast.success("Password updated successfully. Logging out...", { id: "update-password" });
  
      // Logout user (if applicable)
      localStorage.clear()
  
      // Redirect to login page
      router.push("/auth");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password.", { id: "update-password" });
    } finally {
      setLoading(false);
      reset();
    }
  };
  

  return (
    <div className="max-w-md ms-8 mt-10">
      <div className="flex justify-between w-full items-center">
        <h1 className="text-2xl font-bold mb-4">Change Password</h1>
        <button onClick={() => router.push(`/admin/create`)} className="text-sm rounded-sm px-2 py-1 border border-gray-500 text-gray-500">Create Admin</button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col flex-wrap gap-4">
          <div className="flex flex-col">
            <label htmlFor="current_password" className="font-semibold">
              Current Password
            </label>
            <input
              id="current_password"
              type="password"
              {...register("current_password")}
              className={`border px-3 py-2 rounded-md ${
                errors.current_password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.current_password && (
              <span className="text-red-500 text-sm">{errors.current_password.message}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="new_password" className="font-semibold">
              New Password
            </label>
            <input
              id="new_password"
              type="password"
              {...register("new_password")}
              className={`border px-3 py-2 rounded-md ${
                errors.new_password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.new_password && (
              <span className="text-red-500 text-sm">{errors.new_password.message}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirm_new_password" className="font-semibold">
              Confirm New Password
            </label>
            <input
              id="confirm_new_password"
              type="password"
              {...register("confirm_new_password")}
              className={`border px-3 py-2 rounded-md ${
                errors.confirm_new_password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirm_new_password && (
              <span className="text-red-500 text-sm">{errors.confirm_new_password.message}</span>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
