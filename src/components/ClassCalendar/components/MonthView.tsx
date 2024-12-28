import { useMemo } from "react"
import { getWeeksByYearAndMonth, weeks, weekdays, isMatchingDate } from "../../../helpers/calendar"
import { CalendarDataType, CalendarViewTypes } from "../../../types/calendar";
import classNames from "classnames";

const MonthView = ({
    year,
    month,
    date,
    setDate,
    setView,
    data
}: {
    year: number,
    month: number,
    date: number,
    setDate: (props: number) => void,
    setView: (props: CalendarViewTypes) => void,
    data: CalendarDataType[]
}) => {
    const weeksByYearAndMonth = useMemo(
        () => getWeeksByYearAndMonth(year, month),
        [year, month]
    );

    const getEventsByYearMonthDate = (weekNo: number, weekDayIndex: number) => {
        if (!Object.keys(weeksByYearAndMonth).includes(weekNo.toString())) return;
        const d = weeksByYearAndMonth[weekNo][weekDayIndex]
        if (!d) return;
        return data.filter(e => isMatchingDate({
            dateObject: new Date(e.start_at),
            year,
            month,
            date: d
        }))
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
                events: getEventsByYearMonthDate(weekNo, weekday.index)
            }
        })),
        [weeksByYearAndMonth, data]
    );

    const handleSelectDate = ({weekNo, weekDayIndex}:{weekNo: number, weekDayIndex: number}) => {
        const found = datesWithClassCount.find(e => e.weekNo == weekNo && e.weekdayIndex == weekDayIndex);
        if(!found || Number(found.date) <= 0) return;
        setDate(Number(found.date))
        setView(CalendarViewTypes.DAY)
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
                        <div 
                            className={`h-20 relative flex flex-col gap-1 justify-center items-center w-full bg-base-100 border-r border-base-300 hover:bg-warning/50 cursor-pointer ${getDateOfBox(weekNo, weekday.index) == date ? "bg-warning/50" : ""}`} 
                            onClick={() => handleSelectDate({weekNo, weekDayIndex: weekday.index})}
                            key={i}
                        >
                            {datesWithClassCount.find(e => e.weekNo == weekNo && e.weekdayIndex == weekday.index)?.date}
                            {datesWithClassCount.find(e => e.weekNo == weekNo && e.weekdayIndex == weekday.index)?.date && (
                                <div className="w-full flex items-center justify-center">
                                    <div className={classNames({
                                        "h-6 w-6 flex justify-center items-center rounded-full mb-1": true,
                                        "bg-warning text-warning-content": !!datesWithClassCount.find(e => e.weekNo == weekNo && e.weekdayIndex == weekday.index)?.events?.length,
                                        "bg-base-300": !datesWithClassCount.find(e => e.weekNo == weekNo && e.weekdayIndex == weekday.index)?.events?.length
                                    })}>
                                        {datesWithClassCount.find(e => e.weekNo == weekNo && e.weekdayIndex == weekday.index)?.events?.length ?? "-"}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default MonthView
