"use client"
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import PDFDocument from "@/components/PDFComponent";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import {
  resultsData,
  role,
} from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { Result } from "@/types/admin";
import Image from "next/image";
import { useEffect, useState } from "react";

const columns = [
  {
    header: "Course Name",
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
    header: "Score",
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
  const [results, setResults] = useState<Result[]>([])
  const [course, setCourse] = useState("")
  const [name, setName] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    const fetchAllResults = async (): Promise<Result[]> => {
        const { data, error } = await supabase
            .from('student_results')
            .select('*');
        
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

  console.log("results:", results)
  
  const renderRow = (item: Result) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.course}</td>
      <td>{item.first_name} {item.last_name}</td>
      <td className="hidden md:table-cell">{item.student__id}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      {/* <td className="hidden md:table-cell">{item.course}</td> */}
      <td className="hidden md:table-cell">{new Date(item.created_at).toDateString()}</td>
      <td>
        <div className="flex items-center gap-2">
          <button className="text-sm p-2" onClick={() => {
            setCourse(item.course)
            setName(`${item.first_name} ${item.last_name}`)
            setDate(new Date(item.created_at).toDateString())
            setView(true)
          }}>View</button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            <FormModal table="result" type="create" />
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={results} />
      {/* PAGINATION */}
      <Pagination />
      {view && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-fit">
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setView(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
            <div>
              <PDFDocument
                course={course}
                name={name}
                date={date}
                institution={"Nigerian Army School of Finance and Administration"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultListPage;
