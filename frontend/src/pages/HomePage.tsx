import { useEffect, useMemo, useState } from "react";
import { usePocket } from "../contexts/PocketContext";
import { Link } from "react-router-dom";
import { ClassLogsResponse, Collections } from "../types/pocketbase";
import { TexpandStudentWithPackage } from "../types/extend";
import { constants } from "../stores/constantStore";
import NavLayout from "../layouts/NavLayout";
import EventCalendar from "../packages/EventCalendar/EventCalendar";
import { CalendarDataType } from "../packages/EventCalendar/types/types";
import { TodayClassList } from "../components/TodayClassList";

export const HomePage = () => {
  const { logout, user, teacher, students, pb } = usePocket();
  const [classLogs, setClassLogs] = useState<ClassLogsResponse<TexpandStudentWithPackage>[]>([])
  const [year, setYear] = useState(2024)
  const [month, setMonth] = useState((new Date()).getMonth() + 1)

  function formatDateToCustomString(date: Date) {
    date.setHours(0, 0, 0, 0);
    const pad = (num: number, size: number) => String(num).padStart(size, '0');

    // Date components
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1, 2); // Months are zero-based
    const day = pad(date.getUTCDate(), 2);

    // Time components
    const hours = pad(date.getUTCHours(), 2);
    const minutes = pad(date.getUTCMinutes(), 2);
    const seconds = pad(date.getUTCSeconds(), 2);
    const milliseconds = pad(date.getUTCMilliseconds(), 3);
    const microseconds = pad(Number(milliseconds) * 1000, 6); // Convert to microseconds

    // UTC Offset (always Z for UTC)
    const timezone = 'Z';

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}${timezone}`;
  }

  const fetchClassLogsData = async ({ start, end }: { start: string, end: string }) => {
    const userId = user?.id;
    if (!userId) {
      return [];
    }

    const startUTC = formatDateToCustomString(new Date(start));
    const endUTC = formatDateToCustomString(new Date(end));

    const res = await pb
      .collection(Collections.ClassLogs)
      .getFullList<ClassLogsResponse<TexpandStudentWithPackage>>({
        filter: `student.teacher.user.id = "${userId}" && start_at >= "${startUTC}" && start_at < "${endUTC}"`,
        expand: "student, student.monthly_package",
        requestKey: `${userId}${startUTC}${endUTC}`
      });
    return res
  };

  useEffect(() => {
    if (!user) return;

    const cd = new Date(year, month - 1, 1);
    const nd = new Date(new Date(year, month - 1, 1).setMonth(new Date(year, month - 1, 1).getMonth() + 1));

    fetchClassLogsData({
      start: `${cd.getFullYear()}-${cd.getMonth() + 1}-01`,
      end: `${nd.getFullYear()}-${nd.getMonth() + 1}-01`
    })
      .then(res => {
        setClassLogs(res)
      })
  }, [user, year, month])

  const sortedClassLogs = useMemo<CalendarDataType[]>(() => {
    return classLogs
      .map(log => ({
        id: log.id,
        title: log.expand?.student.nickname ?? "",
        start_at: log.start_at,
        end_at: log.finish_at,
        completed: log.completed
      }));
  }, [classLogs]);

  return (
    <NavLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 w-full">
        <div className="col-span-1 md:col-span-3">
          <div className="p-5 md:p-16 w-full grid grid-cols-1 gap-10">
            <TodayClassList fetchClassLogsData={fetchClassLogsData} />
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
