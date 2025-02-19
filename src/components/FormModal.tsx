"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// USE LAZY LOADING

// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ShortCourseStudentForm = dynamic(() => import("./forms/ShortCourseStudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LongCourseStudentForm = dynamic(() => import("./forms/LongCourseStudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ShortCourseResultForm = dynamic(() => import("./forms/ShortCourseResultForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LongCourseResultForm = dynamic(() => import("./forms/LongCourseResultForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  shortCourseStudent: (type, data) => <ShortCourseStudentForm type={type} data={data} />,
  longCourseStudent: (type, data) => <LongCourseStudentForm type={type} data={data} />,
  shortResult: (type, data) => <ShortCourseResultForm type={type} data={data} />,
  longResult: (type, data) => <LongCourseResultForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
  deleteStudent,
}: {
  table:
    | "teacher"
    | "shortCourseStudent"
    | "longCourseStudent"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "shortResult"
    | "attendance"
    | "event"
    | "announcement"
    | "longResult";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
  deleteStudent?: (id: number) => Promise<void>;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    return type === "delete" && id ? (
      <form action="" className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          Data will be lost. Are you sure you want to delete this student record?
        </span>
        <button 
          className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
          onClick={(event) => {
            event.preventDefault();
            if ((table === 'shortCourseStudent' || table === 'longCourseStudent') && deleteStudent) {
              deleteStudent(id);
              setOpen(false);
            }
          }}
        >Delete</button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data)
    ) : (
      <span>Form not found!</span>
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90%] overflow-y-auto">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
