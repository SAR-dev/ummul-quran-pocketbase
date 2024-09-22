import { useMemo, useRef } from 'react';
import { CalendarDataType } from '../../../types/calendar'
import { useReactToPrint } from "react-to-print";
import { PrinterIcon } from '@heroicons/react/24/outline';

export const InvoiceGenerator = ({ data }: { data: CalendarDataType[] }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        content: () => contentRef.current,
        bodyClass: "p-5"
    });

    const groupedData = useMemo(
        () => data.filter(e => e.completed).reduce((acc, curr) => {
            // Create a unique key for each group based on student, class_mins, and teachers_price
            const key = `${curr.student}-${curr.class_mins}-${curr.teachers_price || 0}`;

            // Initialize the group if it doesn't exist
            if (!acc[key]) {
                acc[key] = {
                    student: curr.student,
                    student_mobile: curr.student_mobile,
                    class_mins: curr.class_mins,
                    teachers_price: curr.teachers_price || 0,
                    items: [] as CalendarDataType[], // Store the grouped items
                };
            }

            // Add the current item to the group
            acc[key].items.push(curr);

            return acc;
        }, {} as Record<string, {
            student: string;
            student_mobile: string;
            class_mins: number;
            teachers_price: number;
            items: CalendarDataType[]
        }>
        ), [data]
    );

    return (
        <div>
            <div className="bg-base-100 p-5" ref={contentRef}>
                <div className="grid grid-cols-2 items-center">
                    <div>
                        {/*  Company logo  */}
                        <img
                            src="https://img.freepik.com/premium-vector/mosque-quran-logo-design-spiritual-reverent-vector-graphics_579306-25250.jpg"
                            height={100}
                            width={100}
                        />
                    </div>
                    <div className="text-right">
                        <p>Tailwind Inc.</p>
                        <p className="text-base-content/75 text-sm">sales@ummul.com</p>
                        <p className="text-base-content/75 text-sm mt-1">+880-1761-1129</p>
                        <p className="text-base-content/75 text-sm mt-1">Dhaka, Bangladesh2</p>
                    </div>
                </div>
                <div className="w-full flex mt-5">
                    <div className="flex flex-1 flex-col text-sm">
                        <div className="font-semibold">Earning For</div>
                        <div>
                            Sayed Ar Rafi <span className="uppercase text-xs">(users31821)</span>
                        </div>
                    </div>
                    <div className="flex flex-col text-sm w-36 flex-shrink-0">
                        <div className="font-semibold">Start Date</div>
                        <div>July 01, 2024</div>
                    </div>
                    <div className="flex flex-col text-sm">
                        <div className="font-semibold">End Date</div>
                        <div>July 31, 2024</div>
                    </div>
                </div>
                {/* Invoice Items */}
                <div className="mt-8 flow-root">
                    <table className="w-full">
                        <colgroup>
                            <col className="w-1/2" />
                            <col className="w-1/6" />
                            <col className="w-1/6" />
                            <col className="w-1/6" />
                        </colgroup>
                        <thead className="border-b border-base-300">
                            <tr className='text-sm font-semibold'>
                                <th
                                    scope="col"
                                    className="py-3 text-left"
                                >
                                    Students
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 text-right"
                                >
                                    Class Mins
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 text-right"
                                >
                                    Price
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 text-right"
                                >
                                    Counts
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 pl-3 text-right"
                                >
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(groupedData).map((group, i) => (
                                <tr className="border-b border-base-300" key={i}>
                                    <td className="py-2 text-sm">
                                        <div className="font-medium">{group.student}</div>
                                        <div className="mt-1 truncate text-base-content/75">
                                            {group.student_mobile}
                                        </div>
                                    </td>
                                    <td className="px-3 text-right text-sm text-base-content/75">
                                        {group.class_mins} Min
                                    </td>
                                    <td className="px-3 text-right text-sm text-base-content/75">
                                        {group.teachers_price} TK
                                    </td>
                                    <td className="px-3 text-right text-sm text-base-content/75">
                                        {group.items.length}
                                    </td>
                                    <td className="pl-3 text-right text-sm text-base-content/75">
                                        {group.items.length * group.teachers_price} TK
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th
                                    scope="row"
                                    colSpan={4}
                                    className="pr-3 pt-6 text-right text-sm font-normal text-base-content/75 table-cell"
                                >
                                    Subtotal
                                </th>
                                <td className="pl-3 pt-6 text-right text-sm text-base-content/75">
                                    {Object.values(groupedData).map(e => e.items.length * e.teachers_price).reduce((acc, curr) => acc + curr, 0)} TK
                                </td>
                            </tr>
                            <tr>
                                <th
                                    scope="row"
                                    colSpan={4}
                                    className="pr-3 pt-4 text-right text-sm font-normal text-base-content/75 table-cell"
                                >
                                    Discount
                                </th>
                                <td className="pl-3 pt-4 text-right text-sm text-base-content/75">
                                    0
                                </td>
                            </tr>
                            <tr>
                                <th
                                    scope="row"
                                    colSpan={4}
                                    className="pr-3 pt-4 text-right text-sm font-semibold table-cell"
                                >
                                    Total
                                </th>
                                <td className="pl-3 pt-4 text-right text-sm font-semibold">
                                    {Object.values(groupedData).map(e => e.items.length * e.teachers_price).reduce((acc, curr) => acc + curr, 0)} TK
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                {/*  Footer  */}
                <div className="border-t-2 border-base-300 pt-4 text-xs text-base-content/75 text-center mt-16">
                    Please pay the invoice before the due date. You can pay the invoice by
                    logging in to your account from our client portal.
                </div>
            </div>
            <div className="flex w-full justify-end px-5">
                <button className="btn btn-sm btn-icon" onClick={handlePrint}>
                    <PrinterIcon className='h-4 w-4' />
                    Print Invoice
                </button>
            </div>
        </div>
    )
}