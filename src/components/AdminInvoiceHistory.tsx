import { useEffect, useState } from "react"
import { usePocket } from "../contexts/PocketContext"
import { InvoicesResponse } from "../types/pocketbase"
import { getDateInDayMonthYearFormat, getTimeIn12HourFormat } from "../helpers/calendar"
import { useNotification } from "../contexts/NotificationContext"
import { NotificationType } from "../types/notification"

const AdminInvoiceHistory = () => {
    const notification = useNotification()
    const { token, refresh, getInvoiceHistory } = usePocket()
    const [invoices, setInvoices] = useState<InvoicesResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getInvoiceHistory().then(res => {
            setInvoices(res)
        })
    }, [refresh])

    const handleDeleteClick = (id: string) => {
        notification.add({
            title: "Confirmation Required",
            message: "Are you sure you want to Delete ? This can not be undone.",
            status: NotificationType.INFO,
            body: (
                <div className='flex gap-3 justify-center w-full'>
                    <button className="btn btn-error" onClick={() => handleDelete(id)}>Yes, I am Sure</button>
                    <button className="btn btn-success" onClick={() => notification.remove()}>No, I won't</button>
                </div>
            )
        })
    }

    const handleDelete = async (id: string) => {
        setIsLoading(true)
        fetch(`${import.meta.env.VITE_API_URL}/api/invoices/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ?? ""
            },
            body: null,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                notification.add({
                    title: "Invoice Deleted",
                    message: "The requested invoice has been deleted. Please check.",
                    status: NotificationType.SUCCESS,
                })
                getInvoiceHistory().then(res => {
                    setInvoices(res)
                })
            })
            .catch(() => {
                notification.add({
                    title: "Error Occured",
                    message: "There was an error performing the request. Please try again later..",
                    status: NotificationType.ERROR,
                })
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <div className="p-5 max-w-[60rem]">
            <div className="card flex-col divide-y divide-base-300 border border-base-300 mt-5">
                <div className="grid grid-cols-4 gap-3 text-base-content/50">
                    <div className="p-3 col-span-1 font-semibold">
                        Date
                    </div>
                    <div className="p-3 col-span-1 font-semibold">
                        Time
                    </div>
                    <div className="p-3 col-span-1 font-semibold">
                        Type
                    </div>
                    <div className="p-3 col-span-1 font-semibold">
                        Action
                    </div>
                </div>
                {invoices.map((e, i) => (
                    <div className="grid grid-cols-4 gap-3" key={i}>
                        <div className="p-3">
                            {getDateInDayMonthYearFormat(e.created)}
                        </div>
                        <div className="p-3">
                            {getTimeIn12HourFormat(e.created)}
                        </div>
                        <div className="p-3 font-semibold">
                            {e.type}
                        </div>
                        <div className="p-3">
                            <button className="btn btn-sm btn-error" disabled={isLoading} onClick={() => handleDeleteClick(e.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminInvoiceHistory