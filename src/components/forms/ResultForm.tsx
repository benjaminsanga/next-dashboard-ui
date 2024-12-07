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
  first_name: z.string().min(1, { message: "First name is required!" }),
  last_name: z.string().min(1, { message: "Last name is required!" }),
  photo_url: z.string().min(1, { message: "File is required!" }),
  student__id: z.string().min(1, { message: "Student ID is required!" }),
  department: z.string().min(1, { message: "Department is required!" }),
  course: z.string().min(1, { message: "Course is required!" }),
  grade: z.string().min(1, { message: "Grade is required!" }),
  score: z.string().min(1, { message: "Score is required!" }),
});

type Inputs = z.infer<typeof schema>;

const ResultForm = ({
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

  const insertResult = async (student_results: Inputs): Promise<Inputs | null> => {
    const { data, error } = await supabase
      .from('student_results')
      .insert([student_results])
      .single();
  
    if (error) {
      console.error("Error inserting student_results:", error.message);
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
    const result = await insertResult(data);
    toast.success("Data successfully submitted")
    reset()
  };

  const onError = (error: any) => console.log("error:", error)

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit, onError)}>
      <h1 className="text-xl font-semibold">Create a new result</h1>
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
          label="Score"
          name="score"
          defaultValue={data?.score}
          register={register}
          error={errors.score}
          type="text"
        />
        <InputField
          label="Grade"
          name="grade"
          defaultValue={data?.grade}
          register={register}
          error={errors.grade}
          type="text"
        />
        <InputField
          label="Student ID"
          name="student__id"
          type="text"
          defaultValue={data?.student__id}
          register={register}
          error={errors?.student__id}
        />
        
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">
            Select Departments
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            {...register("department")}
          >
            <option>Choose department</option>
            {departmentOptions?.map((department, idx) => (
              <option key={idx} value={department}>
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
            {courseOptions?.map((course, idx) => (
              <option key={idx} value={course}>
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
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;
