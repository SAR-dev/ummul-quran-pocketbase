import { CheckCircleIcon, ExclamationCircleIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid"
import classNames from "classnames"
import { useState } from "react"
import { usePocket } from "../contexts/PocketContext"

const WhatsAppInvoiceButton = ({ id, message, type, status }: { id: string, message: string, type: "STUDENT" | "TEACHER" , status?: string }) => {
    const { token } = usePocket()
    const [messageStatus, setMessageStatus] = useState(status)
    const [isLoading, setIsLoading] = useState(false)

    const SUCCESS = "SUCCESS"
    const ERROR = "ERROR"

    const handleSubmit = () => {
        const payload = { type, id, message }

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

export default WhatsAppInvoiceButton;