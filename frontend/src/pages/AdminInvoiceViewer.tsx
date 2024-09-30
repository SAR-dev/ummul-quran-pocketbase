import { useState } from 'react';
import NavLayout from '../layouts/NavLayout'
import classNames from 'classnames'
import AdminStudentInvoiceList from '../components/AdminStudentInvoiceList';
import AdminTeacherInvoiceList from '../components/AdminTeacherInvoiceList';

enum InvoicePanelType {
    STUDENT_INVOICE, TEACHER_INVOICE
}

const AdminInvoiceViewer = () => {
    const [panelType, setPanelType] = useState<InvoicePanelType>(InvoicePanelType.STUDENT_INVOICE)

    return (
        <NavLayout>
            <section className="p-5 md:p-16 w-full">
                <div className="card border-2 border-base-300 w-full bg-base-100">
                    <div className="border-b border-base-300 p-5">
                        <div className="mb-5 font-semibold">Manage invoices from here</div>
                        <div className="grid grid-cols-3 max-w-[40rem]">
                            <button
                                className={classNames({
                                    "btn no-animation rounded-r-none": true,
                                    "btn-info": panelType == InvoicePanelType.STUDENT_INVOICE
                                })}
                                onClick={() => setPanelType(InvoicePanelType.STUDENT_INVOICE)}
                            >
                                Student Invoices
                            </button>
                            <button
                                className={classNames({
                                    "btn no-animation rounded-l-none": true,
                                    "btn-info": panelType == InvoicePanelType.TEACHER_INVOICE
                                })}
                                onClick={() => setPanelType(InvoicePanelType.TEACHER_INVOICE)}
                            >
                                Teacher Invoices
                            </button>
                        </div>
                    </div>
                    {panelType == InvoicePanelType.STUDENT_INVOICE && (
                        <AdminStudentInvoiceList />
                    )}
                    {panelType == InvoicePanelType.TEACHER_INVOICE && (
                        <AdminTeacherInvoiceList />
                    )}

                </div>
            </section>
        </NavLayout>
    )
}

export default AdminInvoiceViewer