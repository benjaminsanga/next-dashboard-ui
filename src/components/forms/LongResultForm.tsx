"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useEffect } from "react";

const schema = z.object({
  student__id: z.string().min(1, { message: "Student ID is required!" }),
  first_name: z.string().min(1, { message: "First name is required!" }),
  last_name: z.string().min(1, { message: "Last name is required!" }),
  department: z.string().min(1, { message: "Department is required!" }),
  acedemic_session: z.string().min(1, { message: "Acedemic Session is required!" }),
  semester: z.string().min(1, { message: "Semester is required!" }),
  courses: z
    .array(
      z.object({
        course_code: z.string().min(1, { message: "Subject is required!" }),
        score: z
          .string()
          .min(1, { message: "Score is required!" })
          .transform((value) => parseFloat(value))
          .refine((value) => !isNaN(value), {
            message: "Score must be a number!",
          })
          .refine((value) => value >= 0 && value <= 100, {
            message: "Score must be between 0 and 100!",
          }),
        grade: z.string().min(1, { message: "Grade is required!" }),
        credit_unit: z.string().min(1, { message: "Credit Unit is required!" }),
      })
    )
    .min(1, { message: "At least one course is required!" }),
});

type Inputs = z.infer<typeof schema>;

const LongResultForm = ({
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
    control,
    formState: { errors },
    setValue,
    reset,
    getValues
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      courses: [{ course_code: "", score: 0, grade: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "courses",
  });

  const studentId = watch("student__id");

  const calculateGrade = (score: number): string => {
    if (score >= 80 && score <= 100) return "A";
    if (score >= 60 && score < 79) return "B";
    if (score >= 50 && score < 59) return "C";
    if (score >= 40 && score < 49) return "D";
    if (score >= 0 && score < 39) return "F";
    return "Invalid Score";
  };

  const handleGetStudentInfo = async () => {
    toast.loading("Fetching student data", { id: "54321" });
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("student_id", studentId)
        .single();

      if (error) {
        toast.error("Student ID not found", { id: "54321" });
        throw new Error("Student ID not found");
      }

      setValue("first_name", data.first_name || "");
      setValue("last_name", data.last_name || "");
      setValue("department", data.department || "");

      toast.success("Fetched student data", { id: "54321" });
    } catch (err) {
      console.error("Failed to fetch student details:", err);
    }
  };

  const onSubmit = async (data: Inputs) => {
    toast.loading("Submitting data...", { id: "submission" });
  
    try {
      // Check if the student exists
      
  
      // Prepare the courses data
      const coursesData = data.courses.map((course) => ({
        student__id: studentId,
        course: course.course_code,
        score: course.score,
        grade: course.grade,
        first_name: getValues("first_name"),
        last_name: getValues("last_name"),
      }));
  
      // Insert courses into the student_results table
      const { error: coursesInsertError } = await supabase
        .from("student_results")
        .insert(coursesData);
  
      if (coursesInsertError) {
        throw new Error(coursesInsertError.message);
      }
  
      toast.success("Data successfully submitted!", { id: "submission" });
      reset(); // Reset the form after successful submission
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit data. Please try again.", { id: "submission" });
    }
  };  

  const onError = (error: any) => console.error("Form error:", error);

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new result" : "Update result"}
      </h1>
      <div className="flex flex-wrap gap-4">
        <div className="w-full">
          <InputField
            label="Student ID"
            name="student__id"
            type="text"
            register={register}
            error={errors?.student__id}
          />
          <button
            className="text-xs border rounded-sm bg-gray-200 px-3 py-1 my-2"
            type="button"
            onClick={handleGetStudentInfo}
            disabled={!studentId}
          >
            Find
          </button>
        </div>
        <InputField
          label="First Name"
          name="first_name"
          register={register}
          error={errors.first_name}
          disabled
        />
        <InputField
          label="Last Name"
          name="last_name"
          register={register}
          error={errors.last_name}
          disabled
        />
        <InputField
          label="Department"
          name="department"
          register={register}
          error={errors.department}
          disabled
        />
        <InputField
          label="Academic Session"
          name={`academic_session`}
          register={register}
          error={errors.acedemic_session}
        />
        <InputField
          label="Semester"
          name={`semester`}
          register={register}
          error={errors.semester}
        />
        {fields.map((field, index) => (
          <div key={field.id} className="w-full flex gap-2">
            <InputField
              label="Subject"
              name={`courses.${index}.course_code`}
              register={register}
              error={errors.courses?.[index]?.course_code}
            />
            <InputField
              label="Credit Unit"
              name={`credit_unit`}
              register={register}
              error={errors.courses?.[index]?.credit_unit}
            />
            <InputField
              label="Score"
              name={`courses.${index}.score`}
              type="number"
              register={register}
              error={errors.courses?.[index]?.score}
              inputProps={{
                onChange: (e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    const grade = calculateGrade(value); // Function to calculate grade
                    setValue(`courses.${index}.grade`, grade); // Dynamically set the grade
                  }
                },
              }}
            />
            <InputField
              label="Grade"
              name={`courses.${index}.grade`}
              register={register}
              error={errors.courses?.[index]?.grade}
              disabled
            />

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ course_code: "", score: 0, grade: "", credit_unit: "" })}
          className="text-blue-500 text-sm"
        >
          Add Subject
        </button>
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default LongResultForm;
