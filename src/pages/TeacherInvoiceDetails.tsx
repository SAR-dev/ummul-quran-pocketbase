import NavLayout from "../layouts/NavLayout";
import TeacherInvoiceLogsById from "../components/TeacherInvoiceLogsById";

const TeacherInvoiceDetails = () => {
  return (
    <NavLayout>
      <div className="grid grid-cols-1 md:grid-cols-7 p-5 md:p-16 gap-10 w-full">
        <div className="col-span-1 md:col-span-5">
          <div className="w-full grid grid-cols-1 gap-10">
            <TeacherInvoiceLogsById />
          </div>
        </div>
      </div>
    </NavLayout>
  );
};

export default TeacherInvoiceDetails;
