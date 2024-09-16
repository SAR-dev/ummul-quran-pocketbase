import { useMemo } from "react"
import { getWeeksByYearAndMonth, weeks, weekdays, isMatchingDate } from "../helpers/calendar"
import { CalendarDataType } from "../types/types";

const MonthView = ({
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
    const weeksByYearAndMonth = useMemo(
        () => getWeeksByYearAndMonth(year, month),
        [year, month]
    );

    const countEventsByYearMonthDate = (weekNo: number, weekDayIndex: number) => {
        if(!Object.keys(weeksByYearAndMonth).includes(weekNo.toString())) return;
        const d = weeksByYearAndMonth[weekNo][weekDayIndex]
        if (!d) return;
        const count = data.filter(e => isMatchingDate({
            dateObject: new Date(e.start_at),
            year,
            month,
            date: d
        })).length
        if (count > 0) return count;
    }

    const getDateOfBox = (weekNo: number, weekDayIndex: number) => {
        if(!Object.keys(weeksByYearAndMonth).includes(weekNo.toString())) return '';
        const d = weeksByYearAndMonth[weekNo][weekDayIndex]
        if (!d) return '';
        return d;
    }

    return (
        <div className="flex flex-col relative border-y border-base-300 divide-y divide-base-300">
            <div className="w-full grid grid-cols-7 border-l border-base-300 text-sm font-medium sticky top-0">
                {weekdays.map((weekday, i) => (
                    <div className="h-8 flex justify-center items-center w-full bg-base-100 border-r border-base-300" key={i}>
                        {weekday.longName}
                    </div>
                ))}
            </div>
            {weeks.map((weekNo) => (
                <div className="w-full grid grid-cols-7 border-l border-base-300 text-sm font-medium" key={weekNo}>
                    {weekdays.map((weekday, i) => (
                        <div className={`h-20 relative flex flex-col gap-1 justify-center items-center w-full bg-base-100 border-r border-base-300 ${getDateOfBox(weekNo, weekday.index) == date ? "bg-info/30" : ""}`} key={i}>
                            {getDateOfBox(weekNo, weekday.index)}
                            <div className="w-full flex items-center justify-center">
                                <div className="h-6 w-6 flex justify-center items-center bg-warning text-warning-content rounded-full mb-1">
                                    {countEventsByYearMonthDate(weekNo, weekday.index) ?? "-"}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default MonthView
