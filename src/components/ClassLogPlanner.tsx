import { FormEvent, useMemo, useState } from 'react';
import { usePocket } from '../contexts/PocketContext';
import { constants } from '../stores/constantStore';
import "react-multi-date-picker/styles/layouts/mobile.css";
import { Calendar, DateObject } from "react-multi-date-picker";
import { getTimeOffset } from '../helpers/calendar';
import { PlayIcon, StopIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import { NotificationType } from '../types/notification';

interface ClassLogDataType {
    student: string;
    routine: {
        date: string;
        start_at: string;
        finish_at: string;
    }[];
}

interface ClassLogPayloadType {
    student: string;
    routine: {
        date: string;
        start_at: string;
        finish_at: string | null;
    }[];
    offset_hh_mm: string;
}

export const ClassLogPlanner = () => {
    const navigate = useNavigate()
    const notification = useNotification()
    const { students, token } = usePocket()
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<ClassLogDataType>({
        student: "",
        routine: []
    })

    const sortedRoutine = useMemo(() => {
        return [...data.routine].sort((_a, _b) => {

            const a = new Date(_a.date)
            const b = new Date(_b.date)

            // Compare years
            if (a.getFullYear() !== b.getFullYear()) return a.getFullYear() - b.getFullYear();

            // Compare months
            if (a.getMonth() !== b.getMonth()) return a.getMonth() - b.getMonth();

            // Compare days
            return a.getDate() - b.getDay();
        });
    }, [data.routine]);

    const handleClassDates = (dates: DateObject[]) => {
        const routine = data.routine
        setData({
            ...data, routine: dates.map((newDate, index) => {
                const existingPlan = routine[index] || {
                    start_at: "",
                    finish_at: "",
                };

                return {
                    ...existingPlan,
                    date: newDate.format("YYYY-MM-DD"),
                };
            })
        })
    };

    const handleOnSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt?.preventDefault();

        if (data.student.length == 0) {
            alert("Select stuent")
            return;
        }

        const errorRoutines = data.routine.filter(routine =>
            Number(routine.finish_at.replace(":", "")) != 0 &&
            (Number(routine.finish_at.replace(":", "")) < Number(routine.start_at.replace(":", "")))
        )

        if (errorRoutines.length > 0) {
            const errorDays = errorRoutines.map(e => e.date).join(", ")
            alert("Fix class times for " + errorDays)
            return;
        }

        const payload: ClassLogPayloadType = {
            student: data.student,
            routine: data.routine.filter(e => e.start_at.length > 0).map(c => {
                return { ...c, finish_at: c.finish_at.length > 0 ? c.finish_at : null }
            }),
            offset_hh_mm: getTimeOffset()
        }

        setIsLoading(true)
        fetch(`${import.meta.env.VITE_API_URL}/api/class-logs/create-by-dates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ?? ""
            },
            body: JSON.stringify(payload),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                notification.add({
                    title: "Class Created",
                    message: "The requested classes has been created. Please check the routine",
                    status: NotificationType.SUCCESS,
                })
                navigate("/teacher")
            })
            .catch(() => {
                notification.add({
                    title: "Error Occured",
                    message: "There was an error performing the request. Please try again later..",
                    status: NotificationType.ERROR,
                })
            })
            .finally(() => setIsLoading(false));
    };

    const handleDelete = (date: DateObject) => {
        setData({ ...data, routine: data.routine.filter(e => (new DateObject(e.date).format() != date.format())) })
    }

    const handleStartTimeChange = (date: DateObject, time: string) => {
        if (!constants.REGEX_PATTERN.TIME.test(time)) return;

        const routine = data.routine;
        setData({
            ...data, routine: routine.map(plan => {
                const plan_date = new DateObject(plan.date)
                // Check if the plan's date matches the provided date
                if (
                    plan_date.year === date.year &&
                    plan_date.month.number === date.month.number &&
                    plan_date.day === date.day
                ) {
                    // Return a new object with the updated startTime
                    return {
                        ...plan,
                        start_at: time
                    };
                }
                // Return the plan unchanged if the date doesn't match
                return plan;
            })
        })
    };

    const handleEndTimeChange = (date: DateObject, time: string) => {
        if (!constants.REGEX_PATTERN.TIME.test(time)) return;

        const routine = data.routine;
        setData({
            ...data, routine: routine.map(plan => {
                const plan_date = new DateObject(plan.date)
                // Check if the plan's date matches the provided date
                if (
                    plan_date.year === date.year &&
                    plan_date.month.number === date.month.number &&
                    plan_date.day === date.day
                ) {
                    // Return a new object with the updated startTime
                    return {
                        ...plan,
                        finish_at: time
                    };
                }
                // Return the plan unchanged if the date doesn't match
                return plan;
            })
        })
    };

    return (
        <div>
            <form className='flex flex-col gap-8' onSubmit={handleOnSubmit}>
                <div>
                    <div className='text-sm mb-2 font-semibold'>Select a student from your student list</div>
                    <select
                        className="select select-bordered w-full md:max-w-xs"
                        value={data.student}
                        onChange={e => setData({ ...data, student: e.target.value })}
                    >
                        <option value="" disabled selected>Select Student</option>
                        {students.map((student, i) => (
                            <option value={student.id} key={i}>{student.nickname}</option>
                        ))}
                    </select>
                </div>
                {data.student.length > 0 && (
                    <>
                        <div>
                            <div className='text-sm mb-2 font-semibold'>Select dates for class</div>
                            <Calendar
                                value={data.routine.map(e => new DateObject(e.date))}
                                onChange={handleClassDates}
                                multiple
                                numberOfMonths={1}
                                minDate={new Date()}
                                shadow={false}
                            />
                        </div>

                        <div>
                            {sortedRoutine.length > 0 && (
                                <div className='text-sm mb-2 font-semibold'>Pick a time for class</div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                {sortedRoutine.map((classPlan, i) => (
                                    <div className='card p-3 border border-base-300 flex-col gap-3' key={i}>
                                        <div className="flex justify-between w-full items-center">
                                            <div className="font-medium text-sm">{(new DateObject(classPlan.date)).format("dddd, DD MMMM YYYY")}</div>
                                            <button className="btn btn-xs" onClick={() => handleDelete(new DateObject(classPlan.date))}>Delete</button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <label className="input input-sm input-bordered flex items-center gap-2">
                                                <PlayIcon className='h-4 w-4' />
                                                <input
                                                    type="time"
                                                    value={classPlan.start_at}
                                                    className='grow'
                                                    onChange={e => handleStartTimeChange(new DateObject(classPlan.date), e.target.value)}
                                                />
                                            </label>
                                            <label className="input input-sm input-bordered flex items-center gap-2">
                                                <StopIcon className='h-4 w-4' />
                                                <input
                                                    type="time"
                                                    value={classPlan.finish_at}
                                                    className='grow'
                                                    onChange={e => handleEndTimeChange(new DateObject(classPlan.date), e.target.value)}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                <button 
                    type="submit" 
                    disabled={data.student.length == 0 || isLoading} 
                    className="btn btn-info btn-icon w-48"
                >
                    {isLoading && <div className="loading w-5 h-5" />}
                    Submit Class Plans
                </button>
            </form>
        </div>
    )
}
