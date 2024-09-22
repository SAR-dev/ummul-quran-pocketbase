import { useEffect, useMemo, useState } from "react";
import { usePocket } from "../contexts/PocketContext";
import { Link } from "react-router-dom";
import { ClassLogsResponse } from "../types/pocketbase";
import { TexpandStudentWithPackage } from "../types/extend";
import { constants } from "../stores/constantStore";
import NavLayout from "../layouts/NavLayout";
import EventCalendar from "../packages/EventCalendar/EventCalendar";
import { CalendarDataType } from "../packages/EventCalendar/types/types";
import { TodayClassList } from "../components/TodayClassList";

export const HomePage = () => {
  const { refresh, logout, user, teacher, students, getClassLogsData } = usePocket();
  const [classLogs, setClassLogs] = useState<ClassLogsResponse<TexpandStudentWithPackage>[]>([])
  const [year, setYear] = useState(2024)
  const [month, setMonth] = useState((new Date()).getMonth() + 1)

  useEffect(() => {
    if (!user) return;

    const cd = new Date(year, month - 1, 1);
    const nd = new Date(new Date(year, month - 1, 1).setMonth(new Date(year, month - 1, 1).getMonth() + 1));

    const start = `${cd.getFullYear()}-${cd.getMonth() + 1}-01`;
    const end = `${nd.getFullYear()}-${nd.getMonth() + 1}-01`;

    getClassLogsData({ start, end }).then(res => setClassLogs(res))
  }, [user, year, month, refresh])

  const sortedClassLogs = useMemo<CalendarDataType[]>(() => {
    return classLogs
      .map(log => ({
        id: log.id,
        title: log.expand?.student.nickname ?? "",
        student: log.expand?.student.nickname ?? "",
        student_mobile: log.expand?.student.mobile_no ?? "",
        class_mins: log.expand?.student.expand.monthly_package.class_mins ?? 0,
        start_at: log.start_at,
        end_at: log.finish_at,
        completed: log.completed,
        teachers_price: log.cp_teachers_price,
        students_price: log.cp_students_price
      }));
  }, [classLogs]);

  return (
    <NavLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 w-full">
        <div className="col-span-1 md:col-span-3">
          <div className="p-5 md:p-16 w-full grid grid-cols-1 gap-10">
            <TodayClassList />
            <EventCalendar data={sortedClassLogs} />
            {/* <StudentList /> */}
          </div>
        </div>
        <div className="col-span-1 p-5 md:py-16">
          {/* <ClassHistory /> */}
        </div>
      </div>
      <section className="flex flex-col gap-5 p-5">
        <div className="bg-base-200 p-2 rounded">
          <div className="text-xl mb-3 pb-3 border-b border-base-300">User</div>
          <pre className="text-xs">
            <code>{JSON.stringify(user, null, 2)}</code>
          </pre>
        </div>
        <div className="bg-base-200 p-2 rounded">
          <div className="text-xl mb-3 pb-3 border-b border-base-300">Teacher</div>
          <pre className="text-xs">
            <code>{JSON.stringify(teacher, null, 2)}</code>
          </pre>
        </div>
        <div className="bg-base-200 p-2 rounded">
          <div className="text-xl mb-3 pb-3 border-b border-base-300">Students</div>
          {students.map((student, i) => (
            <pre className="text-xs" key={i}>
              <code>{JSON.stringify(student, null, 2)}</code>
            </pre>
          ))}
        </div>
        <div className="bg-base-200 p-2 rounded">
          <div className="text-xl mb-3 pb-3 border-b border-base-300 flex items-center w-full">
            Class Plans ({classLogs.length})
            <div className="flex gap-2 ml-5">
              <select className="select select-xs select-bordered w-full max-w-xs" value={year} onChange={e => setYear(Number(e.target.value))}>
                {[2023, 2024, 2025].map(e => (
                  <option value={e} key={e}>{e}</option>
                ))}
              </select>

              <select className="select select-xs select-bordered w-32" value={month} onChange={e => setMonth(Number(e.target.value))}>
                {constants.MONTHS.map((e, i) => (
                  <option value={i + 1} key={i}>{e}</option>
                ))}
              </select>
            </div>
            <Link to="/class-planner" className="btn btn-xs btn-info ml-auto">Class Planner</Link>
          </div>
          {classLogs.map((classLog, i) => (
            <pre className="text-xs" key={i}>
              <code>{JSON.stringify(classLog, null, 2)}</code>
            </pre>
          ))}
        </div>
        <button className="btn btn-error w-32" onClick={logout}>Logout</button>
      </section>
    </NavLayout>
  );
};
