import { useEffect, useState } from 'react';
import { getYearsRange, months } from '../helpers/calendar';
import { usePocket } from '../contexts/PocketContext';
import { TeacherInvoicesResponse } from '../types/pocketbase';
import { ErrorResponseType, TexpandTeacher } from '../types/extend';
import { PencilIcon, ServerIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useNotification } from '../contexts/NotificationContext';
import { NotificationType } from '../types/notification';
import { constants } from '../stores/constantStore';
import WhatsAppInvoiceButton from './WhatsAppInvoiceButton';
import { Link } from 'react-router-dom';

const AdminTeacherInvoiceList = () => {
    const notification = useNotification()

    const { refresh, updateTeacherInvoiceData, getTeacherInvoiceListData } = usePocket()
    const [invoices, setInvoices] = useState<TeacherInvoicesResponse<TexpandTeacher>[]>([])
    const [invoicesCopy, setInvoicesCopy] = useState<TeacherInvoicesResponse<TexpandTeacher>[]>([])
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [isLoading, setIsLoading] = useState(false)

    const [updateInvoice, setUpdateInvoice] = useState<TeacherInvoicesResponse<TexpandTeacher> | undefined>(undefined)
    const [message, setMessage] = useState(constants.DEFAULT_WH_TEACHER_INVOICE)
    const [showMsgUpdateModal, setShowMsgUpdateModal] = useState(false)
    const [searchText, setSearchText] = useState("")


    useEffect(() => {
        const cd = new Date(year, month - 1, 1);
        const nd = new Date(new Date(year, month - 1, 1).setMonth(new Date(year, month - 1, 1).getMonth() + 1));

        const start = `${cd.getFullYear()}-${cd.getMonth() + 1}-01`;
        const end = `${nd.getFullYear()}-${nd.getMonth() + 1}-01`;

        getTeacherInvoiceListData({ start, end }).then(res => {
            setInvoices(res)
            setInvoicesCopy(res)
        })
    }, [year, month, refresh])

    const handleUpdate = async () => {
        if (!updateInvoice) return;
        const { id, paid_amount, note } = updateInvoice
        setIsLoading(true)
        try {
            await updateTeacherInvoiceData({ id, paid_amount, note });
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

    const handleSearch = () => {
        if (searchText.length == 0) {
            setInvoicesCopy([...invoices])
            return;
        }
        setInvoicesCopy([...invoices
            .filter(e =>
                e.expand?.teacher.nickname.toLowerCase().includes(searchText.toLowerCase()) ||
                e.expand?.teacher.mobile_no.toLowerCase().includes(searchText.toLowerCase())
            )])
    }

    return (
        <div className="p-5 max-w-[60rem]">
            <div className='font-semibold mb-5'>Select month to view generated invoices of that month</div>
            <div className="flex justify-between items-center mb-5">
                <div className="flex gap-5">
                    <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="select select-bordered select-sm w-32">
                        <option disabled selected>Select Month</option>
                        {months.map((e, i) => (
                            <option value={e.index} key={i}>{e.longName}</option>
                        ))}
                    </select>
                    <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="select select-bordered select-sm w-32">
                        <option disabled selected>Select Year</option>
                        {getYearsRange().map((e, i) => (
                            <option value={e} key={i}>{e}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-5">
                    <div>
                        Due: {invoices.reduce((sum, record) => sum + record.due_amount, 0)} TK
                    </div>
                    <div>
                        Paid: {invoices.reduce((sum, record) => sum + record.paid_amount, 0)} TK
                    </div>
                </div>
            </div>
            <div className="flex justify-between">
                <div className='flex gap-1'>
                    <input
                        type="text"
                        placeholder="Type here"
                        value={searchText}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        onChange={e => setSearchText(e.target.value)}
                        className="input input-sm input-bordered w-full max-w-xs"
                    />
                    <button
                        onClick={handleSearch}
                        className="btn btn-sm btn-icon btn-square border-base-content/25"
                    >🔎</button>
                </div>
                <button className="btn btn-sm btn-outline border-base-300" onClick={() => setShowMsgUpdateModal(true)}>
                    Edit Message Template
                </button>
            </div>
            <div className="card flex-col divide-y divide-base-300 border border-base-300 mt-5">
                <div className="grid grid-cols-10 gap-3 text-base-content/50">
                    <div className="p-3 col-span-2 font-semibold">
                        Invoice
                    </div>
                    <div className="p-3 col-span-3 font-semibold">
                        Student
                    </div>
                    <div className="p-3 col-span-2 font-semibold">
                        Paid/Due Amount
                    </div>
                    <div className="p-3 col-span-3">
                        Message
                    </div>
                </div>
                {invoicesCopy.map((e, i) => (
                    <div className="grid grid-cols-10 gap-3" key={i}>
                        <div className="col-span-2 p-3">
                            <Link to={`/admin/teacher-invoices/${e.id}`} className="btn btn-sm uppercase">
                                {e.id}
                            </Link>
                        </div>
                        <div className="col-span-3 p-3 font-semibold">
                            {e.expand?.teacher.nickname}
                        </div>
                        <div className="col-span-2 p-3">
                            {e.paid_amount ?? 0} / {e.due_amount} TK
                        </div>
                        <div className="col-span-3 p-3">
                            <div className="flex gap-2">
                                <button className="btn btn-sm btn-outline border-base-300 btn-square mr-2" onClick={() => setUpdateInvoice({ ...e })}>
                                    <PencilIcon className='h-4 w-4' />
                                </button>
                                <WhatsAppInvoiceButton id={e.id} message={message} status={e.message_status} type='TEACHER' />
                            </div>
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
                                    <div className="font-semibold">Update Invoice Data</div>
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
                            <div className="mt-3 text-xs">Available variables: {constants.DEFAULT_INVOICE_MSG_FIELDS.join(", ")}</div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}

export default AdminTeacherInvoiceList