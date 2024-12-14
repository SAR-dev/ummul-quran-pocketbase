import { Link, useNavigate, useParams } from 'react-router-dom';
import NavLayout from '../layouts/NavLayout'
import { useEffect, useState } from 'react';
import { ClassLogsResponse } from '../types/pocketbase';
import { TexpandStudentWithPackage } from '../types/extend';
import { usePocket } from '../contexts/PocketContext';
import { getDateInDayMonthYearFormat, getTimeIn12HourFormat } from '../helpers/calendar';
import { getImageUrl } from '../helpers/base';
import WhatsAppButton from '../components/WhatsAppButton';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useNotification } from '../contexts/NotificationContext';
import { NotificationType } from '../types/notification';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import TimeViewer from '../components/TimeViewer';

export const ClassDetails = () => {
    const { id = "" } = useParams();
    const navigate = useNavigate()
    const notification = useNotification()
    const [isLoading, setIsLoading] = useState(false)
    const { getClassLogDataById, token, incRefresh, refresh, packages } = usePocket()

    const [classLog, setClassLog] = useState<ClassLogsResponse<TexpandStudentWithPackage>>()
    const [packageId, setpackageId] = useState("")

    const [feedback, setFeedback] = useState("")
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
    const [editPackage, setEditPackage] = useState(false)

    useEffect(() => {
        if (id.length == 0) return;

        getClassLogDataById({ id }).then(res => {
            setClassLog(res)
            setpackageId(res.expand?.student.monthly_package ?? "")
        })
    }, [id, refresh])

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
            .then(() => incRefresh())
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
            body: JSON.stringify({ id, feedback, monthly_package_id: packageId }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                incRefresh()
                setShowFeedbackModal(false)
            })
            .catch(() => {
                notification.add({
                    title: "Error Occured",
                    message: "There was an error performing the request. Please try again later..",
                    status: NotificationType.ERROR,
                })
            })
            .finally(() => setIsLoading(false));
    }

    const handleFinishClass = () => {
        setShowFeedbackModal(true)
        setEditPackage(false)
    }

    return (
        <NavLayout>
            <div className="p-5 md:p-16 w-full">
                {classLog && (
                    <div className="card flex-col border border-base-300 p-10 max-w-[30rem] shadow flex-shrink-0 mx-auto bg-base-100">
                        <div className="w-full flex justify-center">
                            <img className='h-28 w-28 object-cover rounded-full ring-2 ring-base-300 ring-offset-8' src={getImageUrl({ collectionId: classLog.expand?.student.expand.user.collectionId, dataId: classLog.expand?.student.expand.user.id, image: classLog.expand?.student.expand.user.avatar })} alt="" />
                        </div>
                        <div className="flex flex-col gap-3 mt-5">
                            <div className="w-full text-center text-xl font-semibold">
                                {classLog.expand?.student.nickname}
                            </div>
                            <div className="flex justify-center">
                                <WhatsAppButton mobile_no={classLog.expand?.student.mobile_no} />
                            </div>
                            <div className="flex justify-center">
                                {classLog.expand?.student.expand.user.location}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-8">
                            <div className="card border border-base-300">
                                <div className="grid grid-cols-2 divide-x divide-base-300 border-b border-base-300">
                                    <div className='p-3 font-semibold text-center'>Start Time</div>
                                    <div className='p-3 font-semibold text-center'>Finish Time</div>
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-base-300">
                                    <div className='p-3 text-center'>
                                        <div>
                                            <TimeViewer dateString={classLog.finish_at}>
                                                {getDateInDayMonthYearFormat(classLog.start_at)}
                                            </TimeViewer>
                                        </div>
                                        <div>
                                            <TimeViewer dateString={classLog.finish_at}>
                                                {getTimeIn12HourFormat(classLog.start_at)}
                                            </TimeViewer>
                                        </div>
                                    </div>
                                    <div className='p-3 font-semibold text-center'>
                                        <div>
                                            <TimeViewer dateString={classLog.finish_at}>
                                                {classLog.finish_at ? getDateInDayMonthYearFormat(classLog.finish_at) : "Pending"}
                                            </TimeViewer>
                                        </div>
                                        <div>
                                            <TimeViewer dateString={classLog.finish_at}>
                                                {classLog.finish_at ? getTimeIn12HourFormat(classLog.finish_at) : ""}
                                            </TimeViewer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-center">
                                {!classLog.started && !classLog.finished && (
                                    <button className="btn btn-icon btn-primary" disabled={isLoading} onClick={startClass}>
                                        {isLoading && <div className="loading w-5 h-5" />}
                                        Start Class
                                    </button>
                                )}
                                {classLog.started && !classLog.finished && (
                                    <Link to={classLog.expand?.student.class_link ?? ""} target='_blank' className="btn btn-info">Open Class</Link>
                                )}
                                {classLog.started && !classLog.finished && (
                                    <button className="btn btn-icon btn-success btn-icon" disabled={isLoading} onClick={handleFinishClass}>
                                        {isLoading && <div className="loading w-5 h-5" />}
                                        Submit Report
                                    </button>
                                )}
                                {classLog.finished && (
                                    <button className="btn btn-info btn-icon" onClick={() => navigate(-1)}>
                                        <ArrowLeftIcon className='h-4 w-4' />
                                        Go Back
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <Dialog open={showFeedbackModal} onClose={() => { }} className="relative z-20">
                    <DialogBackdrop className="fixed inset-0 bg-base-content/25" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                        <DialogPanel className="card p-4 bg-base-100 w-3/4 md:w-[30rem]">
                            <div className='flex flex-col gap-3 p-5'>
                                <div className='flex justify-center'>
                                    <div className="text-4xl">📣</div>
                                </div>
                                <div className='text-center text-xl font-medium'>Class Report Required</div>
                                <div className="flex flex-col gap-3">
                                    <div className='flex flex-col gap-1'>
                                        <textarea
                                            className="textarea textarea-bordered w-full textarea-sm resize-none leading-7"
                                            rows={7}
                                            value={feedback}
                                            onChange={e => setFeedback(e.target.value)}
                                            placeholder="Write feedback here..."
                                        />
                                        <div className="text-xs text-red-500">Minimum 10 characters required</div>
                                    </div>
                                    <div className="flex w-full items-center gap-2">
                                        <select
                                            value={packageId}
                                            onChange={(e) => setpackageId(e.target.value)}
                                            className="select select-bordered select-sm flex-1"
                                            disabled={!editPackage}
                                        >
                                            <option disabled selected>Select Package</option>
                                            {packages.map((e, i) => (
                                                <option value={e.id} key={i}>{e.name} - {e.class_mins} Min</option>
                                            ))}
                                        </select>
                                        {!editPackage ? (
                                            <button className="btn btn-sm w-36" onClick={() => setEditPackage(true)}>Change Package</button>
                                        ) : (
                                            <button className="btn btn-sm w-36" onClick={() => {
                                                setEditPackage(false)
                                                setpackageId(classLog?.expand?.student.monthly_package ?? "")
                                            }}>Reset Package</button>
                                        )}
                                    </div>
                                    <div className='flex gap-3 justify-between w-full'>
                                        <button className="btn btn-neutral" disabled={isLoading} onClick={() => setShowFeedbackModal(false)}>Go Back</button>
                                        <button className="btn btn-icon btn-success w-44" disabled={feedback.length <= 10 || isLoading} onClick={finishClass}>
                                            {isLoading && <div className="loading w-5 h-5" />}
                                            Submit & Finish
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </div>
        </NavLayout>
    )
}
