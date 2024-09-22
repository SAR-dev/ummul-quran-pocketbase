import { useState } from "react"
import { months, getYearsRange, getDaysOfMonth } from "./helpers/calendar"
import { CalendarDataType, CalendarViewTypes } from "./types/types"
import MonthView from "./components/MonthView"
import WeekView from "./components/WeekView"
import DayView from "./components/DayView"
import { CalculatorIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom"
import { useLocalStorage } from "usehooks-ts"
import LogView from "./components/LogView"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { MonthlyInvoice } from "./components/MonthlyInvoice"

const EventCalendar = ({ data }: { data: CalendarDataType[] }) => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [date, setDate] = useState(new Date().getDate())
  const [view, setView] = useLocalStorage('event-calendar-view', CalendarViewTypes.MONTH)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='card border border-base-300 p-5'>
      <div className="w-full flex justify-between items-center mb-3">
        <div className="flex gap-3">
          {view != CalendarViewTypes.LOGS && (
            <select
              value={date}
              className="select select-sm select-bordered w-20"
              onChange={e => setDate(parseInt(e.target.value))}
            >
              {getDaysOfMonth(year, month).map(e => (
                <option value={e}>{e}</option>
              ))}
            </select>
          )}
          <select
            value={month}
            className="select select-sm select-bordered w-32"
            onChange={e => setMonth(parseInt(e.target.value))}
          >
            {months.map(e => (
              <option value={e.index}>{e.longName}</option>
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
            className={`btn btn-sm join-item ${view === CalendarViewTypes.WEEK ? "btn-active" : ""}`}
            onClick={() => setView(CalendarViewTypes.WEEK)}
          >
            Week
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
      {view == CalendarViewTypes.DAY && <DayView year={year} month={month} date={date} data={data} />}
      {view == CalendarViewTypes.WEEK && <WeekView year={year} month={month} date={date} data={data} />}
      {view == CalendarViewTypes.MONTH && <MonthView year={year} month={month} date={date} data={data} />}
      {view == CalendarViewTypes.LOGS && <LogView data={data} />}
      <div className="flex gap-3 mt-3">
        <button className="btn btn-sm btn-icon btn-outline border-base-300" onClick={() => setIsOpen(true)}>
          <PrinterIcon className="h-4 w-4" />
          Print Receipt
        </button>
        <Link to="/class-planner" className="btn btn-sm btn-icon btn-outline border-base-300">
          <CalculatorIcon className="h-4 w-4" />
          Class Planner
        </Link>
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-20">
        <DialogBackdrop className="fixed inset-0 bg-base-content/25" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="card p-5 bg-base-100">
            <MonthlyInvoice data={data} />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default EventCalendar
