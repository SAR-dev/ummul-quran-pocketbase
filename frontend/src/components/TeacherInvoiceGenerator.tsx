import { useEffect, useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { usePocket } from '../contexts/PocketContext';
import { NotificationType } from '../types/notification';
import { ErrorMessageType, InvoicedListType } from '../types/extend';
import WhatsAppButton from './WhatsAppButton';
import { getDateFromString } from '../helpers/calendar';

const TeacherInvoiceGenerator = () => {
    const notification = useNotification()
    const { token, refresh, incRefresh } = usePocket()

    const [invoicedTeachers, setInvoicedTeachers] = useState<InvoicedListType[]>([])
    const [invoicedTeachersCopy, setInvoicedTeachersCopy] = useState<InvoicedListType[]>([])
    const [selectedTeachers, setSelectedTeachers] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchText, setSearchText] = useState("")

    useEffect(() => {
        fetchTeacherInvoices()
    }, [token, refresh])

    const fetchTeacherInvoices = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/get-invoiced-teachers`, {
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
            .then(res => {
                setInvoicedTeachers(res)
                setInvoicedTeachersCopy(res)
            })
            .catch(() => {
                notification.add({
                    title: "Error Occured",
                    message: "There was an error performing the request. Please try again later..",
                    status: NotificationType.ERROR,
                })
            })
    }

    const handleStudentCheck = (id: string) => {
        const selectedIds = [...selectedTeachers]
        if (selectedIds.includes(id)) {
            setSelectedTeachers([...selectedIds.filter(e => e != id)])
        } else {
            setSelectedTeachers([...selectedIds, id])
        }
    }

    const handleSubmit = () => {
        if (selectedTeachers.length == 0) return;
        const payload = { students: selectedTeachers }

        setIsLoading(true)
        fetch(`${import.meta.env.VITE_API_URL}/api/generate-teacher-invoices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ?? ""
            },
            body: JSON.stringify(payload),
        })
            .then(async response => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                incRefresh()
                setSelectedTeachers([])
                notification.add({
                    title: "Invoice Issued",
                    message: "Invoices has been issued for students and teachers.",
                    status: NotificationType.SUCCESS,
                })
            })
            .catch((err) => {
                const error = err as ErrorMessageType;
                notification.add({
                    title: "Error Occured",
                    message: error.message ?? "There was an error performing the request. Please try again later..",
                    status: NotificationType.ERROR,
                })
            })
            .finally(() => setIsLoading(false));
    }

    const handleSelectAll = () => {
        setSelectedTeachers([...invoicedTeachers.map(e => e.id)])
    }

    const handleSelectNone = () => {
        setSelectedTeachers([])
    }

    const handleSearch = () => {
        if(searchText.length == 0) {
            setInvoicedTeachersCopy([...invoicedTeachers])
            return;
        }
        setSelectedTeachers([])
        setInvoicedTeachersCopy([...invoicedTeachers
            .filter(e => 
                e.nickname.toLowerCase().includes(searchText.toLowerCase()) ||
                e.mobile_no.toLowerCase().includes(searchText.toLowerCase())
            )])
    }

    return (
        <div className="p-5 max-w-[50rem]">
            <div className="flex items-center w-full justify-between font-semibold mb-5">
                <div className='flex gap-3'>
                    <button className='btn btn-sm btn-neutral btn-icon' onClick={handleSelectAll}>Select All</button>
                    <button className='btn btn-sm btn-neutral btn-icon' onClick={handleSelectNone}>Select None</button>
                </div>
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
                <button className='btn btn-sm btn-neutral btn-icon w-48' disabled={selectedTeachers.length == 0 || isLoading} onClick={handleSubmit}>
                    {isLoading && <div className="loading w-4 h-4" />}
                    Generate Invoice
                </button>
            </div>
            <div className="card flex-col divide-y divide-base-300 border border-base-300">
                <div className="grid grid-cols-7 gap-3 text-base-content/50">
                    <div className="p-3 col-span-3 font-semibold">
                        Teacher
                    </div>
                    <div className="p-3 col-span-2 font-semibold">
                        WhatsApp
                    </div>
                    <div className="p-3 col-span-2 font-semibold">
                        Last Invoiced Date
                    </div>
                </div>
                {invoicedTeachersCopy.map((e, i) => (
                    <div className="grid grid-cols-7 gap-3" key={i}>
                        <div className="col-span-3 p-3 font-semibold">
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input type="checkbox" className="checkbox" checked={selectedTeachers.includes(e.id)} onChange={() => handleStudentCheck(e.id)} />
                                    <span className="label-text">{e.nickname}</span>
                                </label>
                            </div>
                        </div>
                        <div className="col-span-2 p-3">
                            <WhatsAppButton mobile_no={e.mobile_no} />
                        </div>
                        <div className="col-span-2 p-3">
                            {getDateFromString(e.last_invoiced_at)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TeacherInvoiceGenerator