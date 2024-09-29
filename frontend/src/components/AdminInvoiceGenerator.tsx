import { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { usePocket } from '../contexts/PocketContext';
import { NotificationType } from '../types/notification';
import { ErrorMessageType } from '../types/extend';

const AdminInvoiceGenerator = () => {
    const notification = useNotification()
    const { token } = usePocket()
    const [lastDate, setLastDate] = useState((new Date()).toISOString().slice(0, 10))
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (invoice_type: string) => {
        const payload = { last_date: lastDate }

        setIsLoading(true)
        fetch(`${import.meta.env.VITE_API_URL}/api/generate-${invoice_type}-invoices`, {
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

    return (
        <div className='w-auto'>
            <div className="font-semibold mb-5">Select last date and click button to generate invoices</div>
            <div className="grid sm:grid-cols-3 gap-5 w-full sm:w-[40rem]">
                <div>
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="date"
                            className='grow'
                            value={lastDate}
                            onChange={e => setLastDate(e.target.value)}
                        />
                    </label>
                </div>
                <button className="btn btn-info btn-icon" disabled={isLoading} onClick={() => handleSubmit("student")}>
                    {isLoading && <div className="loading w-5 h-5" />}
                    Generate Student Invoices
                </button>
                <button className="btn btn-info btn-icon" disabled={isLoading} onClick={() => handleSubmit("teacher")}>
                    {isLoading && <div className="loading w-5 h-5" />}
                    Generate Teacher Invoices
                </button>
            </div>
        </div>
    )
}

export default AdminInvoiceGenerator