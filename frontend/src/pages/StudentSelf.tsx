import { useEffect, useState } from 'react'
import StudentInfo from '../components/StudentInfo'
import { usePocket } from '../contexts/PocketContext'
import NavLayout from '../layouts/NavLayout'
import { StudentInvoicesResponse } from '../types/pocketbase'
import { months } from '../helpers/calendar'

const StudentSelf = () => {
    const { getStudentInvoiceData } = usePocket()
    const [invoices, setInvoices] = useState<StudentInvoicesResponse[]>([])

    useEffect(() => {
        getStudentInvoiceData().then(res => setInvoices(res))
    }, [])


    return (
        <NavLayout>
            <div className="grid grid-cols-1 md:grid-cols-7 p-5 md:p-16 gap-10 w-full">
                <div className="col-span-1 md:col-span-5">
                    <div className="grid grid-cols-1 gap-10">
                        <div className='card border-2 border-base-300 bg-base-100'>
                            <div className="w-full font-semibold py-3 px-5 border-b border-base-300">
                                Invoice Records
                            </div>
                            <div className="flex flex-col divide-y divide-base-300 w-full">
                                {invoices.map((invoice, i) => (
                                    <div className="grid grid-cols-5" key={i}>
                                        <div className='py-3 px-5 font-semibold'>
                                            {months.find(e => e.index == invoice.month)?.shortName} {invoice.year}
                                        </div>
                                        <div className='py-3 px-5'>5 Classes</div>
                                        <div className='py-3 px-5'>15000 TK</div>
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