import { useEffect, useState } from "react";
import { ClassLogsResponse, StudentInvoicesResponse } from "../types/pocketbase";
import { TexpandStudent, TexpandStudentWithPackageTeacher } from "../types/extend";
import { usePocket } from "../contexts/PocketContext";
import { useParams } from "react-router-dom";
import { getDateFromString, getTimeIn12HourFormat } from "../helpers/calendar";

const StudentInvoiceLogsById = () => {
    const { id = "" } = useParams();

    const { refresh, user, getClassLogsByStudentInvoiceId, getStudentInvoiceById } = usePocket();

    const [invoice, setInvoice] = useState<StudentInvoicesResponse<TexpandStudent>>()
    const [classLogs, setClassLogs] = useState<ClassLogsResponse<TexpandStudentWithPackageTeacher>[]>([])

    useEffect(() => {
        if (!user) return;

        getStudentInvoiceById({ id }).then(res => setInvoice(res[0]));
        getClassLogsByStudentInvoiceId({ student_invoice: id }).then(res => setClassLogs(res))
    }, [id, refresh])
    return (
        <div className="grid grid-cols-1 gap-5">
            {invoice && (
                <div className="card flex-col divide-y divide-base-300 border border-base-300 mt-5">
                    <div className="grid grid-cols-5 gap-3 text-base-content/50">
                        <div className="p-3 font-semibold">
                            Student
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
                            {invoice.expand?.student.nickname}
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
                        Teacher
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
                            {e.expand?.cp_teacher.nickname}
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
                            {e.expand?.student.expand.monthly_package.students_price} TK
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StudentInvoiceLogsById