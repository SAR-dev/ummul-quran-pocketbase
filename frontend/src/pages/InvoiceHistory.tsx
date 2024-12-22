import NavLayout from '../layouts/NavLayout'
import AdminPageMenu from '../components/AdminPageMenu';
import AdminInvoiceHistory from '../components/AdminInvoiceHistory';

const InvoiceHistory = () => {
    return (
        <NavLayout>
            <section className="p-5 md:p-16 w-full">
                <AdminPageMenu />
                <div className="card border-2 border-base-300 w-full bg-base-100 mt-5">
                    <AdminInvoiceHistory />
                </div>
            </section>
        </NavLayout>
    )
}

export default InvoiceHistory