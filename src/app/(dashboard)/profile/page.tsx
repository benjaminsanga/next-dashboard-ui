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
  const [admins, setAdmins] = useState<any[]>([]);
  const router = useRouter();
  const [adminRole, setAdminRole] = useState("");

  useEffect(() => {
    const { role } = JSON.parse(window.localStorage.getItem("nasfa-dbms-admin") || "{}");
    setAdminRole(role);
  }, [])

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase.from("admins").select("id, personnel_number, role");
      if (error) throw error;
      setAdmins(data || []);
    } catch (err) {
      toast.error("Failed to fetch admins.");
    }
  };

  const deleteAdmin = async (adminId: number) => {
    try {
      const { error } = await supabase.from("admins").delete().eq("id", adminId);
      if (error) throw error;
      toast.success("Admin deleted successfully.");
      setAdmins((prev) => prev.filter((admin: any) => admin.id !== adminId));
    } catch (err) {
      toast.error("Failed to delete admin.");
    }
  };

  useEffect(() => {
    if (adminRole === "admin") fetchAdmins();
  }, [adminRole]);

  const onSubmit = async (data: Inputs) => {
    const { current_password, new_password } = data;
    setLoading(true);
    toast.loading("Updating password...", { id: "update-password" });
    const { id } = JSON.parse(localStorage.getItem("nasfa-dbms-admin") || "{}");

    try {
      const { data: userData, error: userError } = await supabase
        .from("admins")
        .select("id, personnel_number, password")
        .eq("id", id)
        .single();

      if (userError || !userData) throw new Error("User not found or not logged in.");

      const isMatch = await bcrypt.compare(current_password, userData.password);
      if (!isMatch) throw new Error("Current password is incorrect.");

      const hashedPassword = await bcrypt.hash(new_password, 10);
      const { error: updateError } = await supabase
        .from("admins")
        .update({ password: hashedPassword })
        .eq("id", userData.id);

      if (updateError) throw new Error("Failed to update password.");

      toast.success("Password updated successfully. Logging out...", { id: "update-password" });
      localStorage.clear();
      router.push("/auth");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password.", { id: "update-password" });
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="m-10 text-gray-700">
      <div className="flex justify-between w-full items-center">
        <h1 className="text-2xl font-bold mb-4">Change Password</h1>
        {adminRole === "admin" && (
          <button
            onClick={() => router.push(`/admin/create`)}
            className="text-sm rounded-sm px-2 py-1 border border-gray-300 text-gray-500"
          >
            Create Admin
          </button>
        )}
      </div>
      <div className="w-full flex lg:flex-row flex-col gap-5">
        <div className="w-1/2">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col flex-wrap gap-4">
            <div className="flex flex-col">
              <label htmlFor="current_password" className="text-sm mb-1 font-light">
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
              <label htmlFor="new_password" className="text-sm mb-1 font-light">
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
              <label htmlFor="confirm_new_password" className="text-sm mb-1 font-light">
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
        <div className="w-1/2">
          {adminRole === "admin" && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Admin List</h2>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Personnel Number</th>
                    <th className="border border-gray-300 px-4 py-2">Role</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin: { id: number, personnel_number: string, role: string}) => (
                    <tr key={admin.id}>
                      <td className="border border-gray-300 px-4 py-2">{admin.personnel_number}</td>
                      <td className="border border-gray-300 px-4 py-2">{admin.role}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => deleteAdmin(admin.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
