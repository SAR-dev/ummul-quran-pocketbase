import NavLayout from '../layouts/NavLayout'
import StudentInvoiceGenerator from '../components/StudentInvoiceGenerator';
import AdminPageMenu from '../components/AdminPageMenu';

const AdminStudentInvoiceGenerator = () => {
    return (
        <NavLayout>
            <section className="p-5 md:p-16 w-full">
                <AdminPageMenu />
                <div className="card border-2 border-base-300 w-full bg-base-100 mt-5">
                    <StudentInvoiceGenerator />
                </div>
            </section>
        </NavLayout>
    )
}

export default AdminStudentInvoiceGenerator