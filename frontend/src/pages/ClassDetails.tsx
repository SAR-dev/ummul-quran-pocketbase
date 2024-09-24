import { Link, useNavigate, useParams } from 'react-router-dom';
import NavLayout from '../layouts/NavLayout'
import { useEffect, useMemo, useState } from 'react';
import { ClassLogsResponse } from '../types/pocketbase';
import { TexpandStudentWithPackage } from '../types/extend';
import { usePocket } from '../contexts/PocketContext';
import { formatTimezoneOffset, getDateFromString, getTimeIn12HourFormat } from '../helpers/calendar';
import { getImageUrl } from '../helpers/base';
import WhatsAppButton from '../components/WhatsAppButton';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useNotification } from '../contexts/NotificationContext';
import { NotificationType } from '../types/notification';

export const ClassDetails = () => {
    const { id = "" } = useParams();
    const navigate = useNavigate()
    const notification = useNotification()
    const [isLoading, setIsLoading] = useState(false)
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
        setIsLoading(true)
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
            })
            .finally(() => setIsLoading(false));
    }

    const finishClass = () => {
        setIsLoading(true)
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
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <NavLayout>
            <div className="p-5 md:p-16 w-full">
                {classLog && (
                    <div className="card flex-col border border-base-300 p-10 max-w-[30rem] shadow flex-shrink-0 mx-auto bg-base-100">
                        <div className="w-full flex justify-center">
                            <img className='h-28 w-28 object-cover rounded-full ring-2 ring-base-300 ring-offset-8' src={getImageUrl({ collectionId: classLog.expand?.student.expand.user.collectionId, dataId: classLog.expand?.student.expand.user.id, image: classLog.expand?.student.expand.user.avatar })} alt="" />
                        </div>
                        <div className="w-full text-center mt-3 text-xl font-semibold">
                            {classLog.expand?.student.nickname}
                        </div>
                        <div className="my-5 flex justify-center">
                            <WhatsAppButton mobile_no={classLog.expand?.student.mobile_no} />
                        </div>
                        <div className="w-full text-center">
                            {classLog.expand?.student.expand.user.location}
                        </div>
                        <div className="w-full text-center">
                            UTC {formatTimezoneOffset(timezone?.offset)}
                        </div>
                        <div className="w-full flex justify-center mt-5">
                            {getDateFromString(classLog.start_at)} ({getTimeIn12HourFormat(classLog.start_at)} - {classLog.finish_at ? getTimeIn12HourFormat(classLog.finish_at) : "Pending"})
                        </div>
                        <div className="flex mt-5 gap-3 justify-center">
                            {!classLog.started && !classLog.completed && (
                                <button className="btn btn-icon btn-primary" disabled={isLoading} onClick={startClass}>
                                    {isLoading && <div className="loading w-5 h-5" />}
                                    Start Class
                                </button>
                            )}
                            {classLog.started && !classLog.completed && (
                                <Link to={classLog.expand?.student.class_link ?? ""} target='_blank' className="btn btn-info">Open Class</Link>
                            )}
                            {classLog.started && !classLog.completed && (
                                <button className="btn btn-icon btn-success btn-icon" disabled={isLoading} onClick={finishClass}>
                                    {isLoading && <div className="loading w-5 h-5" />}
                                    Finish Class
                                </button>
                            )}
                            {classLog.completed && (
                                <button className="btn btn-info btn-icon" onClick={() => navigate(-1)}>
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
