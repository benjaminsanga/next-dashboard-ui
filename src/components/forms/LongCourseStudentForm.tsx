"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { departmentOptions, courseOptions } from "@/lib/data";
import { useEffect, useState } from "react";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
  first_name: z.string().min(1, { message: "First name is required!" }),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  photo_url: z.string().nullable().optional(),
  matric_number: z.string().min(1, { message: "Matric Number is required!" }),
  personnel_id_number: z.string().min(1, { message: "Personnel ID Number is required!" }),
  jamb_reg_number: z.string().min(1, { message: "Jamb Registration Number is required!" }),
  rank: z.string().min(1, { message: "Rank is required!" }),
  department: z.string().min(1, { message: "Department is required!" }),
  course: z.string().min(1, { message: "Course is required!" }),
  dob: z.preprocess((arg) => (arg ? new Date(arg as string) : undefined), z.date({ message: "DOB is required!" })),
  // course_length: z.enum(["long", "short"], { message: "Course length is required!" }),
  religion: z.string().min(1, { message: "Religion is required!" }),
  blood_group: z.string().min(1, { message: "Blood group is required!" }),
  genotype: z.string().min(1, { message: "Genotype is required!" }),
  marital_status: z.enum(["Single", "Married"], { message: "Marital status is required!" }),
  medical_status: z.enum(["Fit", "Unfit"], { message: "Medical status is required!" }),
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
  created_by: z.string().nullable(),
});

type Inputs = z.infer<typeof schema>;

const LongCourseStudentForm = ({
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
    watch,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [filteredCourses, setFilteredCourses] = useState<string[]>([]);
  
  useEffect(() => {
    const { personnel_number } = JSON.parse(localStorage.getItem("nasfa-dbms-admin") || '{}');
    setValue("created_by", personnel_number);
  }, [setValue]);

  const filteredDepartments = departmentOptions["long"];

  const handleDepartmentChange = (value: string) => {
    setFilteredCourses(courseOptions[value] || []);
    setValue("course", "");
  };

  const insertStudent = async (student: Inputs): Promise<Inputs | null> => {
    // const { error: signupError } = await supabase.auth.signUp({ email: student.email, password: student.password });
    // if (signupError) {
    //   toast.error(signupError.message);
    //   return null;
    // } else toast.success("Sign-up successful...");

    const { data, error } = await supabase
      .from('long_course_students')
      .insert([student])
      .single();

    if (error) {
      toast.error(`Error inserting student: ${error.message}`);
      return null;
    } else {
      toast.success("Data successfully submitted");
      reset();
    }
    return data as Inputs;
  };

  const updateStudent = async (student: Inputs): Promise<Inputs | null> => {
    const { data: res, error } = await supabase
      .from('long_course_students')
      .update(student)
      .eq('personnel_id_number', data?.personnel_id_number)
      .single();
    if (error) {
      toast.error(`Error updating student: ${error.message}`);
      return null;
    } else {
      toast.success(`Updated successfully`);
      reset();
      window.location.reload();
    }
    return res as Inputs;
  }

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      toast.loading("Uploading...", { id: '54321' })
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
        toast.success("Image uploaded successfully", { id: '54321' });
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Failed to upload image", { id: '54321' });
      }
    }
  };

  const onSubmit = async (data: any) => {
    const result = await type === 'create' ? insertStudent(data) : updateStudent(data);
  };

  const onError = (error: any) => console.log("error:", error);

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit, onError)}>
      <h1 className="text-xl font-semibold first-letter:uppercase">{type} Long Course Student</h1>

      {/* Existing Fields */}
      <div className="flex flex-wrap gap-4">
        {/* Authentication Information */}
        <InputField label="Email" name="email" defaultValue={data?.email} register={register} error={errors.email} />
        <InputField label="Password" name="password" type="password" defaultValue={data?.password} register={register} error={errors.password} />
        <InputField label="Matric Number" name="matric_number" defaultValue={data?.matric_number} register={register} error={errors.matric_number} />
      </div>

      {/* Personal Information */}
      <div className="flex flex-wrap gap-4">
        <InputField label="First Name" name="first_name" defaultValue={data?.first_name} register={register} error={errors.first_name} />
        <InputField label="Middle Name" name="middle_name" defaultValue={data?.middle_name} register={register} error={errors.middle_name} />
        <InputField label="Last Name" name="last_name" defaultValue={data?.last_name} register={register} error={errors.last_name} />
        <InputField label="Personnel ID Number" name="personnel_id_number" defaultValue={data?.personnel_id_number} register={register} error={errors.personnel_id_number} />
        <InputField label="JAMB Registration Number" name="jamb_reg_number" defaultValue={data?.jamb_reg_number} register={register} error={errors.jamb_reg_number} />
        <InputField label="Rank" name="rank" defaultValue={data?.rank} register={register} error={errors.rank} />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Medical Status</label>
          <select
            {...register("medical_status")}
            className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500"
          >
            <option value="">Select medical status</option>
            <option value="Fit" selected={data?.medical_status === 'Fit'}>Fit</option>
            <option value="Unfit" selected={data?.medical_status === 'Unfit'}>Unfit</option>
          </select>
          {errors.medical_status?.message && (
            <p className="text-xs text-red-400">{errors.medical_status.message}</p>
          )}
        </div>
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
            <option value="male" selected={data?.sex === 'male'}>Male</option>
            <option value="female" selected={data?.sex === 'female'}>Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        {type === 'create' && <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label className="text-xs text-gray-500">Picture</label>
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Select image</span>
          </label>
          <input type="file" id="img" onChange={handleImageChange} className="hidden" />
          {errors.photo_url?.message && (
            <p className="text-xs text-red-400">
              {errors.photo_url.message.toString()}
            </p>
          )}
        </div>}
      </div>

      {/* New Fields */}
      <div className="flex flex-wrap gap-4">
        <InputField label="Religion" name="religion" defaultValue={data?.religion} register={register} error={errors.religion} />
        <InputField label="Blood Group" name="blood_group" defaultValue={data?.blood_group} register={register} error={errors.blood_group} />
        <InputField label="Genotype" name="genotype" defaultValue={data?.genotype} register={register} error={errors.genotype} />
        {/* <InputField label="Marital Status" name="marital_status" defaultValue={data?.marital_status} register={register} error={errors.marital_status} /> */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Marital Status</label>
          <select
            {...register("marital_status")}
            className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500"
          >
            <option value="">Select marital status</option>
            <option value="Single" selected={data?.marital_status === 'Single'}>Single</option>
            <option value="Married" selected={data?.marital_status === 'Married'}>Married</option>
          </select>
          {errors.marital_status?.message && (
            <p className="text-xs text-red-400">{errors.marital_status.message}</p>
          )}
        </div>
        {/* <div>
          <label className="text-xs text-gray-500">Course Length</label>
          <select
            {...register("course_length", {
              onChange: (e) => handleCourseLengthChange(e.target.value as "long" | "short"),
            })}
            className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500"
          >
            <option value="">Choose course length</option>
            <option value="long">Long Course</option>
            <option value="short">Short Course</option>
          </select>
          {errors.course_length?.message && 
            <p className="text-xs text-red-400">{errors.course_length.message as string}</p>
          }
        </div> */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">
            Select Departments
          </label>
          <select
            {...register("department", {
              onChange: (e) => handleDepartmentChange(e.target.value),
            })}
            className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500"
          >
            <option value="">Choose department</option>
            {filteredDepartments?.map((dept) => (
              <option key={dept} value={dept} selected={dept === data?.department}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department?.message && (
            <p className="text-xs text-red-400">{errors.department.message as string}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Select Course</label>
          <select
            {...register("course")}
            className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500"
          >
            <option value="">Choose course</option>
            {filteredCourses?.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          {errors.course?.message && (
            <p className="text-xs text-red-400">{errors.course.message as string}</p>
          )}
        </div>
      </div>

      {/* Nested Objects */}
      <h2>Next of Kin</h2>
      <div className="flex flex-wrap gap-4">
        <InputField label="Name" name="next_of_kin.name" register={register} error={errors.next_of_kin?.name} defaultValue={data?.next_of_kin?.name} />
        <InputField label="Phone" name="next_of_kin.phone" register={register} error={errors.next_of_kin?.phone} defaultValue={data?.next_of_kin?.phone} />
        <InputField label="Address" name="next_of_kin.address" register={register} error={errors.next_of_kin?.address} defaultValue={data?.next_of_kin?.address} />
        <InputField label="Relationship" name="next_of_kin.relationship" register={register} error={errors.next_of_kin?.relationship} defaultValue={data?.next_of_kin?.relationship} />
      </div>

      <h2>Close Associate Within Lagos</h2>
      <div className="flex flex-wrap gap-4">
        <InputField label="Name" name="close_associate_lagos.name" register={register} error={errors.close_associate_lagos?.name} defaultValue={data?.close_associate_lagos?.name} />
        <InputField label="Phone" name="close_associate_lagos.phone" register={register} error={errors.close_associate_lagos?.phone} defaultValue={data?.close_associate_lagos?.phone} />
        <InputField label="Address" name="close_associate_lagos.address" register={register} error={errors.close_associate_lagos?.address} defaultValue={data?.close_associate_lagos?.address} />
      </div>

      <h2>Close Associate Outside Lagos</h2>
      <div className="flex flex-wrap gap-4">
        <InputField label="Name" name="close_associate_outside_lagos.name" register={register} error={errors.close_associate_outside_lagos?.name} defaultValue={data?.close_associate_outside_lagos?.name} />
        <InputField label="Phone" name="close_associate_outside_lagos.phone" register={register} error={errors.close_associate_outside_lagos?.phone} defaultValue={data?.close_associate_outside_lagos?.phone} />
        <InputField label="Address" name="close_associate_outside_lagos.address" register={register} error={errors.close_associate_outside_lagos?.address} defaultValue={data?.close_associate_outside_lagos?.address} />
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default LongCourseStudentForm;
