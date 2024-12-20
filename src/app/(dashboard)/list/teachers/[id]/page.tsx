"use client"
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import { role } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { Instructor } from "@/types/admin";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderIcon } from "react-hot-toast";

const SingleTeacherPage = () => {
  const {id} = useParams()

  const [instructor, setInstructor] = useState<Instructor>()

  useEffect(() => {
    const fetchInstructorById = async (id: string): Promise<Instructor | null> => {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', id)
        .single();
    
      if (error) {
        console.error("Error fetching instructor:", error.message);
        return null;
      }
      return data as Instructor;
    };

    const loadInstructor = async () => {
        const result = await fetchInstructorById(id as string);
        setInstructor(result as Instructor);
    };

    loadInstructor();
  }, [id]);
  
  return (
    !instructor ? <LoaderIcon/> : <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={instructor?.photo_url || ""}
                alt="Instructor"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">{instructor?.first_name} {instructor?.last_name}</h1>
                {role === "admin" && <FormModal
                  table="teacher"
                  type="update"
                  data={{
                    id: 1,
                    username: "deanguerrero",
                    email: "deanguerrero@gmail.com",
                    password: "password",
                    firstName: "Dean",
                    lastName: "Guerrero",
                    phone: "+1 234 567 89",
                    address: "1234 Main St, Anytown, USA",
                    bloodType: "A+",
                    dateOfBirth: "2000-01-01",
                    sex: "male",
                    img: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200",
                  }}
                />}
              </div>
              <p className="text-sm text-gray-500">
                {instructor?.instructor_id}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{instructor?.sex}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{(new Date(instructor?.dob || '')).toDateString()}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{instructor?.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{instructor?.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex flex-col gap-0 justify-between flex-wrap">
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
                <h1 className="text-xl font-semibold">{instructor?.departments.length}</h1>
                <span className="text-sm text-gray-400">Departments</span>
                <ol>
                  {instructor?.departments?.map((item, idx) => (
                    <li key={idx} className="text-[12px] text-gray-500">{item}</li>
                  ))}
                </ol>
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
                <h1 className="text-xl font-semibold">{instructor?.courses.length}</h1>
                <span className="text-sm text-gray-400">Courses</span>
                <ol>
                  {instructor?.courses?.map((item, idx) => (
                    <li key={idx} className="text-[12px] text-gray-500">{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Instructor&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/teachers">
              Instructors
            </Link>
          </div>
        </div>
        {/* <Performance />
        <Announcements /> */}
      </div>
    </div>
  );
};

export default SingleTeacherPage;
