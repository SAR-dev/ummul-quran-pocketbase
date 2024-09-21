import { useParams } from 'react-router-dom';
import NavLayout from '../layouts/NavLayout'
import { useEffect, useMemo, useState } from 'react';
import { ClassLogsResponse } from '../types/pocketbase';
import { TexpandStudentWithPackage } from '../types/extend';
import { usePocket } from '../contexts/PocketContext';
import { formatTimezoneOffset } from '../packages/EventCalendar/helpers/calendar';
import { getImageUrl } from '../packages/EventCalendar/helpers/base';
import WhatsAppButton from '../components/WhatsAppButton';

export const ClassDetails = () => {
    const { id = "" } = useParams();
    const { getClassLogDataById, timeZones } = usePocket()

    const [classLog, setClassLog] = useState<ClassLogsResponse<TexpandStudentWithPackage>>()

    useEffect(() => {
        if (id.length == 0) return;

        getClassLogDataById({ id }).then(res => setClassLog(res))
    }, [id])

    const timezone = useMemo(() => {
        if (!classLog) return;
        return timeZones.find(e => e.id == classLog.expand?.student.expand.user.timezone)
    }, [classLog]
    );

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
                        <div className="mt-5 flex gap-3 justify-center">
                            {!classLog.started && !classLog.completed && (
                                <button className="btn btn-sm btn-primary">Start Class</button>
                            )}
                            {classLog.started && (
                                <button className="btn btn-sm btn-info">Open Class</button>
                            )}
                            {classLog.started && !classLog.completed && (
                                <button className="btn btn-sm btn-primary">Finish Class</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </NavLayout>
    )
}
