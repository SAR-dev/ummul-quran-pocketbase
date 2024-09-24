import { useMemo } from "react";
import { months, getWeekday, formatTimestampToTime, filterDayViewData } from "../../../helpers/calendar"
import { CalendarDataType, TimeRangeEventsType } from "../../../types/calendar"
import { stringToColor } from "../../../helpers/color";
import { ClockIcon, UserIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const DayView = ({
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
    const navigate = useNavigate()
    const timeRangeEvents: TimeRangeEventsType[] = useMemo(
        () => filterDayViewData({ year, month, date, data }),
        [year, month, date, data]
    );

    return (
        <div className="flex flex-col divide-y divide-base-300 border border-base-300 relative max-h-[25rem] overflow-y-scroll scrollbar-thin bg-base-200 border border-base-300">
            <div className="w-full flex border-x border-base-300 text-sm font-medium sticky top-0 bg-base-100">
                <div className="w-[8rem] flex-shrink-0 justify-center items-center bg-base-100 border-r border-base-300"></div>
                <div className="w-full">
                    <div className="py-2 flex items-center justify-between px-3">
                        <div>{date} {months.find(e => e.index == month)?.longName}, {year}</div>
                        <div className="ml-auto">{getWeekday(year, month, date)}</div>
                    </div>
                </div>
            </div>
            {timeRangeEvents.map((timeRangeEvent, i) => (
                <div className="w-full flex border-x border-base-300 text-sm font-medium" key={i}>
                    <div className="w-[8rem] flex-shrink-0 h-auto py-2 flex justify-center items-start bg-base-100 border-r border-base-300">
                        {timeRangeEvent.start}
                    </div>
                    <div className="w-auto h-auto min-h-12 flex gap-3 gap-1 w-full bg-base-100 p-2">
                        {timeRangeEvent.events.map((e, i) => (
                            <div 
                                className="w-fit flex gap-2 items-center text-sm py-1 px-3 rounded cursor-pointer hover:translate-x-1 duration-100" 
                                onClick={() => navigate(`/class-details/${e.id}`)} 
                                style={{ backgroundColor: `${stringToColor(e.title, .3)}` }} 
                                key={i}
                            >
                                {e.completed ? (
                                    <CheckCircleIcon className='w-4 h-4 text-info' />
                                ) : (
                                    <>
                                        {(new Date(e.start_at)) < (new Date()) ? (
                                            <ShieldExclamationIcon className='w-4 h-4 text-warning' />
                                        ) : (
                                            <svg className="inline w-4 h-4 text-base-100 animate-spin fill-info" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                        )}
                                    </>
                                )}
                                <div className="flex gap-1 items-center text-xs">
                                    Class with <b>{e.title}</b> from {formatTimestampToTime(e.start_at)} {e.finish_at && `to ${formatTimestampToTime(e.finish_at)}`}
                                </div>
                                
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default DayView
