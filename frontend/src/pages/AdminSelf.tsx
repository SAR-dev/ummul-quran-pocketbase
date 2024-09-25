import { useState } from 'react'
import NavLayout from '../layouts/NavLayout'
import classNames from 'classnames'
import AdminInvoiceGenerator from '../components/AdminInvoiceGenerator'
import AdminStudentInvoiceList from '../components/AdminStudentInvoiceList'
import AdminTeacherInvoiceList from '../components/AdminTeacherInvoiceList'

enum InvoicePanelType {
  ISSUE_INVOICE, STUDENT_INVOICE, TEACHER_INVOICE
}

const AdminSelf = () => {
  const [panelType, setPanelType] = useState<InvoicePanelType>(InvoicePanelType.ISSUE_INVOICE)

  return (
    <NavLayout>
      <section className="p-5 md:p-16 w-full">
        <div className="card border-2 border-base-300 w-full bg-base-100">
          <div className="border-b border-base-300 p-5">
            <div className="join">
              <button
                className={classNames({
                  "btn join-item no-animation": true,
                  "btn-info": panelType == InvoicePanelType.ISSUE_INVOICE
                })}
                onClick={() => setPanelType(InvoicePanelType.ISSUE_INVOICE)}
              >
                Generate Invoices
              </button>
              <button
                className={classNames({
                  "btn join-item no-animation": true,
                  "btn-info": panelType == InvoicePanelType.STUDENT_INVOICE
                })}
                onClick={() => setPanelType(InvoicePanelType.STUDENT_INVOICE)}
              >
                Student Invoices
              </button>
              <button
                className={classNames({
                  "btn join-item no-animation": true,
                  "btn-info": panelType == InvoicePanelType.TEACHER_INVOICE
                })}
                onClick={() => setPanelType(InvoicePanelType.TEACHER_INVOICE)}
              >
                Teacher Invoices
              </button>
            </div>
          </div>
          <div className="p-5">
            {panelType == InvoicePanelType.ISSUE_INVOICE && (
              <AdminInvoiceGenerator />
            )}
            {panelType == InvoicePanelType.STUDENT_INVOICE && (
              <AdminStudentInvoiceList />
            )}
            {panelType == InvoicePanelType.TEACHER_INVOICE && (
              <AdminTeacherInvoiceList />
            )}
          </div>
        </div>
      </section>
    </NavLayout>
  )
}

export default AdminSelf