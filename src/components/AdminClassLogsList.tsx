import { useEffect, useState } from 'react';
import { ClassLogsResponse, StudentsResponse, TeachersResponse } from '../types/pocketbase'
import { usePocket } from '../contexts/PocketContext';
import { TexpandStudentWithPackageTeacher } from '../types/extend';
import { getDateInDayMonthYearFormat, getTimeIn12HourFormat } from '../helpers/calendar';

const AdminClassLogsList = () => {
    const { refresh, user, getClassLogsDataForAdmin, getTeacherListData, getStudentListData } = usePocket();
    const [date, setDate] = useState<Date>(new Date())
    const [teacherId, setTeacherId] = useState<string>("")
    const [studentId, setStudentId] = useState<string>("")
    const [classLogs, setClassLogs] = useState<ClassLogsResponse<TexpandStudentWithPackageTeacher>[]>([])
    const [teachers, setTeachers] = useState<TeachersResponse[]>([])
    const [students, setStudents] = useState<StudentsResponse[]>([])

    useEffect(() => {
        getTeacherListData().then(res => setTeachers(res))
    }, [])

    useEffect(() => {
        getStudentListData({ teacherId }).then(res => setStudents(res))
    }, [teacherId])


    useEffect(() => {
        if (!user) return;

        const tomorrow = new Date(date);
        tomorrow.setDate(date.getDate() + 1);

        const start = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        const end = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`

        getClassLogsDataForAdmin({ start, end, teacherId, studentId }).then(res => setClassLogs(res))
    }, [date, teacherId, studentId, refresh])


    const handleDateChange = (val: string) => {
        // Try to parse the date
        const d = new Date(val);

        // Check if the date is valid
        if (!isNaN(date.getTime())) {
            setDate(d)
        }
    }

    const handleTeacherIdChange = (val: string) => {
        setTeacherId(val)
        setStudentId("")
    }

    return (
        <div className='p-5'>
            <div className="flex gap-5 items-center w-full mb-5">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Select Date</span>
                    </div>
                    <input
                        type="date"
                        className='input input-bordered'
                        value={date.toISOString().slice(0, 10)}
                        onChange={e => handleDateChange(e.target.value)}
                    />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Select Teacher</span>
                    </div>
                    <select className="select select-bordered w-full max-w-xs" value={teacherId} onChange={e => handleTeacherIdChange(e.target.value)}>
                        <option value="">All</option>
                        {teachers.map((e, i) => (
                            <option value={e.id} key={i}>{e.nickname}</option>
                        ))}
                    </select>
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Select Student</span>
                    </div>
                    <select className="select select-bordered w-full max-w-xs" value={studentId} onChange={e => setStudentId(e.target.value)}>
                        <option value="">All</option>
                        {students.map((e, i) => (
                            <option value={e.id} key={i}>{e.nickname}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className='flow-root'>
                <table className="w-full">
                    <thead className="border-b border-base-300">
                        <tr className='text-sm font-semibold'>
                            <th scope="col" className="py-3 text-left">
                                Id
                            </th>
                            <th scope="col" className="py-3 text-left">
                                Teacher
                            </th>
                            <th scope="col" className="py-3 text-left">
                                Student
                            </th>
                            <th scope="col" className="py-3 text-left">
                                Start At
                            </th>
                            <th scope="col" className="py-3 text-left">
                                Finish At
                            </th>
                            <th scope="col" className="py-3 text-left">
                                Status
                            </th>
                            <th scope="col" className="py-3 text-left">
                                Feedback
                            </th>
                            <th scope="col" className="py-3 text-left">
                                Package
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {classLogs.length == 0 && (
                            <tr className="border-b border-base-300 p-3">
                                No class found
                            </tr>
                        )}
                        {classLogs.map((e, i) => (
                            <tr className="border-b border-base-300" key={i}>
                                <td className="py-3 text-left text-sm uppercase">
                                    {e.id}
                                </td>
                                <td className="py-3 text-left text-sm">
                                    {e.expand?.cp_teacher.nickname}
                                </td>
                                <td className="py-3 text-left text-sm">
                                    {e.expand?.student.nickname}
                                </td>
                                <td className="py-3 text-left text-sm">
                                    {e.start_at ? getDateInDayMonthYearFormat(e.start_at) : "-"} {e.start_at ? getTimeIn12HourFormat(e.start_at) : ""}
                                </td>
                                <td className="py-3 text-left text-sm">
                                    {e.finish_at ? getDateInDayMonthYearFormat(e.finish_at) : "-"} {e.finish_at ? getTimeIn12HourFormat(e.finish_at) : ""}
                                </td>
                                <td className="py-3 text-left text-sm">
                                    {e.finished ? "Finished" : (e.started ? "Started" : "Pending")}
                                </td>
                                <td className="py-3 text-left text-sm">
                                    {e.feedback}
                                </td>
                                <td className="py-3 text-left text-sm">
                                    {e.expand?.student.expand.monthly_package.name} ({e.expand?.student.expand.monthly_package.class_mins} Mins)
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminClassLogsList