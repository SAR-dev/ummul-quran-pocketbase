import { useEffect, useState } from 'react'
import { usePocket } from '../contexts/PocketContext'
import { getDateInDayMonthYearFormat } from '../helpers/calendar';
import { InvoiceListResponseType } from '../types/extend'
import { useNotification } from '../contexts/NotificationContext'
import { NotificationType } from '../types/notification'
import { Link } from 'react-router-dom';

const StudentInvoiceList = () => {
    const { token } = usePocket()
    const notification = useNotification()
    const [invoices, setInvoices] = useState<InvoiceListResponseType[]>([])

    useEffect(() => {
        fetchStudentInvoices()
    }, [token])

    const fetchStudentInvoices = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/get-student-invoices`, {
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
            .then(res => setInvoices(res))
            .catch(() => {
                notification.add({
                    title: "Error Occured",
                    message: "There was an error performing the request. Please try again later..",
                    status: NotificationType.ERROR,
                })
            })
    }


    return (
        <div className='card border-2 border-base-300 bg-base-100'>
            <div className="w-full font-semibold py-3 px-5 border-b border-base-300">
                Issued Invoices
            </div>
            <div className="flex flex-col divide-y divide-base-300 w-full">
                {invoices.map((invoice, i) => (
                    <div className="grid grid-cols-5" key={i}>
                        <div className='py-3 px-5 font-semibold'>
                            {getDateInDayMonthYearFormat(invoice.created)}
                        </div>
                        <div className='py-3 px-5'>{invoice.total_classes} Classes</div>
                        <div className='py-3 px-5'>{invoice.due_amount} TK</div>
                        <div className='py-3 px-5'>
                            {invoice.paid_amount > 0 ? (
                                <div className='uppercase w-20 btn btn-success btn-sm no-animation'>Paid</div>
                            ) : (
                                <div className='uppercase w-20 btn btn-error btn-sm no-animation'>Unpaid</div>
                            )}
                        </div>
                        <div className='py-3 px-5 gap-3 flex justify-end'>
                            <Link to={`/student/invoices/${invoice.id}`} className="btn btn-sm">See Details</Link>
                            <a target='_blank' href={`${import.meta.env.VITE_API_URL}/student-receipt/${invoice.id}`} className="btn btn-info btn-sm">View Receipt</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StudentInvoiceList