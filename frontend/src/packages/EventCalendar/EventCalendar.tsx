import { useState } from "react"
import { months, getYearsRange, getDaysOfMonth } from "./helpers/calendar"
import { CalendarDataType, CalendarViewTypes } from "./types/types"
import MonthView from "./components/MonthView"
import WeekView from "./components/WeekView"
import DayView from "./components/DayView"
import { PrinterIcon, SignalIcon } from "@heroicons/react/24/outline"

const data: CalendarDataType[] = [
  {
    id: 1,
    title: "Team Meeting",
    start_at: "2024-09-09T10:00:00+09:00",
    end_at: "2024-09-09T11:30:00+09:00"
  },
  {
    id: 2,
    title: "Project Designing",
    start_at: "2024-09-10T10:00:00+09:00",
    end_at: "2024-09-10T12:00:00+09:00"
  },
  {
    id: 3,
    title: "Project Deadline",
    start_at: "2024-09-11T15:00:00+09:00",
    end_at: "2024-09-11T16:00:00+09:00"
  },
  {
    id: 4,
    title: "Client Presentation",
    start_at: "2024-09-09T09:30:00+09:00",
    end_at: "2024-09-09T10:30:00+09:00"
  },
  {
    id: 5,
    title: "Workshop",
    start_at: "2024-09-11T14:00:00+09:00",
    end_at: "2024-09-11T17:00:00+09:00"
  },
  {
    id: 6,
    title: "Monthly Review",
    start_at: "2024-09-25T11:00:00+09:00",
    end_at: "2024-09-25T12:00:00+09:00"
  }
]

const EventCalendar = () => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [date, setDate] = useState(new Date().getDate())
  const [view, setView] = useState<CalendarViewTypes>(CalendarViewTypes.MONTH)

  return (
    <div>
      <div className="w-full flex justify-between items-center mb-3">
        <div className="flex gap-3">
          <select
            value={date}
            className="select select-sm select-bordered w-20"
            onChange={e => setDate(parseInt(e.target.value))}
          >
            {getDaysOfMonth(year, month).map(e => (
              <option value={e}>{e}</option>
            ))}
          </select>
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
        </div>
      </div>
      {view == CalendarViewTypes.DAY && <DayView year={year} month={month} date={date} data={data} />}
      {view == CalendarViewTypes.WEEK && <WeekView year={year} month={month} date={date} data={data} />}
      {view == CalendarViewTypes.MONTH && <MonthView year={year} month={month} date={date} data={data} />}
      <div className="flex gap-3 mt-3">
        <button className="btn btn-sm btn-icon btn-outline border-base-300">
          <SignalIcon className="h-4 w-4" />
          See Detailed Logs
        </button>
        <button className="btn btn-sm btn-icon btn-outline border-base-300">
          <PrinterIcon className="h-4 w-4" />
          Print Receipt
        </button>
      </div>
    </div>
  )
}

export default EventCalendar
