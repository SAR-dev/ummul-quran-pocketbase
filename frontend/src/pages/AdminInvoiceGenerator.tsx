import { useState } from 'react';
import NavLayout from '../layouts/NavLayout'
import classNames from 'classnames'
import StudentInvoiceGenerator from '../components/StudentInvoiceGenerator';
import TeacherInvoiceGenerator from '../components/TeacherInvoiceGenerator';

enum InvoicePanelType {
    STUDENT_INVOICE, TEACHER_INVOICE
}

const AdminInvoiceGenerator = () => {
    const [panelType, setPanelType] = useState<InvoicePanelType>(InvoicePanelType.STUDENT_INVOICE)

    return (
        <NavLayout>
            <section className="p-5 md:p-16 w-full">
                <div className="card border-2 border-base-300 w-full bg-base-100">
                    <div className="border-b border-base-300 p-5">
                        <div className="mb-5 font-semibold">Generate invoices from here</div>
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
                        <StudentInvoiceGenerator />
                    )}
                    {panelType == InvoicePanelType.TEACHER_INVOICE && (
                        <TeacherInvoiceGenerator />
                    )}
                </div>
            </section>
        </NavLayout>
    )
}

export default AdminInvoiceGenerator