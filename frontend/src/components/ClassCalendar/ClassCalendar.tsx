import { useEffect, useMemo, useState } from "react"
import { months, getYearsRange, getDaysOfMonth } from "../../helpers/calendar"
import { CalendarDataType, CalendarViewTypes } from "../../types/calendar"
import MonthView from "./components/MonthView"
import DayView from "./components/DayView"
import { CalculatorIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom"
import { useLocalStorage, useWindowSize } from "usehooks-ts"
import LogView from "./components/LogView"
import { TexpandStudentWithPackage } from "../../types/extend"
import { ClassLogsResponse } from "../../types/pocketbase"
import { usePocket } from "../../contexts/PocketContext"

const ClassCalendar = () => {
  const { width = 0 } = useWindowSize()
  const { refresh, user, getClassLogsData } = usePocket();
  const [classLogs, setClassLogs] = useState<ClassLogsResponse<TexpandStudentWithPackage>[]>([])
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [date, setDate] = useState(new Date().getDate())

  const [view, setView] = useLocalStorage('event-calendar-view', CalendarViewTypes.MONTH)
  
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
        finish_at: log.finish_at,
        completed: log.completed,
        teachers_price: log.cp_teachers_price,
        students_price: log.cp_students_price
      }));
  }, [classLogs]);

  useEffect(() => {
    if(width < 600 && view == CalendarViewTypes.MONTH){
      setView(CalendarViewTypes.LOGS)
    }
  }, [width])
  

  return (
    <div className='card border-2 border-base-300 bg-base-100 p-5'>
      <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-3">
        <div className="flex gap-3">
          {view != CalendarViewTypes.LOGS && (
            <select
              value={date}
              className="select select-sm select-bordered flex-1 md:w-20"
              onChange={e => setDate(parseInt(e.target.value))}
            >
              {getDaysOfMonth(year, month).map(e => (
                <option value={e} key={e}>{e}</option>
              ))}
            </select>
          )}
          <select
            value={month}
            className="select select-sm select-bordered flex-1 md:w-32"
            onChange={e => setMonth(parseInt(e.target.value))}
          >
            {months.map(e => (
              <option value={e.index} key={e.index}>{e.longName}</option>
            ))}
          </select>
          <select
            value={year}
            className="select select-sm select-bordered flex-1 md:w-28"
            onChange={e => setYear(parseInt(e.target.value))}
          >
            {getYearsRange().map(e => (
              <option value={e} key={e}>{e}</option>
            ))}
          </select>
        </div>
        <div className="join join-horizontal">
          <button
            className={`btn btn-sm join-item flex-1 md:flex-auto ${view === CalendarViewTypes.DAY ? "btn-active" : ""}`}
            onClick={() => setView(CalendarViewTypes.DAY)}
          >
            Day
          </button>
          <button
            className={`hidden md:btn md:btn-sm join-item ${view === CalendarViewTypes.MONTH ? "btn-active" : ""}`}
            onClick={() => setView(CalendarViewTypes.MONTH)}
          >
            Month
          </button>
          <button
            className={`btn btn-sm join-item flex-1 md:flex-auto ${view === CalendarViewTypes.LOGS ? "btn-active" : ""}`}
            onClick={() => setView(CalendarViewTypes.LOGS)}
          >
            Logs
          </button>
        </div>
      </div>
      {view == CalendarViewTypes.DAY && <DayView year={year} month={month} date={date} data={sortedClassLogs} />}
      {view == CalendarViewTypes.MONTH && <MonthView year={year} month={month} date={date} setDate={setDate} setView={setView} data={sortedClassLogs} />}
      {view == CalendarViewTypes.LOGS && <LogView data={sortedClassLogs} />}
      <div className="flex gap-3 mt-3">
        <Link to="/teacher/class-planner" className="btn btn-sm btn-icon btn-outline border-base-300">
          <CalculatorIcon className="h-4 w-4" />
          Class Planner
        </Link>
      </div>
    </div>
  )
}

export default ClassCalendar
