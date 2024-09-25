import StudentInfo from '../components/StudentInfo'
import NavLayout from '../layouts/NavLayout'
import StudentInvoiceList from '../components/StudentInvoiceList'

const StudentSelf = () => {
    return (
        <NavLayout>
            <div className="grid grid-cols-1 md:grid-cols-7 p-5 md:p-16 gap-10 w-full">
                <div className="col-span-1 md:col-span-5">
                    <div className="grid grid-cols-1 gap-10">
                        <StudentInvoiceList />
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <div className="grid grid-cols-1 gap-10">
                        <StudentInfo />
                    </div>
                </div>
            </div>
        </NavLayout>
    )
}

export default StudentSelf