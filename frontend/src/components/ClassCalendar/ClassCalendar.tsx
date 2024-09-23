import { useEffect, useMemo, useState } from "react"
import { months, getYearsRange, getDaysOfMonth } from "../../helpers/calendar"
import { CalendarDataType, CalendarViewTypes } from "../../types/calendar"
import MonthView from "./components/MonthView"
import DayView from "./components/DayView"
import { CalculatorIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom"
import { useLocalStorage } from "usehooks-ts"
import LogView from "./components/LogView"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { InvoiceGenerator } from "./components/InvoiceGenerator"
import { TexpandStudentWithPackage } from "../../types/extend"
import { ClassLogsResponse } from "../../types/pocketbase"
import { usePocket } from "../../contexts/PocketContext"

const ClassCalendar = () => {
  const { refresh, user, getClassLogsData } = usePocket();
  const [classLogs, setClassLogs] = useState<ClassLogsResponse<TexpandStudentWithPackage>[]>([])
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [date, setDate] = useState(new Date().getDate())

  const [view, setView] = useLocalStorage('event-calendar-view', CalendarViewTypes.MONTH)
  const [isOpen, setIsOpen] = useState(false)
  
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

  return (
    <div className='card border-2 border-base-300 bg-base-100 p-5'>
      <div className="w-full flex justify-between items-center mb-3">
        <div className="flex gap-3">
          {view != CalendarViewTypes.LOGS && (
            <select
              value={date}
              className="select select-sm select-bordered w-20"
              onChange={e => setDate(parseInt(e.target.value))}
            >
              {getDaysOfMonth(year, month).map(e => (
                <option value={e} key={e}>{e}</option>
              ))}
            </select>
          )}
          <select
            value={month}
            className="select select-sm select-bordered w-32"
            onChange={e => setMonth(parseInt(e.target.value))}
          >
            {months.map(e => (
              <option value={e.index} key={e.index}>{e.longName}</option>
            ))}
          </select>
          <select
            value={year}
            className="select select-sm select-bordered w-28"
            onChange={e => setYear(parseInt(e.target.value))}
          >
            {getYearsRange().map(e => (
              <option value={e}>{e}</option>
            ))}
          </select>
        </div>
        <div className="join join-horizontal">
          <button
            className={`btn btn-sm join-item ${view === CalendarViewTypes.DAY ? "btn-active" : ""}`}
            onClick={() => setView(CalendarViewTypes.DAY)}
          >
            Day
          </button>
          <button
            className={`btn btn-sm join-item ${view === CalendarViewTypes.MONTH ? "btn-active" : ""}`}
            onClick={() => setView(CalendarViewTypes.MONTH)}
          >
            Month
          </button>
          <button
            className={`btn btn-sm join-item ${view === CalendarViewTypes.LOGS ? "btn-active" : ""}`}
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
        <button className="btn btn-sm btn-icon btn-outline border-base-300" onClick={() => setIsOpen(true)}>
          <PrinterIcon className="h-4 w-4" />
          Get Invoice
        </button>
        <Link to="/class-planner" className="btn btn-sm btn-icon btn-outline border-base-300">
          <CalculatorIcon className="h-4 w-4" />
          Class Planner
        </Link>
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-20">
        <DialogBackdrop className="fixed inset-0 bg-base-content/25" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="card p-2 bg-base-100">
            <div className="scrollbar-thin overflow-y-auto p-3 max-h-[90vh]">
              <InvoiceGenerator data={sortedClassLogs} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default ClassCalendar
