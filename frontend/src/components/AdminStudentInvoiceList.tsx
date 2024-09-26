import { useEffect, useMemo, useState } from 'react';
import { StudentInvoicesResponse } from '../types/pocketbase'
import { getYearsRange, months } from '../helpers/calendar'
import { usePocket } from '../contexts/PocketContext'
import { ErrorResponseType, TexpandStudent } from '../types/extend';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useNotification } from '../contexts/NotificationContext';
import { NotificationType } from '../types/notification';

const AdminStudentInvoiceList = () => {
    const { user, refresh, getStudentInvoiceListData, updateStudentInvoiceData } = usePocket()
    const notification = useNotification()
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [invoices, setInvoices] = useState<StudentInvoicesResponse<TexpandStudent>[]>([])
    const [sortBy, setSortBy] = useState<"PAID" | "UNPAID">("UNPAID")
    const [isLoading, setIsLoading] = useState(false)
    const [updateInvoice, setUpdateInvoice] = useState<StudentInvoicesResponse<TexpandStudent> | undefined>(undefined)

    useEffect(() => {
        if (!user) return;

        getStudentInvoiceListData({ year, month })
            .then(res => setInvoices(res))
    }, [year, month, user, refresh])

    const sortedInvoices = useMemo(
        () => invoices.sort((a, b) => sortBy == "PAID" ? (Number(b.paid) - Number(a.paid)) : Number(a.paid) - Number(b.paid)),
        [invoices, sortBy]
    );

    const handleUpdate = async () => {
        if (!updateInvoice) return;
        const { id, paid, paid_amount, note } = updateInvoice
        setIsLoading(true)
        try {
            await updateStudentInvoiceData({ id, paid, paid_amount, note });
            setIsLoading(false)
            setUpdateInvoice(undefined)
        } catch (err) {
            const error = err as ErrorResponseType;
            notification.add({
                title: "Error Occured",
                message: error.response.message ?? "An error occured. Please try again later!",
                status: NotificationType.ERROR,
            })
            setIsLoading(false)
        }
    }

    return (
        <div className='w-auto'>
            <div className="flex gap-5 items-center">
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="select select-bordered">
                    <option disabled selected>Select Month</option>
                    {months.map((e, i) => (
                        <option value={e.index} key={i}>{e.longName}</option>
                    ))}
                </select>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="select select-bordered">
                    <option disabled selected>Select Year</option>
                    {getYearsRange().map((e, i) => (
                        <option value={e} key={i}>{e}</option>
                    ))}
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "PAID" | "UNPAID")} className="select select-bordered">
                    <option value="PAID">Paid</option>
                    <option value="UNPAID">Unpaid</option>
                </select>
            </div>
            <div className="card flex-col divide-y divide-base-300 w-full border border-base-300 mt-5">
                <div className="grid grid-cols-4 sm:grid-cols-5">
                    <div className='font-semibold p-3 sm:py-3 sm:px-5'>Student</div>
                    <div className='font-semibold p-3 sm:py-3 sm:px-5'>Status</div>
                    <div className='font-semibold p-3 sm:py-3 sm:px-5'>Due <span className='hidden sm:block'>Amount</span></div>
                    <div className='font-semibold p-3 sm:py-3 sm:px-5'>Paid <span className='hidden sm:block'>Amount</span></div>
                    <div className='font-semibold p-3 sm:py-3 sm:px-5 hidden sm:block'>Note</div>
                </div>
                {sortedInvoices.map((invoice, i) => (
                    <div className="grid grid-cols-4 sm:grid-cols-5 cursor-pointer hover:bg-base-300" onClick={() => setUpdateInvoice({ ...invoice })} key={i}>
                        <div className='font-semibold p-3 sm:py-3 sm:px-5'>{invoice.expand?.student.nickname}</div>
                        <div className='p-3 sm:py-3 sm:px-5'>
                            {invoice.paid ? (
                                <span className='text-success'>PAID</span>
                            ) : (
                                <span className='text-error'>UNPAID</span>
                            )}
                        </div>
                        <div className='p-3 sm:py-3 sm:px-5'>{invoice.due_amount} TK</div>
                        <div className='p-3 sm:py-3 sm:px-5'>{invoice.paid_amount} TK</div>
                        <div className='p-3 sm:py-3 sm:px-5 hidden sm:block'>{invoice.note}</div>
                    </div>
                ))}
            </div>
            {!!updateInvoice && (
                <Dialog open={true} onClose={() => { }} className="relative z-20">
                    <DialogBackdrop className="fixed inset-0 bg-base-content/25" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                        <DialogPanel className="card p-4 bg-base-100 min-w-96 max-w-md">
                            <div className='p-5'>
                                <div className='flex justify-between font-semibold'>
                                    <div>{updateInvoice.expand?.student.nickname}</div>
                                    <div>{months.find(e => e.index == updateInvoice.month)?.shortName} {updateInvoice.year}</div>
                                </div>
                                <div className="card my-5 flex-col border border-base-300 divide-y divide-base-300">
                                    <div className="grid grid-cols-2 divide-x divide-base-300">
                                        <div className='py-3 px-5'>Due Amount</div>
                                        <div className="py-3 px-5">
                                            {updateInvoice.due_amount} TK
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 divide-x divide-base-300">
                                        <div className='py-3 px-5'>Payment Status</div>
                                        <div className="py-3 px-5">
                                            <label className="swap bg-base-300 w-full h-full rounded-lg text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={updateInvoice.paid}
                                                    onChange={e => setUpdateInvoice({ ...updateInvoice, paid: e.target.checked })}
                                                />
                                                <div className="swap-on text-success">PAID</div>
                                                <div className="swap-off text-error">UNPAID</div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 divide-x divide-base-300">
                                        <div className='py-3 px-5'>Paid Amount</div>
                                        <div className="py-1 px-5 flex items-center">
                                            <label className="input input-sm input-bordered flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    className="grow w-16"
                                                    value={updateInvoice.paid_amount}
                                                    onChange={e => setUpdateInvoice({ ...updateInvoice, paid_amount: Number(e.target.value) })}
                                                />
                                                TK
                                            </label>
                                        </div>
                                    </div>
                                    <div className='p-3'>
                                        <textarea
                                            className="textarea textarea-bordered w-full textarea-sm resize-none"
                                            rows={2}
                                            value={updateInvoice.note}
                                            onChange={e => setUpdateInvoice({ ...updateInvoice, note: e.target.value })}
                                            placeholder="Note" />
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <button className="btn btn-sm" disabled={isLoading} onClick={() => setUpdateInvoice(undefined)}>Go Back</button>
                                    <button className="btn btn-sm btn-info btn-icon" onClick={handleUpdate} disabled={isLoading}>
                                        {isLoading && <div className="loading w-4 h-4" />}
                                        Update
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            )}
        </div>
    )
}

export default AdminStudentInvoiceList