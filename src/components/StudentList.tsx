import { usePocket } from '../contexts/PocketContext';
import { getImageUrl } from '../helpers/base';
import WhatsAppButton from './WhatsAppButton';

const StudentList = () => {
    const { students } = usePocket();
    return (
        <div className='card border-2 border-base-300 bg-base-100'>
            <div className="w-full flex justify-between items-center py-3 px-5 border-b border-base-300">
                <div className='font-semibold'>Student List</div>
                <div className='text-sm'>{students.length} Students</div>
            </div>
            <div className="flex flex-col divide-y divide-base-300">
                {students.map((e, i) => (
                    <div className="w-full" key={i}>
                        <div className='md:hidden flex p-3 justify-between items-center'>
                            <div className="flex items-center">
                                <div className="w-10 flex-shrink-0">
                                    <img className='w-8 h-8 rounded-full object-cover' src={getImageUrl({ collectionId: e.expand.user.collectionId, dataId: e.expand.user.id, image: e.expand.user.avatar })} />
                                </div>
                                <div className="flex-col w-48 flex-shrink-0">
                                    <div className="font-semibold">{e.nickname}</div>
                                    <div className="text-sm">{e.expand.user.location}</div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-col">
                                    <div className="font-semibold">{e.expand.monthly_package.class_mins} Mins</div>
                                    <div className="text-sm">{e.expand.monthly_package.teachers_price} TK / 1 Class</div>
                                </div>
                                <div className="flex h-auto items-center">
                                    <WhatsAppButton mobile_no={e.mobile_no} icon_only />
                                </div>
                            </div>

                        </div>
                        <div className='hidden md:flex gap-5 items-center p-5'>
                            <div className="w-16 flex-shrink-0">
                                <img className='w-16 h-16 rounded-full object-cover ring-2 ring-offset-4 ring-base-300' src={getImageUrl({ collectionId: e.expand.user.collectionId, dataId: e.expand.user.id, image: e.expand.user.avatar })} />
                            </div>
                            <div className="flex-col w-48 flex-shrink-0">
                                <div className="font-semibold">{e.nickname}</div>
                                <div className="text-sm">{e.expand.user.location}</div>
                            </div>
                            <div className="text-sm font-semibold w-32 flex-shrink-0">{e.expand.monthly_package.name}</div>
                            <div className="text-sm font-semibold w-32 flex-shrink-0">{e.expand.monthly_package.class_mins} Mins</div>
                            <div className="text-sm font-semibold w-32 flex-shrink-0">{e.expand.monthly_package.teachers_price} TK / 1 Class</div>
                            <div className="ml-auto">
                                <WhatsAppButton mobile_no={e.mobile_no} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StudentList