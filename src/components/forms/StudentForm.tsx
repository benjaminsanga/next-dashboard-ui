"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
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
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  photo_url: z.string().min(1, { message: "File is required!" }),
  student_id: z.string().min(1, { message: "Student ID is required!" }),
  department: z.string().min(1, { message: "Department is required!" }),
  course: z.string().min(1, { message: "Course is required!" }),
  dob: z.preprocess((arg) => (arg ? new Date(arg as string) : undefined), z.date({ message: "DOB is required!" })),
  course_length: z.enum(["long course", "short course"], { message: "Course length is required!" }),
  religion: z.string().min(1, { message: "Religion is required!" }),
  blood_group: z.string().min(1, { message: "Blood group is required!" }),
  genotype: z.string().min(1, { message: "Genotype is required!" }),
  marital_status: z.string().min(1, { message: "Marital status is required!" }),
  next_of_kin: z.object({
    name: z.string().min(1, { message: "Name is required!" }),
    phone: z.string().min(1, { message: "Phone number is required!" }),
    address: z.string().min(1, { message: "Address is required!" }),
    relationship: z.string().min(1, { message: "Relationship is required!" }),
  }),
  close_associate_lagos: z.object({
    name: z.string().min(1, { message: "Name is required!" }),
    phone: z.string().min(1, { message: "Phone number is required!" }),
    address: z.string().min(1, { message: "Address is required!" }),
  }),
  close_associate_outside_lagos: z.object({
    name: z.string().min(1, { message: "Name is required!" }),
    phone: z.string().min(1, { message: "Phone number is required!" }),
    address: z.string().min(1, { message: "Address is required!" }),
  }),
});

type Inputs = z.infer<typeof schema>;

const StudentForm = ({
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
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const insertStudent = async (student: Inputs): Promise<Inputs | null> => {
    const { error: signupError } = await supabase.auth.signUp({ email: student.email, password: student.password });
    if (signupError) {
      toast.error(signupError.message);
      return null;
    } else toast.success("Sign-up successful...");

    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .single();

    if (error) {
      console.error("Error inserting student:", error.message);
      return null;
    }
    return data as Inputs;
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

  const onSubmit = async (data: any) => {
    const result = await insertStudent(data);
    toast.success("Data successfully submitted");
    reset();
  };

  const onError = (error: any) => console.log("error:", error);

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit, onError)}>
      <h1 className="text-xl font-semibold">Create a new student</h1>

      {/* Existing Fields */}
      <div className="flex flex-wrap gap-4">
        {/* Authentication Information */}
        <InputField label="Email" name="email" defaultValue={data?.email} register={register} error={errors.email} />
        <InputField label="Password" name="password" type="password" defaultValue={data?.password} register={register} error={errors.password} />
        <InputField label="Student ID" name="student_id" defaultValue={data?.student_id} register={register} error={errors.student_id} />
      </div>

      {/* Personal Information */}
      <div className="flex flex-wrap gap-4">
        <InputField label="First Name" name="first_name" defaultValue={data?.first_name} register={register} error={errors.first_name} />
        <InputField label="Last Name" name="last_name" defaultValue={data?.last_name} register={register} error={errors.last_name} />
        <InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors.phone} />
        <InputField label="Address" name="address" defaultValue={data?.address} register={register} error={errors.address} />
        <InputField label="Date of Birth" name="dob" defaultValue={data?.dob} register={register} error={errors.dob} type="date" />
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
      </div>

      {/* New Fields */}
      <div className="flex flex-wrap gap-4">
        <InputField label="Religion" name="religion" defaultValue={data?.religion} register={register} error={errors.religion} />
        <InputField label="Blood Group" name="blood_group" defaultValue={data?.blood_group} register={register} error={errors.blood_group} />
        <InputField label="Genotype" name="genotype" defaultValue={data?.genotype} register={register} error={errors.genotype} />
        <InputField label="Marital Status" name="marital_status" defaultValue={data?.marital_status} register={register} error={errors.marital_status} />
        <div>
          <label className="text-xs text-gray-500">Course Length</label>
          <select {...register("course_length")} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full">
            <option value="long course">Long Course</option>
            <option value="short course">Short Course</option>
          </select>
          {errors.course_length?.message && <p>{errors.course_length.message}</p>}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">
            Select Departments
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            {...register("department")}
          >
            <option>Choose department</option>
            {departmentOptions?.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          {errors.department?.message && (
            <p className="text-xs text-red-400">
              {errors.department.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">
            Select Courses
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            {...register("course")}
          >
            <option>Choose course</option>
            {courseOptions?.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          {errors.course?.message && (
            <p className="text-xs text-red-400">
              {errors.course.message.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Nested Objects */}
      <h2>Next of Kin</h2>
      <div className="flex flex-wrap gap-4">
        <InputField label="Name" name="next_of_kin.name" register={register} error={errors.next_of_kin?.name} />
        <InputField label="Phone" name="next_of_kin.phone" register={register} error={errors.next_of_kin?.phone} />
        <InputField label="Address" name="next_of_kin.address" register={register} error={errors.next_of_kin?.address} />
        <InputField label="Relationship" name="next_of_kin.relationship" register={register} error={errors.next_of_kin?.relationship} />
      </div>

      <h2>Close Associate Within Lagos</h2>
      <div className="flex flex-wrap gap-4">
        <InputField label="Name" name="close_associate_lagos.name" register={register} error={errors.close_associate_lagos?.name} />
        <InputField label="Phone" name="close_associate_lagos.phone" register={register} error={errors.close_associate_lagos?.phone} />
        <InputField label="Address" name="close_associate_lagos.address" register={register} error={errors.close_associate_lagos?.address} />
      </div>

      <h2>Close Associate Outside Lagos</h2>
      <div className="flex flex-wrap gap-4">
        <InputField label="Name" name="close_associate_outside_lagos.name" register={register} error={errors.close_associate_outside_lagos?.name} />
        <InputField label="Phone" name="close_associate_outside_lagos.phone" register={register} error={errors.close_associate_outside_lagos?.phone} />
        <InputField label="Address" name="close_associate_outside_lagos.address" register={register} error={errors.close_associate_outside_lagos?.address} />
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
