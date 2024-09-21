import { Link, useNavigate, useParams } from 'react-router-dom';
import NavLayout from '../layouts/NavLayout'
import { useEffect, useMemo, useState } from 'react';
import { ClassLogsResponse } from '../types/pocketbase';
import { TexpandStudentWithPackage } from '../types/extend';
import { usePocket } from '../contexts/PocketContext';
import { formatTimezoneOffset, getDateFromString, getTimeIn12HourFormat } from '../packages/EventCalendar/helpers/calendar';
import { getImageUrl } from '../packages/EventCalendar/helpers/base';
import WhatsAppButton from '../components/WhatsAppButton';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useNotification } from '../contexts/NotificationContext';
import { NotificationType } from '../types/notification';

export const ClassDetails = () => {
    const { id = "" } = useParams();
    const navigate = useNavigate()
    const notification = useNotification()
    const { getClassLogDataById, token, timeZones } = usePocket()

    const [classLog, setClassLog] = useState<ClassLogsResponse<TexpandStudentWithPackage>>()

    useEffect(() => {
        if (id.length == 0) return;

        getClassLogDataById({ id }).then(res => setClassLog(res))
    }, [id])

    const timezone = useMemo(() => {
        if (!classLog) return;
        return timeZones.find(e => e.id == classLog.expand?.student.expand.user.timezone)
    }, [classLog]);

    const startClass = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/class-logs/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ?? ""
            },
            body: JSON.stringify({ id }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => getClassLogDataById({ id }).then(res => setClassLog(res)))
            .catch(() => {
                notification.add({
                    title: "Error Occured",
                    message: "There was an error performing the request. Please try again later..",
                    status: NotificationType.ERROR,
                })
            });
    }

    const finishClass = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/class-logs/finish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ?? ""
            },
            body: JSON.stringify({ id }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => getClassLogDataById({ id }).then(res => setClassLog(res)))
            .catch(() => {
                notification.add({
                    title: "Error Occured",
                    message: "There was an error performing the request. Please try again later..",
                    status: NotificationType.ERROR,
                })
            });
    }

    return (
        <NavLayout>
            <div className="p-5 md:p-16 w-full">
                {classLog && (
                    <div className="card flex-col border border-base-300 px-5 py-10 w-96 shadow bg-base-200 flex-shrink-0 mx-auto">
                        <div className="w-full flex justify-center">
                            <img className='h-28 w-28 object-cover rounded-full ring-2 ring-base-300 ring-offset-8' src={getImageUrl({ collectionId: classLog.expand?.student.expand.user.collectionId, dataId: classLog.expand?.student.expand.user.id, image: classLog.expand?.student.expand.user.avatar })} alt="" />
                        </div>
                        <div className="w-full text-center mt-3 text-lg font-semibold">
                            {classLog.expand?.student.nickname}
                        </div>
                        <div className="my-3 flex justify-center">
                            <WhatsAppButton mobile_no={classLog.expand?.student.mobile_no} />
                        </div>
                        <div className="w-full text-center">
                            {classLog.expand?.student.expand.user.location}
                        </div>
                        <div className="text-xs w-full text-center">
                            UTC {formatTimezoneOffset(timezone?.offset)}
                        </div>
                        <div className="w-full flex justify-center text-xs mt-5">
                            {getDateFromString(classLog.start_at)} ({getTimeIn12HourFormat(classLog.start_at)} - {classLog.finish_at ? getTimeIn12HourFormat(classLog.finish_at) : "Pending"})
                        </div>
                        <div className="flex mt-2 gap-3 justify-center">
                            {!classLog.started && !classLog.completed && (
                                <button className="btn btn-sm btn-primary" onClick={startClass}>Start Class</button>
                            )}
                            {classLog.started && !classLog.completed && (
                                <Link to={classLog.expand?.student.class_link ?? ""} target='_blank' className="btn btn-sm btn-info">Open Class</Link>
                            )}
                            {classLog.started && !classLog.completed && (
                                <button className="btn btn-sm btn-success btn-icon" onClick={finishClass}>
                                    Finish Class
                                </button>
                            )}
                            {classLog.completed && (
                                <button className="btn btn-sm btn-info btn-icon" onClick={() => navigate(-1)}>
                                    <ArrowLeftIcon className='h-4 w-4' />
                                    Go Back
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </NavLayout>
    )
}
