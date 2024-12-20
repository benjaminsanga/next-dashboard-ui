"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { departmentOptions, courseOptions } from "@/lib/data";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address!" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long!" }),
  first_name: z.string().min(1, { message: "First name is required!" }),
  last_name: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  departments: z.array(z.string()).nonempty({ message: "At least one department is required!" }),
  courses: z.array(z.string()).nonempty({ message: "At least one course is required!" }),
  instructor_id: z.string().min(1, { message: "Instructor ID is required!" }),
  dob: z.date({ message: "DOB is required!" }),
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  photo_url: z.string().url({ message: "Valid photo URL is required!" }),
});

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  useEffect(() => {
    setValue("departments", selectedDepartments as [string, ...string[]]);
    setValue("courses", selectedCourses as [string, ...string[]]);
  }, [selectedDepartments, selectedCourses, setValue]);

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedDepartments(selected);
  };

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedCourses(selected);
  };

  const onSubmit = async (data: Inputs) => {
    // Submit logic here
    toast.success("Data successfully submitted!");
    reset();
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">Create a new instructor</h1>

      {/* Authentication Info */}
      <div className="flex flex-wrap gap-4">
        <InputField label="Email" name="email" defaultValue={data?.email} register={register} error={errors.email} />
        <InputField label="Password" name="password" type="password" register={register} error={errors.password} />
        <InputField
          label="Instructor ID"
          name="instructor_id"
          defaultValue={data?.instructor_id}
          register={register}
          error={errors.instructor_id}
        />
      </div>

      {/* Personal Info */}
      <div className="flex flex-wrap gap-4">
        <InputField
          label="First Name"
          name="first_name"
          defaultValue={data?.first_name}
          register={register}
          error={errors.first_name}
        />
        <InputField
          label="Last Name"
          name="last_name"
          defaultValue={data?.last_name}
          register={register}
          error={errors.last_name}
        />
        <InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors.phone} />
        <InputField label="Address" name="address" defaultValue={data?.address} register={register} error={errors.address} />
        <InputField
          label="Date of Birth"
          name="dob"
          type="date"
          defaultValue={data?.dob}
          register={register}
          error={errors.dob}
        />
        <div>
          <label>Sex</label>
          <select {...register("sex")} defaultValue={data?.sex || "male"}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {/* Department and Course Selection */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label>Select Departments</label>
          <select multiple value={selectedDepartments} onChange={handleDepartmentChange}>
            {departmentOptions.long.map((dept, idx) => (
              <option key={dept} value={dept}>
                {dept} ({departmentOptions.short[idx]})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Courses</label>
          <select multiple value={selectedCourses} onChange={handleCourseChange}>
            {selectedDepartments.flatMap((dept) =>
              courseOptions[dept]?.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default TeacherForm;
