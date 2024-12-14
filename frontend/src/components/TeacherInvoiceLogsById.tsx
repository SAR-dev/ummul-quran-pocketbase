import { useEffect, useState } from "react";
import { ClassLogsResponse, TeacherInvoicesResponse } from "../types/pocketbase";
import { TexpandStudentWithPackage, TexpandTeacher } from "../types/extend";
import { usePocket } from "../contexts/PocketContext";
import { useParams } from "react-router-dom";
import { getDateFromString, getTimeIn12HourFormat } from "../helpers/calendar";

const TeacherInvoiceLogsById = () => {
    const { id = "" } = useParams();

    const { refresh, user, getClassLogsByTeacherInvoiceId, getTeacherInvoiceById } = usePocket();
    const [classLogs, setClassLogs] = useState<ClassLogsResponse<TexpandStudentWithPackage>[]>([])
    const [invoice, setInvoice] = useState<TeacherInvoicesResponse<TexpandTeacher>>()

    useEffect(() => {
        if (!user) return;

        getTeacherInvoiceById({ id }).then(res => setInvoice(res[0]));
        getClassLogsByTeacherInvoiceId({ teacher_invoice: id }).then(res => setClassLogs(res))
    }, [id, refresh])
    return (
        <div className="grid grid-cols-1 gap-5">
            {invoice && (
                <div className="card flex-col divide-y divide-base-300 border border-base-300 mt-5">
                    <div className="grid grid-cols-5 gap-3 text-base-content/50">
                        <div className="p-3 font-semibold">
                            Teacher
                        </div>
                        <div className="p-3 font-semibold">
                            Invoice
                        </div>
                        <div className="p-3 font-semibold">
                            Issue Date
                        </div>
                        <div className="p-3 font-semibold">
                            Paid / Due Amount
                        </div>
                        <div className="p-3 font-semibold">
                            Status
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                        <div className="p-3">
                            {invoice.expand?.teacher.nickname}
                        </div>
                        <div className="p-3 uppercase">
                            {invoice.id}
                        </div>
                        <div className="p-3">
                            {getDateFromString(invoice.created)}
                        </div>
                        <div className="p-3">
                            {invoice.paid_amount} / {invoice.due_amount} TK
                        </div>
                        <div className="p-3">
                            {invoice.paid_amount > 0 ? (
                                <div className='uppercase w-20 btn btn-success btn-sm no-animation'>Paid</div>
                            ) : (
                                <div className='uppercase w-20 btn btn-error btn-sm no-animation'>Unpaid</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="card flex-col divide-y divide-base-300 border border-base-300 mt-5">
                <div className="grid grid-cols-5 gap-3 text-base-content/50">
                    <div className="p-3 font-semibold">
                        Student
                    </div>
                    <div className="p-3 font-semibold">
                        Start At
                    </div>
                    <div className="p-3">
                        Finish At
                    </div>
                    <div className="p-3">
                        Package
                    </div>
                    <div className="p-3">
                        Price
                    </div>
                </div>
                {classLogs.map((e, i) => (
                    <div className="grid grid-cols-5 gap-3" key={i}>
                        <div className="p-3 font-semibold">
                            {e.expand?.student.nickname}
                        </div>
                        <div className="p-3">
                            {getDateFromString(e.start_at)} {getTimeIn12HourFormat(e.start_at)}
                        </div>
                        <div className="p-3">
                            {getDateFromString(e.finish_at)} {getTimeIn12HourFormat(e.finish_at)}
                        </div>
                        <div className="p-3">
                            {e.expand?.student.expand.monthly_package.name}, {e.expand?.student.expand.monthly_package.class_mins} Mins
                        </div>
                        <div className="p-3">
                            {e.expand?.student.expand.monthly_package.teachers_price} TK
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TeacherInvoiceLogsById