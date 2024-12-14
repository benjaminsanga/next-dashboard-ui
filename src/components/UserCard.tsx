"use client"
import { supabase } from "@/lib/supabase";
import { Instructor, StudentArgs } from "@/types/admin";
import Image from "next/image";
import { useEffect, useState } from "react";

const UserCard = ({ type }: { type: string }) => {
  const [students, setStudents] = useState<StudentArgs[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])

  useEffect(() => {
    const fetchAllInstructors = async (): Promise<Instructor[]> => {
      const { data, error } = await supabase
        .from('instructors')
        .select('*');
    
      if (error) {
        console.error("Error fetching instructors:", error.message);
        return [];
      }
      return data as Instructor[];
    };

    const loadInstructors = async () => {
        const result = await fetchAllInstructors();
        setInstructors(result);
    };

    loadInstructors();
  }, []);

  useEffect(() => {
    const fetchAllStudents = async (): Promise<StudentArgs[]> => {
        const { data, error } = await supabase
            .from('short_course_students')
            .select('*');
        
        if (error) {
            console.error("Error fetching students:", error.message);
            return [];
        }
        return data as StudentArgs[];
    };

    const loadStudents = async () => {
        const students = await fetchAllStudents();
        setStudents(students);
    };

    loadStudents();
  }, []);

  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{type === 'student' ? students.length : instructors.length}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
    </div>
  );
};

export default UserCard;
