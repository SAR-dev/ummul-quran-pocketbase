import { useMemo } from "react"
import { getWeeksByYearAndMonth, weeks, weekdays, isMatchingDate } from "../helpers/calendar"
import { CalendarDataType } from "../types/types";
import classNames from "classnames";

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
        if (!Object.keys(weeksByYearAndMonth).includes(weekNo.toString())) return;
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
        if (!Object.keys(weeksByYearAndMonth).includes(weekNo.toString())) return '';
        const d = weeksByYearAndMonth[weekNo][weekDayIndex]
        if (!d) return '';
        return d;
    }

    const datesWithClassCount = useMemo(
        () => weeks.flatMap(weekNo => weekdays.map((weekday) => {
            return {
                weekNo: weekNo,
                weekdayIndex: weekday.index,
                date: getDateOfBox(weekNo, weekday.index),
                count: countEventsByYearMonthDate(weekNo, weekday.index)
            }
        })),
        [weeksByYearAndMonth, data]
    );

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
                        <div className={`h-20 relative flex flex-col gap-1 justify-center items-center w-full bg-base-100 border-r border-base-300 ${getDateOfBox(weekNo, weekday.index) == date ? "bg-warning/50" : ""}`} key={i}>
                            {datesWithClassCount.find(e => e.weekNo == weekNo && e.weekdayIndex == weekday.index)?.date}
                            <div className="w-full flex items-center justify-center">
                                <div className={classNames({
                                    "h-6 w-6 flex justify-center items-center rounded-full mb-1": true,
                                    "bg-warning text-warning-content": !!datesWithClassCount.find(e => e.weekNo == weekNo && e.weekdayIndex == weekday.index)?.count ,
                                    "bg-base-300": !datesWithClassCount.find(e => e.weekNo == weekNo && e.weekdayIndex == weekday.index)?.count 
                                })}>
                                    {datesWithClassCount.find(e => e.weekNo == weekNo && e.weekdayIndex == weekday.index)?.count ?? "-"}
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
