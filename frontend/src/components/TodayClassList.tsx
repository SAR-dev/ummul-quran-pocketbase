import { useEffect, useState } from 'react';
import { ClassLogsResponse } from '../types/pocketbase'
import { TexpandStudentWithPackage } from '../types/extend'
import { usePocket } from '../contexts/PocketContext';
import { CheckCircleIcon, BellAlertIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon, PhoneIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import { getTimeIn12HourFormat } from '../packages/EventCalendar/helpers/calendar';
import WhatsAppIcon from "../assets/whatsapp.png"

export const TodayClassList = () => {
    const { user, getClassLogsData } = usePocket();
    const [todayClassLogs, setTodayClassLogs] = useState<ClassLogsResponse<TexpandStudentWithPackage>[]>([])

    useEffect(() => {
        if (!user) return;

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        getClassLogsData({
            start: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
            end: `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`
        })
            .then(res => {
                setTodayClassLogs(res)
            })
    }, [])

    return (
        <div className='card gap-5 border border-base-300 p-5'>
            <div className='flex items-center gap-3'>
                <BellAlertIcon className='h-5 w-5 text-primary' />
                <div>You have <b>{todayClassLogs.length.toString().padStart(2, '0')}</b> classes today</div>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {todayClassLogs.map((e, i) => (
                    <div key={i} className='bg-base-200 p-3 card flex-row items-center border border-base-300 text-sm'>
                        <div className="w-10 flex-shrink-0">
                            {e.completed ? <CheckCircleIcon className='w-5 h-5 text-success' /> : <div className='h-5 w-5 bg-warning rounded-full' />}
                        </div>
                        <div className="w-40 flex-shrink-0">
                            <div className="flex items-center gap-2 font-semibold">
                                <UserIcon className='h-4 w-4' />
                                {e.expand?.student.nickname}
                            </div>
                        </div>
                        <div className="w-48 flex-shrink-0">
                            <button className='btn btn-icon bg-base-100 btn-sm'>
                                <img src={WhatsAppIcon} className='h-6' alt="" />
                                {e.expand?.student.mobile_no}
                            </button>
                        </div>
                        <div className="w-48 flex-shrink-0">
                            <b>{e.expand?.student.expand.monthly_package.class_mins} Mins</b> class, From <b>{getTimeIn12HourFormat(e.start_at)}</b>
                        </div>
                        <div className='flex gap-2 items-center ml-auto'>
                            <button className="btn btn-sm btn-icon btn-square bg-base-100">
                                <TrashIcon className='h-5 w-5' />
                            </button>
                            <button className="btn btn-sm btn-icon btn-square bg-base-100">
                                <ArrowRightIcon className='h-5 w-5' />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
