import NavLayout from '../layouts/NavLayout'
import AdminPageMenu from '../components/AdminPageMenu';
import AdminStudentInvoiceHistory from '../components/AdminStudentInvoiceHistory';

const StudentInvoiceHistory = () => {
    return (
        <NavLayout>
            <section className="p-5 md:p-16 w-full">
                <AdminPageMenu />
                <div className="card border-2 border-base-300 w-full bg-base-100 mt-5">
                    <AdminStudentInvoiceHistory />
                </div>
            </section>
        </NavLayout>
    )
}

export default StudentInvoiceHistory