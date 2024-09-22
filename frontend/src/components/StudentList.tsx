import { usePocket } from '../contexts/PocketContext';
import WhatsAppButton from './WhatsAppButton';

const StudentList = () => {
    const { students } = usePocket();
    return (
        <div className='card border border-base-300'>
            <div className="text-center w-full font-semibold py-3 border-b border-base-300">
                Student List
            </div>
            <div className="flex flex-col divide-y divide-base-300">
                {students.map((e, i) => (
                    <div className='flex items-center p-5' key={i}>
                        <div className="flex-col">
                            <div className="font-semibold">{e.nickname}</div>
                            <div className="text-sm">{e.expand.user.location}</div>
                            <div className="text-sm">Class: {e.expand.monthly_package.class_mins} Mins</div>
                        </div>
                        <div className="ml-auto">
                            <WhatsAppButton mobile_no={e.mobile_no} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StudentList