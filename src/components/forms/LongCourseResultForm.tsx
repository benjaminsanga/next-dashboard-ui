"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const schema = z.object({
  matric_number: z.string().min(1, { message: "Matric Number is required!" }),
  first_name: z.string().min(1, { message: "First name is required!" }),
  last_name: z.string().min(1, { message: "Last name is required!" }),
  department: z.string().min(1, { message: "Department is required!" }),
  course: z.string().min(1, { message: "Course is required!" }),
  academic_session: z.string().min(1, { message: "Academic Session is required!" }),
  semester: z.string().min(1, { message: "Semester is required!" }),
  courses: z
    .array(
      z.object({
        course_code: z.string().min(1, { message: "Course code is required!" }),
        credit_unit: z
          .string()
          .transform((value) => parseInt(value))
          .refine((value) => !isNaN(value), { message: "Credit Unit must be a number!" }),
        score: z
          .string()
          .transform((value) => parseFloat(value))
          .refine((value) => !isNaN(value) && value >= 0 && value <= 100, {
            message: "Score must be between 0 and 100!",
          }),
        grade: z.string().min(1, { message: "Grade is required!" }),
      })
    )
    .min(1, { message: "At least one course is required!" }),
});

type Inputs = z.infer<typeof schema>;

const LongCourseResultForm = ({
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
    setValue,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      courses: [{ course_code: "", credit_unit: 0, score: 0, grade: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "courses",
  });

  const studentId = watch("matric_number");

  const calculateGrade = (score: number): string => {
    if (score >= 80) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 40) return "D";
    return "F";
  };

  const calculateGPA = (courses: Inputs["courses"]): number => {
    let totalGradePoints = 0;
    let totalCreditUnits = 0;

    courses.forEach(({ grade, credit_unit }) => {
      const gradePoint = grade === "A" ? 4 : grade === "B" ? 3 : grade === "C" ? 2 : grade === "D" ? 1 : 0;
      totalGradePoints += gradePoint * credit_unit;
      totalCreditUnits += credit_unit;
    });

    return totalCreditUnits > 0 ? totalGradePoints / totalCreditUnits : 0;
  };

  const handleGetStudentInfo = async () => {
    toast.loading("Fetching student data...", { id: "fetch" });

    try {
      const { data, error } = await supabase
        .from("long_course_students")
        .select("*")
        .eq("matric_number", studentId)
        .single();

      if (error) throw new Error("Student not found");

      setValue("first_name", data.first_name || "");
      setValue("last_name", data.last_name || "");
      setValue("department", data.department || "");
      setValue("course", data.course || "");

      toast.success("Student data loaded", { id: "fetch" });
    } catch (err) {
      toast.error("Failed to fetch student data", { id: "fetch" });
    }
  };

  const onSubmit = async (formData: Inputs) => {
    toast.loading("Submitting data...", { id: "submission" });
    const { personnel_number } = JSON.parse(localStorage.getItem("nasfa-dbms-admin") || '{}')

    try {
      // Calculate GPA
      const gpa = calculateGPA(formData.courses);

      // Prepare data for insertion
      const coursesData = formData.courses.map((course) => ({
        matric_number: formData.matric_number,
        first_name: formData.first_name,
        last_name: formData.last_name,
        department: formData.department,
        academic_session: formData.academic_session,
        semester: formData.semester,
        course_code: course.course_code,
        course: formData.course,
        credit_unit: course.credit_unit,
        score: course.score,
        grade: calculateGrade(course.score),
        created_by: personnel_number,
      }));

      // Insert into Supabase
      const { error } = await supabase.from("long_course_results").insert(coursesData);

      if (error) throw new Error(error.message);

      toast.success(`Data submitted successfully! GPA: ${gpa.toFixed(2)}`, { id: "submission" });
      reset();
    } catch (err) {
      toast.error("Failed to submit data", { id: "submission" });
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create Result" : "Update Result"}</h1>
      <div className="flex flex-wrap gap-4">
        <div className="w-full">
          <InputField label="Matric Number" name="matric_number" register={register} error={errors.matric_number} />
          <button
            type="button"
            onClick={handleGetStudentInfo}
            disabled={!studentId}
            className="text-xs border rounded-sm bg-gray-200 px-3 py-1 my-2"
          >
            Find Student
          </button>
        </div>
        <InputField label="First Name" name="first_name" register={register} error={errors.first_name} disabled />
        <InputField label="Last Name" name="last_name" register={register} error={errors.last_name} disabled />
        <InputField label="Department" name="department" register={register} error={errors.department} disabled />
        <InputField label="Course" name="course" register={register} error={errors.course} disabled />
        <InputField label="Academic Session" name="academic_session" register={register} error={errors.academic_session} />
        <InputField label="Semester" name="semester" register={register} error={errors.semester} />

        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start">
            <InputField label="Subject" name={`courses.${index}.course_code`} register={register} error={errors.courses?.[index]?.course_code} />
            <InputField label="Credit Unit" name={`courses.${index}.credit_unit`} register={register} error={errors.courses?.[index]?.credit_unit} />
            <InputField
              label="Score"
              name={`courses.${index}.score`}
              register={register}
              error={errors.courses?.[index]?.score}
              inputProps={{
                onChange: (e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    setValue(`courses.${index}.grade`, calculateGrade(value));
                  }
                },
              }}
            />
            <InputField label="Grade" name={`courses.${index}.grade`} register={register} disabled />
            <button type="button" onClick={() => remove(index)} className="text-red-500">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ course_code: "", credit_unit: 0, score: 0, grade: "" })} className="text-blue-500">
          Add Subject
        </button>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">{type === "create" ? "Submit" : "Update"}</button>
    </form>
  );
};

export default LongCourseResultForm;
