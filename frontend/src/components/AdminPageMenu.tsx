import { useLocation, useNavigate } from "react-router-dom"

const AdminPageMenu = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleOptionChange = (url: string) => {
        navigate(`/admin/${url}`)
    }

    return (
        <select className="select select-bordered w-full max-w-xs" value={location.pathname.split("/")[2]} onChange={e => handleOptionChange(e.target.value)}>
            <option value="generate-student-invoices">Generate Student Invoices</option>
            <option value="generate-teacher-invoices">Generate Teacher Invoices</option>
            <option value="manage-student-invoices">Manage Student Invoices</option>
            <option value="manage-teacher-invoices">Manage Teacher Invoices</option>
        </select>
    )
}

export default AdminPageMenu