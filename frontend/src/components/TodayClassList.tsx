import { useEffect, useState } from 'react';
import { ClassLogsResponse } from '../types/pocketbase'
import { TexpandStudentWithPackage } from '../types/extend'
import { usePocket } from '../contexts/PocketContext';

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
        <div>{todayClassLogs.length}</div>
    )
}
