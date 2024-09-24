import { useEffect, useState } from 'react';
import { usePocket } from '../contexts/PocketContext';
import { ClassLogsResponse } from '../types/pocketbase';
import { TexpandStudentWithPackage } from '../types/extend';
import { getYearsRange, months } from '../helpers/calendar';

const currentYear = new Date().getFullYear();

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
        const key = "stat"

        getClassLogsData({ start, end, key }).then(res => setClassLogs(res))
    }, [user, year, month, refresh])

    return (
        <div className='card border-2 border-base-300 bg-base-100'>
            <div className="text-center w-full font-semibold py-3 border-b border-base-300">
                Class Stats
            </div>
            <div className="w-full font-semibold p-3 border-b border-base-300 grid grid-cols-2 gap-10">
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="select select-bordered select-sm w-full">
                    <option disabled selected>Select Month</option>
                    {months.map((e, i) => (
                        <option value={e.index} key={i}>{e.longName}</option>
                    ))}
                </select>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="select select-bordered select-sm w-full">
                    <option disabled selected>Select Year</option>
                    {getYearsRange().map((e, i) => (
                        <option value={e} key={i}>{e}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2">
                <div className='py-3 border-b border-base-300 pl-5 font-semibold'>Completed Class</div>
                <div className='py-3 border-b border-base-300 pl-5 border-l'>{classLogs.filter(e => e.completed).length}</div>
                <div className='py-3 border-b border-base-300 pl-5 font-semibold'>Pending Class</div>
                <div className='py-3 border-b border-base-300 pl-5 border-l'>{classLogs.filter(e => !e.completed).length}</div>
                <div className='py-3 border-b border-base-300 pl-5 font-semibold'>Completed Earnings</div>
                <div className='py-3 border-b border-base-300 pl-5 border-l'>{classLogs.filter(e => e.completed).map(c => c.cp_teachers_price).reduce((acc, curr) => acc + curr, 0)}</div>
                <div className='py-3 border-b border-base-300 pl-5 font-semibold'>Pending Earnings</div>
                <div className='py-3 border-b border-base-300 pl-5 border-l'>{classLogs.filter(e => !e.completed).map(c => c.expand?.student.expand.monthly_package.teachers_price ?? 0).reduce((acc, curr) => acc + curr, 0)}</div>
                
            </div>
        </div>
    )
}

export default ClassStats