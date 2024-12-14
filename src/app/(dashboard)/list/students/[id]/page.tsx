"use client"
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import Performance from "@/components/Performance";
import { supabase } from "@/lib/supabase";
import { ShortCourseStudent } from "@/types/admin";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { LoaderIcon } from "react-hot-toast";

const SingleStudentPage = () => {
  const {id} = useParams()

  const [student, setStudent] = useState<ShortCourseStudent>()

  useEffect(() => {
    const fetchStudentById = async (id: string): Promise<ShortCourseStudent | null> => {
      const { data, error } = await supabase
        .from('short_course_students')
        .select('*')
        .eq('id', id)
        .single();
    
      if (error) {
        console.error("Error fetching student:", error.message);
        return null;
      }
      return data as ShortCourseStudent;
    };

    const loadStudent = async () => {
        const result = await fetchStudentById(id as string);
        setStudent(result as ShortCourseStudent);
    };

    loadStudent();
  }, [id]);

  return (
    !student ? <LoaderIcon/> : <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={student?.photo_url || ""}
                alt="Student"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">
                {student?.first_name} {student?.middle_name} {student?.last_name}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date(student?.created_at || "").toDateString()}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span className="capitalize">{student?.sex}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{new Date(student?.dob || "").toDateString()}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{student?.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{student?.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex flex-col gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <span className="text-sm text-gray-400">Department</span>
                <h1 className="text-xl font-semibold">{student?.department}</h1>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <span className="text-sm text-gray-400">Course</span>
                <h1 className="text-xl font-semibold">{student?.course}</h1>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 m-h-[600px] text-sm text-gray-500">
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex flex-col mb-2">
            <span><strong>Personnel Id Number</strong>: {student?.personnel_id_number}</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex flex-col mb-2">
            <span><strong>Rank</strong>: {student?.rank}</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex flex-col mb-2">
            <span><strong>Genotype</strong>: {student?.genotype}</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex flex-col mb-2">
            <span><strong>Student ID</strong>: {student?.student_id}</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex flex-col mb-2">
            <span><strong>Blood Group</strong>: {student?.blood_group}</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex flex-col mb-2">
            <span><strong>Marital Status</strong>: {student?.marital_status}</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex flex-col mb-2">
            <span><strong>Address</strong>: {student?.address}</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex flex-col mb-2">
            <span><strong>Religion</strong>: {student?.religion}</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex flex-col mb-2">
            <span><strong>Medical Status</strong>: {student?.medical_status}</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex flex-col gap-1 my-3">
            <strong>Next of Kin</strong>
            <span><strong>Name:</strong> {student?.next_of_kin.name}</span>
            <span><strong>Address:</strong> {student?.next_of_kin.address}</span>
            <span><strong>Phone:</strong> {student?.next_of_kin.phone}</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex flex-col gap-1 my-3">
            <strong>Close Associate in Lagos</strong>
            <span><strong>Name:</strong> {student?.close_associate_lagos.name}</span>
            <span><strong>Address:</strong> {student?.close_associate_lagos.address}</span>
            <span><strong>Phone:</strong> {student?.close_associate_lagos.phone}</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex flex-col gap-1 my-3">
            <strong>Close Associate outside Lagos</strong>
            <span><strong>Name:</strong> {student?.close_associate_outside_lagos.name}</span>
            <span><strong>Address:</strong> {student?.close_associate_outside_lagos.address}</span>
            <span><strong>Phone:</strong> {student?.close_associate_outside_lagos.phone}</span>
          </div>
        </div>
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/students">
              Students
            </Link>
          </div>
        </div>
        {/* <Performance />
        <Announcements /> */}
      </div>
    </div>
  );
};

export default SingleStudentPage;
