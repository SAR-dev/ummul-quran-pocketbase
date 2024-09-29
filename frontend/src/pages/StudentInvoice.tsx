import { useEffect, useRef, useState } from 'react'
import { usePocket } from '../contexts/PocketContext'
import NavLayout from '../layouts/NavLayout'
import { getDateFromString } from '../helpers/calendar';
import { StudentInvoiceResponseType } from '../types/extend';
import { useNotification } from '../contexts/NotificationContext'
import { NotificationType } from '../types/notification'
import { useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print';
import { PrinterIcon } from '@heroicons/react/24/solid';

const StudentInvoice = () => {
    const { id = "" } = useParams();
    const { token, student } = usePocket()
    const notification = useNotification()
    const [invoice, setInvoice] = useState<StudentInvoiceResponseType>()
    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        content: () => contentRef.current,
        bodyClass: "p-5"
    });

    useEffect(() => {
        if (id.length == 0) return;
        fetchStudentInvoiceById()
    }, [token, id])

    const fetchStudentInvoiceById = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/get-student-invoices/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ?? ""
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(res => setInvoice(res))
            .catch(() => {
                notification.add({
                    title: "Error Occured",
                    message: "There was an error performing the request. Please try again later..",
                    status: NotificationType.ERROR,
                })
            })
    }


    return (
        <NavLayout>
            {student && invoice && (
                <div className='max-w-[40rem] mx-auto mt-5'>
                    <div className="flex justify-center mb-5">
                        <button className="btn btn-info btn-sm btn-icon" onClick={handlePrint}>
                            <PrinterIcon className='h-4 w-4' />
                            Print Invoice
                        </button>
                    </div>
                    <div className="bg-base-100 p-5 w-full" ref={contentRef}>
                        <div className="w-full flex gap-10">
                            <div className='flex-1'>
                                <img
                                    src="https://merakiui.com/images/logo.svg"
                                    height={50}
                                    width={50}
                                />
                            </div>
                            <div className="flex flex-col text-sm">
                                <div className="font-semibold">Invoice Type</div>
                                <div>Student</div>
                            </div>
                            <div className="flex flex-col text-sm">
                                <div className="font-semibold">Billed To</div>
                                <div>{student.nickname}</div>
                            </div>
                            <div className="flex flex-col text-sm">
                                <div className="font-semibold">Billed AT</div>
                                <div>{getDateFromString(invoice.created)}</div>
                            </div>
                        </div>
                        <div className="mt-8 flow-root">
                            <table className="w-full">
                                <colgroup>
                                    <col className="w-1/4" />
                                    <col className="w-1/4" />
                                    <col className="w-1/4" />
                                    <col className="w-1/4" />
                                </colgroup>
                                <thead className="border-b border-base-300">
                                    <tr className='text-sm font-semibold'>
                                        <th
                                            scope="col"
                                            className="py-3 text-left"
                                        >
                                            Class Mins
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 text-right"
                                        >
                                            Class Price
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 text-right"
                                        >
                                            Total Classes
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3 pl-3 text-right"
                                        >
                                            Total Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.class_logs.map((group, i) => (
                                        <tr className="border-b border-base-300" key={i}>
                                            <td className="py-3 text-left text-sm text-base-content/75">
                                                {group.class_mins} Min
                                            </td>
                                            <td className="px-3 text-right text-sm text-base-content/75">
                                                {group.students_price} TK
                                            </td>
                                            <td className="px-3 text-right text-sm text-base-content/75">
                                                {group.total_classes}
                                            </td>
                                            <td className="pl-3 text-right text-sm text-base-content/75">
                                                {group.students_price * group.total_classes} TK
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th
                                            scope="row"
                                            colSpan={3}
                                            className="pr-3 pt-6 text-right text-sm font-normal text-base-content/75 table-cell"
                                        >
                                            Subtotal
                                        </th>
                                        <td className="pl-3 pt-6 text-right text-sm text-base-content/75">
                                            {invoice.due_amount} TK
                                        </td>
                                    </tr>
                                    <tr>
                                        <th
                                            scope="row"
                                            colSpan={3}
                                            className="pr-3 pt-4 text-right text-sm font-normal text-base-content/75 table-cell"
                                        >
                                            Discount
                                        </th>
                                        <td className="pl-3 pt-4 text-right text-sm text-base-content/75">
                                            0
                                        </td>
                                    </tr>
                                    <tr>
                                        <th
                                            scope="row"
                                            colSpan={3}
                                            className="pr-3 pt-4 text-right text-sm font-semibold table-cell"
                                        >
                                            Total
                                        </th>
                                        <td className="pl-3 pt-4 text-right text-sm font-semibold">
                                            {invoice.due_amount} TK
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="border-t border-base-300 pt-4 text-xs text-base-content/75 text-center mt-10 uppercase">
                            INVOICE NO: STUDENT-{invoice.id}
                        </div>
                    </div>
                </div>
            )}
        </NavLayout>
    )
}

export default StudentInvoice