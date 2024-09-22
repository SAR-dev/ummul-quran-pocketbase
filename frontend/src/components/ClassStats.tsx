import { useEffect, useState } from 'react';
import { usePocket } from '../contexts/PocketContext';
import { ClassLogsResponse } from '../types/pocketbase';
import { TexpandStudentWithPackage } from '../types/extend';

const ClassStats = () => {
    const { refresh, user, getClassLogsData } = usePocket();
    const [classLogs, setClassLogs] = useState<ClassLogsResponse<TexpandStudentWithPackage>[]>([])
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth() + 1)

    useEffect(() => {
        if (!user) return;

        const cd = new Date(year, month - 1, 1);
        const nd = new Date(new Date(year, month - 1, 1).setMonth(new Date(year, month - 1, 1).getMonth() + 1));

        const start = `${cd.getFullYear()}-${cd.getMonth() + 1}-01`;
        const end = `${nd.getFullYear()}-${nd.getMonth() + 1}-01`;

        getClassLogsData({ start, end }).then(res => setClassLogs(res))
    }, [user, year, month, refresh])

    return (
        <div className='card border border-base-300'>
            <div className="text-center w-full font-semibold py-3 border-b border-base-300">
                Class Stats
            </div>
            <div className="text-center w-full font-semibold py-3 border-b border-base-300">
                Class Stats
            </div>
        </div>
    )
}

export default ClassStats