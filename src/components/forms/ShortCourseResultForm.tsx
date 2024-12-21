"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const schema = z.object({
  student__id: z.string().min(1, { message: "Student ID is required!" }),
  first_name: z.string().min(1, { message: "First name is required!" }),
  middle_name: z.string().nullable(),
  last_name: z.string().min(1, { message: "Last name is required!" }),
  department: z.string().min(1, { message: "Department is required!" }),
  course: z.string().min(1, { message: "Course is required!" }),
  year: z.string().min(1, { message: "Year is required!" }),
  quarter: z.string().min(1, { message: "Quarter is required!" }),
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
      })
    )
    .min(1, { message: "At least one course is required!" }),
});

type Inputs = z.infer<typeof schema>;

const ShortCourseResultForm = ({
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
    if (score >= 85 && score <= 100) return "A";
    if (score >= 75 && score < 85) return "B+";
    if (score >= 70 && score < 75) return "B";
    if (score >= 65 && score < 70) return "C+";
    if (score >= 60 && score < 65) return "HC";
    if (score >= 55 && score < 60) return "C";
    if (score >= 50 && score < 55) return "LC";
    if (score >= 40 && score < 50) return "C-";
    if (score >= 0 && score < 40) return "F";
    return "Invalid Score";
};

  const handleGetStudentInfo = async () => {
    toast.loading("Fetching student data", { id: "54321" });
    try {
      const { data, error } = await supabase
        .from("short_course_students")
        .select("*")
        .eq("student_id", studentId)
        .single();

      if (error) {
        toast.error("Student ID not found", { id: "54321" });
        throw new Error("Student ID not found");
      }

      setValue("first_name", data.first_name || "");
      setValue("middle_name", data.middle_name || "");
      setValue("last_name", data.last_name || "");
      setValue("department", data.department || "");
      setValue("course", data.course || "");

      toast.success("Fetched student data", { id: "54321" });
    } catch (err) {
      console.error("Failed to fetch student details:", err);
    }
  };

  const onSubmit = async (data: Inputs) => {
    toast.loading("Submitting data...", { id: "submission" });
  
    try {
      // Check if the student exists
      const { personnel_number } = JSON.parse(localStorage.getItem("nasfa-dbms-admin") || '{}')
  
      // Prepare the courses data
      const coursesData = data.courses.map((course) => ({
        student__id: studentId,
        course: course.course_code,
        score: course.score,
        grade: course.grade,
        first_name: getValues("first_name"),
        middle_name: getValues("middle_name"),
        last_name: getValues("last_name"),
        year: getValues("year"),
        quarter: getValues("quarter"),
        created_by: personnel_number,
      }));
  
      // Insert courses into the student_results table
      const { error: coursesInsertError } = await supabase
        .from("short_course_results")
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
        {type === "create" ? "Create a new short course result" : "Update result"}
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
          label="Middle Name"
          name="middle_name"
          register={register}
          error={errors.middle_name}
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
          label="Course"
          name="course"
          register={register}
          error={errors.course}
          disabled
        />
        <InputField
          label="Year"
          name={`year`}
          register={register}
          error={errors.year}
        />
        {/* <InputField
          label="Quarter"
          name={`quarter`}
          register={register}
          error={errors.quarter}
        /> */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Quarter</label>
          <select
            {...register("quarter")}
            className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500"
          >
            <option value="">Select Quarter</option>
            <option value="First">First</option>
            <option value="Second">Second</option>
            <option value="Third">Third</option>
            <option value="Fourth">Fourth</option>
          </select>
          {errors.quarter?.message && (
            <p className="text-xs text-red-400">{errors.quarter.message}</p>
          )}
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="w-full flex gap-2">
            <InputField
              label="Subject"
              name={`courses.${index}.course_code`}
              register={register}
              error={errors.courses?.[index]?.course_code}
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
          onClick={() => append({ course_code: "", score: 0, grade: "" })}
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

export default ShortCourseResultForm;
