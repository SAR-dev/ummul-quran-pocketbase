import { useMemo } from "react"
import { getWeeksByYearAndMonth, weeks, weekdays, isMatchingDate } from "../helpers/calendar"
import { CalendarDataType } from "../types/types";
import classNames from "classnames";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

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
                        <div className={`h-20 relative flex flex-col gap-1 justify-center items-center w-full bg-base-100 border-r border-base-300 hover:bg-warning/50 cursor-pointer ${getDateOfBox(weekNo, weekday.index) == date ? "bg-warning/50" : ""}`} key={i}>
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
            {/* <Dialog open={isOpen} onClose={remove} className="relative z-20">
                <DialogBackdrop className="fixed inset-0 bg-base-content/25" />
                <div className="fixed inset-0 flex w-screen items-center justify-center">
                    <DialogPanel className="card p-4 bg-base-100 max-w-md">
                        {data.status !== NotificationType.LOADING && (
                            <button className="btn btn-square btn-sm absolute top-0 right-0 m-3" onClick={() => setIsOpen(false)}>
                                <XMarkIcon className='h-5 w-5' />
                            </button>
                        )}
                        <div className='flex flex-col gap-3 p-5'>

                        </div>
                    </DialogPanel>
                </div>
            </Dialog> */}
        </div>
    )
}

export default MonthView
