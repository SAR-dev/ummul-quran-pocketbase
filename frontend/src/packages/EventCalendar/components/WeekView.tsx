import { useMemo } from "react"
import { weekdays, filterWeekViewData, getWeekByYearMonthAndDate, getDayOfWeekIndex, formatTimestampToTime } from "../helpers/calendar"
import { CalendarDataType, TimeRangeEventsType } from "../types/types";
import { stringToColor } from "../helpers/color";
import { ClockIcon, UserIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const WeekView = ({
    year,
    month,
    date,
    data
}: {
    year: number,
    month: number,
    date: number,
    data: CalendarDataType[]
}) => {
    const timeRangeEvents: TimeRangeEventsType[] = useMemo(
        () => filterWeekViewData({ year, month, date, data }),
        [year, month, date, data]
    );

    const weekDates = useMemo(
        () => getWeekByYearMonthAndDate({ year, month, date }),
        [year, month, date]
    );

    return (
        <div className="flex flex-col relative max-h-[25rem] overflow-y-scroll bg-base-200 border border-base-300">
            <div className="w-full grid grid-cols-8 border border-base-300 text-sm font-medium sticky top-0 bg-base-100">
                <div className="h-8 flex justify-center items-center w-full bg-base-100 border-r border-base-300"></div>
                {weekdays.map((weekday, i) => (
                    <div className={`h-8 flex justify-center items-center w-full bg-base-100 border-r border-base-300 ${weekDates[i].day == date ? "bg-warning/50" : ""}`} key={i}>
                        {weekday.longName}
                    </div>
                ))}
            </div>
            <div className="w-full grid grid-cols-8 border border-base-300 text-sm font-medium">
                <div className="h-8 flex justify-center items-center w-full bg-base-200 border-r border-base-300"></div>
                {weekDates.map((day, i) => (
                    <div className={`h-8 flex justify-center items-center w-full bg-base-200 border-r border-base-300 text-sm ${weekDates[i].day == date ? "bg-warning/50" : ""}`} key={i}>
                        {day.day} {day.month}
                    </div>
                ))}
            </div>
            {timeRangeEvents.map((timeRangeEvent, i) => (
                <div className="w-full grid grid-cols-8 border border-base-300 text-sm font-medium" key={i}>
                    <div className="h-auto py-2 flex justify-center items-center w-full bg-base-100 border-r border-base-300">
                        {timeRangeEvent.start}
                    </div>
                    {weekdays.map((day, i) => (
                        <div className={`h-auto min-h-14 flex items-center w-full bg-base-100 border-r border-base-300 p-2 ${weekDates[i].day == date ? "bg-warning/50" : ""}`} key={i}>
                            {timeRangeEvent.events.filter(e => getDayOfWeekIndex(new Date(e.start_at)) == day.index).map(ev => (
                                <div className="flex flex-col gap-1 text-sm p-1 w-full rounded" style={{ backgroundColor: `${stringToColor(ev.title, .3)}` }} key={i}>
                                    <div className="flex gap-1 items-center">
                                        <ClockIcon className="h-4 w-4" />
                                        {formatTimestampToTime(ev.start_at)} - {formatTimestampToTime(ev.finish_at)}
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <UserIcon className="h-4 w-4" />
                                        {ev.title}
                                        {ev.completed && (
                                            <CheckCircleIcon className="h-4 w-4 ml-auto" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default WeekView
