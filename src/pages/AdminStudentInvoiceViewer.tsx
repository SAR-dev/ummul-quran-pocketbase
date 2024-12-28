import NavLayout from '../layouts/NavLayout'
import AdminStudentInvoiceList from '../components/AdminStudentInvoiceList';
import AdminPageMenu from '../components/AdminPageMenu';

const AdminStudentInvoiceViewer = () => {
    return (
        <NavLayout>
            <section className="p-5 md:p-16 w-full">
                <AdminPageMenu />
                <div className="card border-2 border-base-300 w-full bg-base-100 mt-5">
                    <AdminStudentInvoiceList />
                </div>
            </section>
        </NavLayout>
    )
}

export default AdminStudentInvoiceViewer