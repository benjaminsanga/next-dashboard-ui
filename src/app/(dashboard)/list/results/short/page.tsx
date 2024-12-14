"use client";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import PDFDocument from "@/components/PDFComponent";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { supabase } from "@/lib/supabase";
import { Result } from "@/types/admin";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LoaderIcon } from "react-hot-toast";

const columns = [
  {
    header: "Subjects Count",
    accessor: "name",
  },
  {
    header: "Student",
    accessor: "student",
  },
  {
    header: "Student ID",
    accessor: "student_id",
    className: "hidden md:table-cell",
  },
  {
    header: "Avg. Score",
    accessor: "score",
    className: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ResultListPage = () => {
  const [view, setView] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [uniqueStudents, setUniqueStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // PDF modal state
  const [course, setCourse] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [quarter, setQuarter] = useState("");
  const [totalGrade, setTotalGrade] = useState("");
  const [grades, setGrades] = useState<{ title: string; grade: string; score: string }[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    studentId: "",
    department: "",
    year: "",
  });
  
  useEffect(() => {
    const value = Object.values(
      results.reduce((acc: Record<string, any>, item) => {
        const studentId = item.student__id;
        if (!acc[studentId]) {
          acc[studentId] = {
            courses_count: 0,
            first_name: item.first_name,
            last_name: item.last_name,
            student__id: item.student__id,
            score: 0,
            created_at: item.created_at,
            department: item.department,
            year: item.year,
            quarter: item.quarter,
            total_score: 0,
            course: item.course,
          };
        }
        acc[studentId].courses_count += 1;
        acc[studentId].total_score += item.score;

        // Preserve existing department if already set
        if (!acc[studentId].department && item.department) {
          acc[studentId].department = item.department;
        }

        acc[studentId].year = !!item.year ? item.year : acc[studentId].year;
        acc[studentId].quarter = !!item.quarter ? item.quarter : acc[studentId].quarter;
        acc[studentId].score = acc[studentId].total_score / acc[studentId].courses_count;
        return acc;
      }, {} as Record<string, any>)
    );
    setUniqueStudents(value);
  }, [results]);


  useEffect(() => {
    const fetchAllResults = async (): Promise<Result[]> => {
      const { data, error } = await supabase.from("short_course_results").select("*");

      if (error) {
        console.error("Error fetching students:", error.message);
        return [];
      }
      return data as Result[];
    };

    const loadResults = async () => {
      const result = await fetchAllResults();
      setResults(result);
    };

    loadResults();
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredStudents = uniqueStudents.filter(
    (student) =>
      student.first_name?.toLowerCase()?.includes(searchQuery) ||
      student.last_name?.toLowerCase()?.includes(searchQuery) ||
      student.student__id?.toLowerCase()?.includes(searchQuery)
  );

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

  const applyFilters = () => {
    const { studentId, department, year } = filters;
  
    const filtered = uniqueStudents.filter((student) => {
      const matchesStudentId = studentId ? student.student__id.includes(studentId) : true;
      const matchesDepartment = department ? student.department.includes(department) : true;
      const matchesYear = year ? student.year?.toString() === year.toString() : true;
  
      return matchesStudentId && matchesDepartment && matchesYear;
    });
  
    setUniqueStudents(filtered);
  };
  

  const renderRow = (item: any) => (
    <tr
      key={item.student__id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.courses_count}</td>
      <td>
        {item.first_name} {item.last_name}
      </td>
      <td className="hidden md:table-cell">{item.student__id}</td>
      <td className="hidden md:table-cell">{parseFloat(item.score).toFixed(2)}</td>
      <td className="hidden md:table-cell">{new Date(item.created_at).toDateString()}</td>
      <td>
        <div className="flex items-center gap-2">
          <button
            className="text-sm p-2"
            onClick={() => {
              setCourse(item.course);
              setName(`${item.first_name} ${item.last_name}`);
              setDate(new Date(item.created_at).toDateString());
              setDepartment(item.department);
              setYear(item.year);
              setQuarter(item.quarter);
              setStudentId(item.student__id);
              setTotalGrade(calculateGrade(item.total_score / item.courses_count));
              setGrades(
                results
                  .filter((i) => i.student__id === item.student__id)
                  .map((entry) => ({
                    grade: entry.grade,
                    score: entry.score,
                    title: entry.course.toUpperCase(),
                  }))
              );
              setView(true);
            }}
          >
            View
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    filteredStudents.length === 0 ? (
      <div className="w-full h-20 flex justify-center items-center">
        <LoaderIcon />
      </div>
    ) : (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">All Short Course Results</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch onChange={handleSearchChange} />
            <div className="flex items-center gap-4 self-end">
              {/* Filter Button */}
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
                onClick={() => setFilterModalOpen(true)}
              >
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              
              {/* Sort Button */}
              {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button> */}
              
              {/* Create Modal */}
              <FormModal table="shortResult" type="create" />

              {/* Filter Modal */}
              {filterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-semibold mb-4">Apply Filters</h2>
                    
                    {/* Filter Fields */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-medium">Student ID</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={filters.studentId}
                          onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
                          placeholder="Enter Student ID"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Department</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={filters.department}
                          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                          placeholder="Enter Department"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Year</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={filters.year}
                          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                          placeholder="Enter Year"
                        />
                      </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex items-center justify-end mt-4 gap-4">
                      <button
                        className="px-4 py-2 text-sm bg-gray-300 rounded"
                        onClick={() => setFilterModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 text-sm bg-lamaYellow rounded"
                        onClick={() => {
                          applyFilters();
                          setFilterModalOpen(false);
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
        {/* LIST */}
        <Table columns={columns} renderRow={renderRow} data={filteredStudents} />
        {/* PAGINATION */}
        <Pagination />
        <button
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
          onClick={() => {
            setFilters({ studentId: "", department: "", year: "" });
            setUniqueStudents(uniqueStudents);
          }}
        >
          Clear Filters
        </button>
        {view && (
          <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-md relative w-fit h-[95%] overflow-auto">
              <div
                className="absolute top-4 right-4 cursor-pointer"
                onClick={() => {
                  setGrades([]);
                  setView(false);
                }}
              >
                <Image src="/close.png" alt="" width={14} height={14} />
              </div>
              <div>
                <PDFDownloadLink
                  document={
                    <PDFDocument
                      results={grades}
                      name={name}
                      date={date}
                      course={course}
                      department={department}
                      studentId={studentId}
                      totalGrade={totalGrade}
                      year={year}
                      quarter={quarter}
                      academic_session={null}
                      semester={null}
                    />
                  }
                  fileName="result-sheet.pdf"
                  className="text-xs mt-5"
                >
                  Download Result Sheet
                </PDFDownloadLink>
                <PDFDocument
                  results={grades}
                  name={name}
                  date={date}
                  course={course}
                  department={department}
                  studentId={studentId}
                  totalGrade={totalGrade}
                  year={year}
                  quarter={quarter}
                  academic_session={null}
                  semester={null}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default ResultListPage;
