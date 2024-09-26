import { useState } from 'react';
import { getYearsRange, months } from '../helpers/calendar';
import { useNotification } from '../contexts/NotificationContext';
import { usePocket } from '../contexts/PocketContext';
import { NotificationType } from '../types/notification';
import { ErrorMessageType } from '../types/extend';

const AdminInvoiceGenerator = () => {
    const notification = useNotification()
    const { token } = usePocket()
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = () => {
        const payload = { year, month }

        setIsLoading(true)
        fetch(`${import.meta.env.VITE_API_URL}/api/generate-invoices`, {
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
            <div className="font-semibold mb-5">Select date and click button to generate invoices</div>
            <div className="grid sm:grid-cols-3 gap-5 w-full sm:w-[30rem]">
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
                <button className="btn btn-info btn-icon" disabled={isLoading} onClick={handleSubmit}>
                    {isLoading && <div className="loading w-5 h-5" />}
                    Generate Invoices
                </button>
            </div>
        </div>
    )
}

export default AdminInvoiceGenerator