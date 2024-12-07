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
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
  first_name: z.string().min(1, { message: "First name is required!" }),
  last_name: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  departments: z
    .array(z.string().min(1, { message: "Each department must have a name!" }))
    .nonempty({ message: "At least one department is required!" }),
  courses: z
    .array(z.string().min(1, { message: "Each course must have a name!" }))
    .nonempty({ message: "At least one course is required!" }),
  instructor_id: z.string().min(1, { message: "Instructor ID is required!" }),
  dob: z.preprocess((arg) => (arg ? new Date(arg as string) : undefined), z.date({ message: "DOB is required!" })),
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  photo_url: z.string().min(1, { message: "File is required!" }),
});

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  useEffect(() => {
    setValue("departments", selectedDepartments as [string, ...string[]])
    setValue("courses", selectedCourses as [string, ...string[]])
    if (selectedCourses.length > 0) clearErrors("courses")
    if (selectedDepartments.length > 0) clearErrors("departments")
  }, [selectedDepartments, selectedCourses, setValue, clearErrors]);
  
  const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedDepartments(selected);
  };

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedCourses(selected);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
  
      formData.append("file", file);
      formData.append("upload_preset", "nasfa-dbms");
  
      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dlbeorqf7/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
  
        if (!res.ok) {
          throw new Error("Failed to upload image");
        }
  
        const data = await res.json();
        setValue("photo_url", data.secure_url);
        clearErrors("photo_url");
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Failed to upload image");
      }
    }
  };
  
  const insertInstructor = async (instructor: Inputs): Promise<Inputs | null> => {
    toast.loading("Submitting data", {id: 'nasfa-dbms-instructor', duration: 1000})
    const { data, error } = await supabase
      .from('instructors')
      .insert([instructor])
      .single();
  
    if (error) {
      console.error("Error inserting instructor:", error.message);
      toast.error(error.message, {id: 'nasfa-dbms-instructor'})
      return null;
    }
    return data as Inputs;
  };

  const onSubmit = async (data: Inputs) => {
    console.log(data);
    const result = await insertInstructor(data);
    toast.success("Data successfully submitted")
    reset()
  };

  const onError = (error: any) => console.log("error:", error)

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit, onError)}>
      <h1 className="text-xl font-semibold">Create a new instructor</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
        <InputField
          label="Instructor ID"
          name="instructor_id"
          type="text"
          defaultValue={data?.instructor_id}
          register={register}
          error={errors?.instructor_id}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
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
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Date of Birth"
          name="dob"
          defaultValue={data?.dob}
          register={register}
          error={errors.dob}
          type="date"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input type="file" id="img" onChange={handleImageChange} className="hidden" />
          {errors.photo_url?.message && (
            <p className="text-xs text-red-400">
              {errors.photo_url.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">
            Select Departments
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            value={selectedDepartments}
            onChange={handleDepartmentChange}
          >
            <option>Choose department</option>
            {departmentOptions.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          {errors.departments?.message && (
            <p className="text-xs text-red-400">
              {errors.departments.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">
            Select Courses
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            value={selectedCourses}
            onChange={handleCourseChange}
          >
            <option>Choose course</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          {errors.courses?.message && (
            <p className="text-xs text-red-400">
              {errors.courses.message.toString()}
            </p>
          )}
        </div>
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default TeacherForm;
