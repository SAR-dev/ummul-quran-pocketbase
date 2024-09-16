import { useMemo } from "react"
import { weekdays, filterWeekViewData, getWeekByYearMonthAndDate, getDayOfWeekIndex, formatTimestampToTime } from "../helpers/calendar"
import { CalendarDataType, TimeRangeEventsType } from "../types/types";
import { stringToColor } from "../helpers/color";

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
                    <div className={`h-8 flex justify-center items-center w-full bg-base-100 border-r border-base-300 ${weekDates[i].day == date ? "bg-info/30" : ""}`} key={i}>
                        {weekday.longName}
                    </div>
                ))}
            </div>
            <div className="w-full grid grid-cols-8 border border-base-300 text-sm font-medium">
                <div className="h-8 flex justify-center items-center w-full bg-base-100 border-r border-base-300"></div>
                {weekDates.map((day, i) => (
                    <div className={`h-8 flex justify-center items-center w-full bg-base-100 border-r border-base-300 text-xs font-light ${weekDates[i].day == date ? "bg-info/30" : ""}`} key={i}>
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
                        <div className={`h-auto min-h-14 flex items-center w-full bg-base-100 border-r border-base-300 p-2 ${weekDates[i].day == date ? "bg-info/30" : ""}`} key={i}>
                            {timeRangeEvent.events.filter(e => getDayOfWeekIndex(new Date(e.start_at)) == day.index).map(ev => (
                                <div className="flex gap-2 items-center text-xs" key={i}>
                                    <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: `${stringToColor(ev.title)}` }}></div>
                                    <div>{formatTimestampToTime(ev.start_at)} - {formatTimestampToTime(ev.end_at)}</div>
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
