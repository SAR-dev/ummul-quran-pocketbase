import { useEffect, useState } from 'react';
import { ClassLogsResponse } from '../types/pocketbase'
import { TexpandStudentWithPackage } from '../types/extend'
import { usePocket } from '../contexts/PocketContext';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import ClassLogView from './ClassLogView';

export const TodayClassList = () => {
    const { refresh, user, getClassLogsData } = usePocket();
    const [todayClassLogs, setTodayClassLogs] = useState<ClassLogsResponse<TexpandStudentWithPackage>[]>([])

    useEffect(() => {
        if (!user) return;

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const start = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
        const end = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`

        getClassLogsData({ start, end }).then(res => setTodayClassLogs(res))
    }, [refresh])

    return (
        <div className='card gap-5 border border-base-300 p-5'>
            <div className='flex items-center gap-3'>
                <BellAlertIcon className='h-5 w-5 text-primary' />
                <div>You have <b>{todayClassLogs.length.toString().padStart(2, '0')}</b> classes today</div>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {todayClassLogs.map((e, i) => (
                    <ClassLogView
                        id={e.id}
                        completed={e.completed}
                        start_at={e.start_at}
                        finish_at={e.finish_at}
                        student={e.expand?.student.nickname ?? ""}
                        student_mobile={e.expand?.student.mobile_no ?? ""}
                        class_mins={e.expand?.student.expand.monthly_package.class_mins ?? 0}
                        key={i}
                    />
                ))}
            </div>
        </div>
    )
}
