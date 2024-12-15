"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

    try {
      // Validate current password
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user?.email) {
        throw new Error("User not found or not logged in");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: current_password,
      });

      if (signInError) {
        throw new Error("Failed to authenticate with current password");
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: new_password,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      toast.success("Password updated successfully. Logging out...", { id: "update-password" });

      // Logout user
      await supabase.auth.signOut();

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
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>
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
