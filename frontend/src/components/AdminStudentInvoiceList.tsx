import { useEffect, useState } from 'react';
import { StudentInvoicesResponse } from '../types/pocketbase'
import { getYearsRange, months } from '../helpers/calendar'
import { usePocket } from '../contexts/PocketContext'
import { TexpandStudent } from '../types/extend';

const AdminStudentInvoiceList = () => {
    const { user, getStudentInvoiceListData } = usePocket()
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [invoices, setInvoices] = useState<StudentInvoicesResponse<TexpandStudent>[]>([])

    useEffect(() => {
        if (!user) return;

        getStudentInvoiceListData({ year, month }).then(res => setInvoices(res))
    }, [year, month, user])


    return (
        <div className='w-auto'>
            <div className="flex gap-5 items-center">
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="select select-bordered w-32">
                    <option disabled selected>Select Month</option>
                    {months.map((e, i) => (
                        <option value={e.index} key={i}>{e.longName}</option>
                    ))}
                </select>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="select select-bordered w-32">
                    <option disabled selected>Select Year</option>
                    {getYearsRange().map((e, i) => (
                        <option value={e} key={i}>{e}</option>
                    ))}
                </select>
            </div>
            <div className="card flex-col divide-y divide-base-300 w-full border border-base-300 mt-5">
                <div className="grid grid-cols-5">
                    <div className='font-semibold py-3 px-5'>Student</div>
                    <div className='font-semibold py-3 px-5'>Status</div>
                    <div className='font-semibold py-3 px-5'>Due AMount</div>
                    <div className='font-semibold py-3 px-5'>Paid AMount</div>
                    <div className='font-semibold py-3 px-5'>Note</div>
                </div>
                {invoices.map((invoice, i) => (
                    <div className="grid grid-cols-5" key={i}>
                        <div className='font-semibold py-3 px-5'>{invoice.expand?.student.nickname}</div>
                        <div className='py-3 px-5'>
                            {invoice.paid ? (
                                <span className='text-success'>PAID</span>
                            ) : (
                                <span className='text-error'>UNPAID</span>
                            )}
                        </div>
                        <div className='py-3 px-5'>{invoice.due_amount} TK</div>
                        <div className='py-3 px-5'>{invoice.paid_amount} TK</div>
                        <div className='py-3 px-5'>{invoice.note}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminStudentInvoiceList