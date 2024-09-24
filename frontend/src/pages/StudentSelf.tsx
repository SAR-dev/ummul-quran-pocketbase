import { useEffect, useState } from 'react'
import StudentInfo from '../components/StudentInfo'
import { usePocket } from '../contexts/PocketContext'
import NavLayout from '../layouts/NavLayout'
import { months } from '../helpers/calendar'
import { InvoiceResponseType } from '../types/extend'
import { useNotification } from '../contexts/NotificationContext'
import { NotificationType } from '../types/notification'

const StudentSelf = () => {
    const { token } = usePocket()
    const notification = useNotification()
    const [invoices, setInvoices] = useState<InvoiceResponseType[]>([])

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
        <NavLayout>
            <div className="grid grid-cols-1 md:grid-cols-7 p-5 md:p-16 gap-10 w-full">
                <div className="col-span-1 md:col-span-5">
                    <div className="grid grid-cols-1 gap-10">
                        <div className='card border-2 border-base-300 bg-base-100'>
                            <div className="w-full font-semibold py-3 px-5 border-b border-base-300">
                                Issued Invoices
                            </div>
                            <div className="flex flex-col divide-y divide-base-300 w-full">
                                {invoices.map((invoice, i) => (
                                    <div className="grid grid-cols-5" key={i}>
                                        <div className='py-3 px-5 font-semibold'>
                                            {months.find(e => e.index == invoice.month)?.shortName} {invoice.year}
                                        </div>
                                        <div className='py-3 px-5'>{invoice.total_classes} Classes</div>
                                        <div className='py-3 px-5'>{invoice.total_price} TK</div>
                                        <div className='py-3 px-5'>
                                            {invoice.paid ? (
                                                <div className='uppercase w-20 btn btn-success btn-sm no-animation'>Paid</div>
                                            ) : (
                                                <div className='uppercase w-20 btn btn-error btn-sm no-animation'>Unpaid</div>
                                            )}
                                        </div>
                                        <div className='py-3 px-5 flex justify-end'>
                                            <button className="btn btn-info btn-sm">View Receipt</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <div className="grid grid-cols-1 gap-10">
                        <StudentInfo />
                    </div>
                </div>
            </div>
        </NavLayout>
    )
}

export default StudentSelf