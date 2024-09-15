import { FormEvent, useState } from 'react';
import { usePocket } from '../contexts/PocketContext';
import { constants } from '../constants';

interface DataType {
    student: string;
    routine: {
        weekday_index: number;
        start_at: string;
        finish_at: string;
    }[];
    start_date: Date;
    finish_date: Date;
}

interface RoutinePayloadType {
    student: string;
    routine: {
        weekday_index: number;
        start_at: string;
        finish_at: string | null;
    }[];
    start_date: Date;
    finish_date: Date;
}

export const ClassPlanner = () => {
    const { students } = usePocket()
    const [data, setData] = useState<DataType>({
        student: "",
        start_date: new Date(),
        finish_date: new Date(),
        routine: constants.dayNames.map((_, i) => {
            return {
                weekday_index: i,
                start_at: "",
                finish_at: ""
            }
        })
    })

    const handleOnSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt?.preventDefault();

        const errorRoutines = data.routine.filter(routine =>
            Number(routine.finish_at.replace(":", "")) != 0 &&
            (Number(routine.finish_at.replace(":", "")) < Number(routine.start_at.replace(":", "")))
        )

        if (errorRoutines.length > 0) {
            const errorDays = errorRoutines.map(e => constants.dayNames[e.weekday_index]).join(", ")
            alert("Fix class times for " + errorDays)
            return;
        }

        if (data.finish_date.getTime() <= data.start_date.getTime()) {
            alert("Fix date range.")
            return;
        }

        const payload: RoutinePayloadType = {
            student: data.student,
            routine: data.routine.filter(e => e.start_at.length > 0).map(c => {
                return { ...c, finish_at: c.finish_at.length > 0 ? c.finish_at : null }
            }),
            start_date: data.start_date,
            finish_date: data.finish_date
        }
        console.log(payload)
    };

    const handleStartTimeChange = ({ start_at, weekday_index }: { start_at: string, weekday_index: number }) => {
        if (!constants.REGEX_PATTERN.TIME.test(start_at)) return;
        const routine = data.routine.map(e => {
            if (e.weekday_index == weekday_index) {
                return {
                    weekday_index: e.weekday_index,
                    start_at: start_at,
                    finish_at: e.finish_at
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
                    finish_at: finish_at
                }
            }
            return e;
        })
        setData({ ...data, routine })
    };

    return (
        <section className="p-5">
            <div className="bg-base-200 p-2 rounded">
                <div className="text-xl mb-3 pb-3 border-b border-base-300">Class Planner</div>
                <form className='flex flex-col gap-3' onSubmit={handleOnSubmit}>
                    <select
                        className="select select-bordered w-full max-w-xs"
                        value={data.student}
                        onChange={e => setData({ ...data, student: e.target.value })}
                    >
                        <option value="" disabled selected>Select Student</option>
                        {students.map((student, i) => (
                            <option value={student.id} key={i}>{student.nickname}</option>
                        ))}
                    </select>
                    {data.routine.map((routine, i) => (
                        <div className="flex gap-5 p-3 rounded bg-base-100 items-center" key={i}>
                            <div className="w-20 flex-shrink-0">{constants.dayNames[i]}</div>
                            <input
                                type="time"
                                value={routine.start_at}
                                className='input input-bordered w-48'
                                onChange={e => handleStartTimeChange({
                                    start_at: e.target.value,
                                    weekday_index: routine.weekday_index
                                })}
                            />
                            <input
                                type="time"
                                value={routine.finish_at}
                                className='input input-bordered w-48'
                                onChange={e => handleEndTimeChange({
                                    finish_at: e.target.value,
                                    weekday_index: routine.weekday_index
                                })}
                            />
                        </div>
                    ))}
                    <input
                        type="date"
                        className='input input-bordered w-48'
                        value={data.start_date.toISOString().slice(0, 10)}
                        min={(new Date()).toISOString().slice(0, 10)}
                        onChange={e => setData({ ...data, start_date: new Date(e.target.value) })}
                    />
                    <input
                        type="date"
                        className='input input-bordered w-48'
                        value={data.finish_date.toISOString().slice(0, 10)}
                        min={(new Date()).toISOString().slice(0, 10)}
                        onChange={e => setData({ ...data, finish_date: new Date(e.target.value) })}
                    />
                    <button type="submit" className="btn btn-primary w-32">Submit</button>
                </form>
            </div>
        </section>
    )
}
