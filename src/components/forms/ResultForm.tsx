"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useEffect } from "react";

const schema = z.object({
  first_name: z.string().min(1, { message: "First name is required!" }),
  last_name: z.string().min(1, { message: "Last name is required!" }),
  photo_url: z.string().min(1, { message: "File is required!" }),
  student__id: z.string().min(1, { message: "Student ID is required!" }),
  department: z.string().min(1, { message: "Department is required!" }),
  course: z.string().min(1, { message: "Course is required!" }),
  grade: z.string().min(1, { message: "Grade is required!" }),
  course_code: z.string().min(1, { message: "Course Code is required!" }),
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
    watch,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const studentId = watch("student__id");
  const score = watch("score");

  useEffect(() => {
    if (!+score) return;
    if (score) {
      let grade = "";

      // Define a simple grading scale
      if (+score >= 90) {
        grade = "A";
      } else if (+score >= 80) {
        grade = "B";
      } else if (+score >= 70) {
        grade = "C";
      } else if (+score >= 60) {
        grade = "D";
      } else if (+score >= 50) {
        grade = "E";
      } else {
        grade = "F";
      }

      // Set the grade based on the score
      setValue("grade", grade);
    } else {
      setValue("grade", "");
    }
  }, [score, setValue]);

  
  
  const handleGetStudentInfo = async () => {
    toast.loading("Fetching student data", { id: '54321' })
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("student_id", studentId)
        .single();

      if (error) {
        toast.error("Student ID not found", { id: '54321' })
        throw new Error("Student ID not found")
      };
      
      // Populate form with fetched data
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof Inputs, value as string);
      });

      toast.success("Fetched student data", { id: '54321' })
    } catch (err) {
      console.error("Failed to fetch student details:", err);
    }
  }

  const onSubmit = async (data: Inputs) => {
    try {
      const { data: resultData, error } = await supabase
        .from("student_results")
        .insert([data])
        .single();

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Data successfully submitted");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit data");
    }
  };

  const onError = (error: any) => console.error("Form error:", error);

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit, onError)}>
      <h1 className="text-xl font-semibold">Create a new result</h1>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="w-full">
          <InputField
            label="Student ID"
            name="student__id"
            type="text"
            defaultValue={data?.student__id}
            register={register}
            error={errors?.student__id}
          />
          <button 
            className="text-xs border rounded-sm bg-gray-200 px-3 py-1 my-2"
            type="button"
            onClick={handleGetStudentInfo}
            disabled={!studentId}
          >Find</button>
        </div>
        <InputField
          label="First Name"
          name="first_name"
          defaultValue={data?.first_name}
          register={register}
          error={errors.first_name}
          disabled
        />
        <InputField
          label="Last Name"
          name="last_name"
          defaultValue={data?.last_name}
          register={register}
          error={errors.last_name}
          disabled
        />
        <InputField
          label="Department"
          name="department"
          register={register}
          error={errors.department}
          type="text"
          disabled
        />
        <InputField
          label="Course"
          name="course"
          defaultValue={data?.course}
          register={register}
          error={errors.course}
          type="text"
          disabled
        />
        <InputField
          label="Course Code"
          name="course_code"
          defaultValue={data?.course_code}
          register={register}
          error={errors.course_code}
          type="text"
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
          disabled
        />

      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;
