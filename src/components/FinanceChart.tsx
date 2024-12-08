"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    students: 4000,
    instructors: 240,
  },
  {
    name: "Feb",
    students: 3000,
    instructors: 198,
  },
  {
    name: "Mar",
    students: 2000,
    instructors: 980,
  },
  {
    name: "Apr",
    students: 2780,
    instructors: 308,
  },
  {
    name: "May",
    students: 1890,
    instructors: 400,
  },
  {
    name: "Jun",
    students: 2390,
    instructors: 300,
  },
  {
    name: "Jul",
    students: 3490,
    instructors: 300,
  },
  {
    name: "Aug",
    students: 3490,
    instructors: 300,
  },
  {
    name: "Sep",
    students: 3490,
    instructors: 400,
  },
  {
    name: "Oct",
    students: 3490,
    instructors: 300,
  },
  {
    name: "Nov",
    students: 3490,
    instructors: 400,
  },
  {
    name: "Dec",
    students: 3490,
    instructors: 400,
  },
];

const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Chart</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false}  tickMargin={20}/>
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="students"
            stroke="#C3EBFA"
            strokeWidth={5}
          />
          <Line type="monotone" dataKey="instructors" stroke="#CFCEFF" strokeWidth={5}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
