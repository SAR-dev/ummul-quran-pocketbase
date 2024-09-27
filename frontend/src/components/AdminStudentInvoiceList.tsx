import { useEffect, useMemo, useState } from 'react';
import { StudentInvoicesResponse } from '../types/pocketbase'
import { getYearsRange, months } from '../helpers/calendar'
import { usePocket } from '../contexts/PocketContext'
import { ErrorResponseType, TexpandStudent } from '../types/extend';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useNotification } from '../contexts/NotificationContext';
import { NotificationType } from '../types/notification';
import { CheckCircleIcon, ExclamationCircleIcon, PaperAirplaneIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import { ServerIcon } from '@heroicons/react/24/outline';

const WhatsAppInvoiceButton = ({ id, message, status }: { id: string, message: string, status?: string }) => {
    const { token } = usePocket()
    const [messageStatus, setMessageStatus] = useState(status)
    const [isLoading, setIsLoading] = useState(false)

    const SUCCESS = "SUCCESS"
    const ERROR = "ERROR"

    const handleSubmit = () => {
        const payload = {
            type: "STUDENT",
            id,
            message
        }

        setIsLoading(true)
        fetch(`${import.meta.env.VITE_API_URL}/api/send-wh-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ?? ""
            },
            body: JSON.stringify(payload),
        })
            .then(async response => {
                if (!response.ok) {
                    setMessageStatus(ERROR)
                }
                setMessageStatus(SUCCESS)
            })
            .then(() => {
                setMessageStatus(SUCCESS)
            })
            .catch(() => {
                setMessageStatus(ERROR)
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <button
            className={classNames({
                "btn btn-sm btn-icon btn-outline border-base-300 w-40 flex-shrink-0": true,
                "text-success": messageStatus == SUCCESS,
                "text-error": messageStatus == ERROR
            })}
            onClick={handleSubmit}
            disabled={isLoading}
        >
            {isLoading && <div className="loading w-4 h-4" />}
            {!isLoading && messageStatus?.length == 0 && <PaperAirplaneIcon className="w-4 h-4" />}
            {!isLoading && messageStatus == SUCCESS && <CheckCircleIcon className="w-4 h-4" />}
            {!isLoading && messageStatus == ERROR && <ExclamationCircleIcon className="w-4 h-4" />}
            {messageStatus?.length == 0 && "Send Message"}
            {messageStatus == SUCCESS && "Resend Message"}
            {messageStatus == ERROR && "Retry Message"}
        </button>
    )
}

const defaultMessage =
    `Hi {{nickname}},

We hope you're doing well! 
This is a reminder that your due amount for {{month}}, {{year}} is {{due_amount}} TK. 
You have paid {{paid_amount}} TK. Please pay by the end of this month.
Please contact us if you have any questions.

You can get the invoice at: ${window.location.origin}/teacher/invoices/{{id}}

Thank you!`

const msgFields = ["{{nickname}}", "{{whatsapp_no}}", "{{year}}", "{{month}}", "{{due_amount}}", "{{paid_amount}}", "{{id}}"]

const AdminStudentInvoiceList = () => {
    const { user, refresh, getStudentInvoiceListData, updateStudentInvoiceData } = usePocket()
    const notification = useNotification()
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [invoices, setInvoices] = useState<StudentInvoicesResponse<TexpandStudent>[]>([])
    const [sortBy, setSortBy] = useState<"PAID" | "UNPAID">("UNPAID")
    const [isLoading, setIsLoading] = useState(false)
    const [updateInvoice, setUpdateInvoice] = useState<StudentInvoicesResponse<TexpandStudent> | undefined>(undefined)

    const [message, setMessage] = useState(defaultMessage)
    const [showMsgUpdateModal, setShowMsgUpdateModal] = useState(false)

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
                <div className="flex">
                    <div className='flex-1 font-semibold p-3 sm:py-3 sm:px-5'>Student</div>
                    <div className='flex-1 font-semibold p-3 sm:py-3 sm:px-5'>Status</div>
                    <div className='flex-1 font-semibold p-3 sm:py-3 sm:px-5 inline-flex gap-1'>Due <span className='hidden sm:block'>Amount</span></div>
                    <div className='flex-1 font-semibold p-3 sm:py-3 sm:px-5 inline-flex gap-1'>Paid <span className='hidden sm:block'>Amount</span></div>
                    <div className='flex-1 font-semibold p-3 sm:py-3 sm:px-5 hidden sm:flex'>
                        <button className="btn btn-sm btn-outline border-base-300" onClick={() => setShowMsgUpdateModal(true)}>Template</button>
                    </div>
                </div>
                {sortedInvoices.map((invoice, i) => (
                    <div className="flex flex-wrap" key={i}>
                        <div className='flex-1 font-semibold p-3 sm:py-3 sm:px-5'>{invoice.expand?.student.nickname}</div>
                        <div className='flex-1 p-3 sm:py-3 sm:px-5'>
                            {invoice.paid ? (
                                <span className='text-success'>PAID</span>
                            ) : (
                                <span className='text-error'>UNPAID</span>
                            )}
                        </div>
                        <div className='flex-1 p-3 sm:py-3 sm:px-5'>{invoice.due_amount} TK</div>
                        <div className='flex-1 p-3 sm:py-3 sm:px-5'>{invoice.paid_amount} TK</div>
                        <div className='w-full sm:flex-1 p-3 pt-0 sm:py-3 sm:px-5'>
                            <button className="btn btn-sm btn-outline border-base-300 btn-square mr-2" onClick={() => setUpdateInvoice({ ...invoice })}>
                                <PencilIcon className='h-4 w-4' />
                            </button>
                            <WhatsAppInvoiceButton id={invoice.id} message={message} status={invoice.status} />
                        </div>
                    </div>
                ))}
            </div>
            {!!updateInvoice && (
                <Dialog open={true} onClose={() => { }} className="relative z-20">
                    <DialogBackdrop className="fixed inset-0 bg-base-content/25" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                        <DialogPanel className="card p-4 bg-base-100 w-full max-w-md">
                            <div className='p-5'>
                                <div className='flex justify-between items-center'>
                                    <div>Invoice of <b>{updateInvoice.expand?.student.nickname}</b> for <b>{months.find(e => e.index == updateInvoice.month)?.shortName} {updateInvoice.year}</b></div>
                                    <button className="btn btn-sm btn-square" onClick={() => setUpdateInvoice(undefined)}>
                                        <XMarkIcon className='h-4 w-4' />
                                    </button>
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
                                            <label className="swap bg-base-300 w-20 h-full rounded-lg text-center">
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
                                <div className="flex">
                                    <button className="btn border-base-300 btn-icon w-full" onClick={handleUpdate} disabled={isLoading}>
                                        {isLoading && <div className="loading w-4 h-4" />}
                                        {!isLoading && <ServerIcon className="w-4 h-4" />}
                                        Save
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            )}
            <Dialog open={showMsgUpdateModal} onClose={() => setShowMsgUpdateModal(false)} className="relative z-20">
                <DialogBackdrop className="fixed inset-0 bg-base-content/25" />
                <div className="fixed inset-0 flex w-screen items-center justify-center">
                    <DialogPanel className="card p-4 bg-base-100 w-full min-w-96 max-w-[40rem]">
                        <div className='p-5'>
                            <div className='flex justify-between items-center mb-5'>
                                <div className="font-semibold">Update Message Template</div>
                                <div className="text-xs">ⓘ Autosave Enabled</div>
                            </div>
                            <textarea
                                className="textarea textarea-bordered bg-base-200 w-full textarea-xs sm:textarea-sm resize-none scrollbar-thin"
                                rows={8}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />
                            <div className="mt-3 text-xs">Available variables: {msgFields.join(", ")}</div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}

export default AdminStudentInvoiceList