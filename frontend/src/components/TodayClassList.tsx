import { useEffect, useState } from 'react';
import { ClassLogsResponse } from '../types/pocketbase'
import { TexpandStudentWithPackage } from '../types/extend'
import { usePocket } from '../contexts/PocketContext';

export const TodayClassList = ({ fetchClassLogsData }: { fetchClassLogsData: ({ start, end }: { start: string, end: string }) => Promise<ClassLogsResponse<TexpandStudentWithPackage>[]> }) => {
    const { user, pb } = usePocket();
    const [todayClassLogs, setTodayClassLogs] = useState<ClassLogsResponse<TexpandStudentWithPackage>[]>([])

    useEffect(() => {
        if (!user) return;

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        fetchClassLogsData({
            start: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
            end: `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`
        })
        .then(res => {
            setTodayClassLogs(res)
        })
    }, [pb])

    return (
        <div></div>
    )
}
