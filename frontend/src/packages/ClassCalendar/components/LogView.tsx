import { getDateFromString, getTimeIn12HourFormat } from "../helpers/calendar";
import { CalendarDataType } from "../types/types";
import { ArrowRightIcon, CheckCircleIcon, ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { CalendarIcon, TrashIcon, UserIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import WhatsAppButton from "../../../components/WhatsAppButton";

const LogView = ({
    data
}: {
    data: CalendarDataType[]
}) => {
    const groupedData = useMemo(() => {
        return data.reduce((acc, item) => {
            const date = getDateFromString(item.start_at);
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {} as { [key: string]: CalendarDataType[] });
    }, [data]);

    const sortedKeys = Object.keys(groupedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return (
        <div className="grid grid-cols-1">
            {sortedKeys.map((key, i) => (
                <div className="w-full my-5" key={i}>
                    <div className="text-sm flex items-center gap-2 mb-2"><CalendarIcon className="h-5 w-5" /> {key}</div>
                    <div className="grid grid-cols-1 gap-3">
                        {groupedData[key].map((e, i) => (
                            <div key={i} className='bg-base-200 p-3 card flex-row items-center border border-base-300 text-sm'>
                                <div className="w-10 flex-shrink-0">
                                    {e.completed ? (
                                        <CheckCircleIcon className='w-5 h-5 text-success' />
                                    ) : (
                                        <>
                                            {(new Date(e.start_at)) < (new Date()) ? (
                                                <ShieldExclamationIcon className='w-5 h-5 text-warning' />
                                            ) : (
                                                <svg className="inline w-5 h-5 text-base-100 animate-spin fill-info" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="w-40 flex-shrink-0">
                                    <div className="flex items-center gap-2 font-semibold">
                                        <UserIcon className='h-4 w-4' />
                                        {e.student}
                                    </div>
                                </div>
                                <div className="w-48 flex-shrink-0">
                                    <WhatsAppButton mobile_no={e.student_mobile} />
                                </div>
                                <div className="w-32 flex-shrink-0">
                                    <b>{e.class_mins} Mins</b> class
                                </div>
                                <div className="w-40 flex-shrink-0">
                                    <b>{getTimeIn12HourFormat(e.start_at)}</b> - {e.finish_at ? <b>{getTimeIn12HourFormat(e.finish_at)}</b> : "Not set yet"}
                                </div>
                                <div className='flex gap-2 items-center ml-auto'>
                                    <button className="btn btn-sm btn-icon btn-square bg-base-100">
                                        <TrashIcon className='h-5 w-5' />
                                    </button>
                                    <Link to={`/class-details/${e.id}`} className="btn btn-sm btn-icon btn-square bg-base-100">
                                        <ArrowRightIcon className='h-5 w-5' />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default LogView
