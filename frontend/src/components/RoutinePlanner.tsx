import { FormEvent, useState } from 'react';
import { usePocket } from '../contexts/PocketContext';
import { constants } from '../stores/constantStore';
import { getTimeOffset } from '../helpers/calendar';
import classNames from 'classnames';
import { PlayIcon, StopIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import { NotificationType } from '../types/notification';

interface RoutineDataType {
    student: string;
    routine: {
        weekday_index: number;
        start_at: string;
        finish_at: string;
        activate: boolean
    }[];
    start_date: string;
    finish_date: string;
}

interface RoutinePayloadType {
    student: string;
    routine: {
        weekday_index: number;
        start_at: string;
        finish_at: string | null;
    }[];
    start_date: string;
    finish_date: string;
    offset_hh_mm: string;
    new_routine: boolean;
}

export const RoutinePlanner = () => {
    const navigate = useNavigate()
    const notification = useNotification()
    const { students, token } = usePocket()
    const [isLoading, setIsLoading] = useState(false)
    const [replaceRoutine, setReplaceRoutine] = useState(false)
    const [data, setData] = useState<RoutineDataType>({
        student: "",
        start_date: new Date().toISOString().slice(0, 10),
        finish_date: new Date().toISOString().slice(0, 10),
        routine: constants.DAY_NAMES.map((_, i) => {
            return {
                weekday_index: i,
                start_at: "",
                finish_at: "",
                activate: false
            }
        })
    })

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
            const errorDays = errorRoutines.map(e => constants.DAY_NAMES[e.weekday_index]).join(", ")
            alert("Fix class times for " + errorDays)
            return;
        }

        const start_date = new Date(data.start_date)
        const finish_date = new Date(data.finish_date)
        const yesterday_date = new Date(new Date().setDate(new Date().getDate() - 1))

        if ((finish_date.getTime() <= start_date.getTime()) || start_date.getTime() < yesterday_date.getTime()) {
            alert("Fix date range.")
            return;
        }

        const days_difference = (finish_date.getTime() - start_date.getTime()) / (1000 * 3600 * 24);
        if (days_difference > 366) {
            alert("You can create routine for maximum 1 year")
            return;
        }

        const payload: RoutinePayloadType = {
            student: data.student,
            routine: data.routine.filter(e => e.start_at.length > 0 && e.activate).map(c => {
                return { ...c, finish_at: c.finish_at.length > 0 ? c.finish_at : null }
            }),
            start_date: data.start_date,
            finish_date: data.finish_date,
            offset_hh_mm: getTimeOffset(),
            new_routine: replaceRoutine
        }

        setIsLoading(true)
        fetch(`${import.meta.env.VITE_API_URL}/api/class-logs/create-by-routine`, {
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

    const handleStartTimeChange = ({ start_at, weekday_index }: { start_at: string, weekday_index: number }) => {
        if (!constants.REGEX_PATTERN.TIME.test(start_at)) return;
        const routine = data.routine.map(e => {
            if (e.weekday_index == weekday_index) {
                return {
                    weekday_index: e.weekday_index,
                    start_at: start_at,
                    finish_at: e.finish_at,
                    activate: e.activate
                }
            }
            return e;
        })
        setData({ ...data, routine })
    };

    const handleEndTimeChange = ({ finish_at, weekday_index }: { finish_at: string, weekday_index: number }) => {
        if (!constants.REGEX_PATTERN.TIME.test(finish_at)) return;
        const routine = data.routine.map(e => {
            if (e.weekday_index == weekday_index) {
                return {
                    weekday_index: e.weekday_index,
                    start_at: e.start_at,
                    finish_at: finish_at,
                    activate: e.activate
                }
            }
            return e;
        })
        setData({ ...data, routine })
    };

    const toogleDayButton = (weekday_index: number) => {
        const routine = data.routine.map(e => {
            if (e.weekday_index == weekday_index) {
                return {
                    weekday_index: e.weekday_index,
                    start_at: e.start_at,
                    finish_at: e.finish_at,
                    activate: !e.activate
                }
            }
            return e;
        })
        setData({ ...data, routine })
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
                {data.student.length > 0 && (<>
                    <div>
                        <div className='text-sm mb-2 font-semibold'>Pick a date and time for class</div>
                        <div className="grid grid-cols-1 md:grid-cols-7 gap-5">
                            {data.routine.map((routine, i) => (
                                <div className='card flex-col gap-3 p-2 border border-base-300' key={i}>
                                    <button
                                        type='button'
                                        className={classNames({
                                            'btn w-full h-32 uppercase': true,
                                            'btn-info': routine.activate
                                        })}
                                        onClick={() => toogleDayButton(routine.weekday_index)}
                                    >
                                        {constants.DAY_NAMES[i]}
                                    </button>
                                    <label className="input input-sm input-bordered flex items-center gap-2">
                                        <PlayIcon className='h-4 w-4' />
                                        <input
                                            disabled={!routine.activate}
                                            type="time"
                                            value={routine.start_at}
                                            className='grow'
                                            onChange={e => handleStartTimeChange({
                                                start_at: e.target.value,
                                                weekday_index: routine.weekday_index
                                            })}
                                        />
                                    </label>
                                    <label className="input input-sm input-bordered flex items-center gap-2">
                                        <StopIcon className='h-4 w-4' />
                                        <input
                                            disabled={!routine.activate}
                                            type="time"
                                            value={routine.finish_at}
                                            className='grow'
                                            onChange={e => handleEndTimeChange({
                                                finish_at: e.target.value,
                                                weekday_index: routine.weekday_index
                                            })}
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className='text-sm mb-2 font-semibold'>Select date range for this routine</div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <label className="input input-bordered flex items-center gap-2">
                                <PlayIcon className='h-5 w-5' />
                                <input
                                    type="date"
                                    className='grow'
                                    value={data.start_date}
                                    min={(new Date()).toISOString().slice(0, 10)}
                                    onChange={e => setData({ ...data, start_date: e.target.value })}
                                />
                            </label>
                            <div className='hidden md:flex items-center'>
                                <ArrowRightIcon className='h-5 w-5' />
                            </div>
                            <label className="input input-bordered flex items-center gap-2">
                                <StopIcon className='h-5 w-5' />
                                <input
                                    type="date"
                                    className='grow'
                                    value={data.finish_date}
                                    min={(new Date()).toISOString().slice(0, 10)}
                                    onChange={e => setData({ ...data, finish_date: e.target.value })}
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <div className='text-sm mb-2 font-semibold'>Do you want to replace the routine if exists ? Otherwise it will add a routine to existing one.</div>
                        <div className="flex gap-5">
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text mr-2">Yes</span>
                                    <input type="radio" className="radio checked:bg-info" checked={replaceRoutine} onChange={e => setReplaceRoutine(e.target.checked)} />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text mr-2">No</span>
                                    <input type="radio" className="radio checked:bg-info" checked={!replaceRoutine} onChange={e => setReplaceRoutine(!e.target.checked)} />
                                </label>
                            </div>
                        </div>
                    </div>
                </>)}

                <button 
                    type="submit" 
                    disabled={data.student.length == 0 || isLoading} 
                    className="btn btn-icon btn-info w-48"
                >
                    {isLoading && <div className="loading w-5 h-5" />}
                    Submit Routine
                </button>
            </form>
        </div>
    )
}
