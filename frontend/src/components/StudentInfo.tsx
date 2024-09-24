import { usePocket } from '../contexts/PocketContext';
import { getDateFromString } from '../helpers/calendar';

const StudentInfo = () => {
  const { student } = usePocket();

  return (
    <div className='card border-2 border-base-300 bg-base-100'>
      <div className="w-full flex items-center justify-between font-semibold py-3 px-5 border-b border-base-300">
        <div>Student Info</div>
        <a target='_blank' href={student?.class_link} className='btn btn-sm'>
          Class Link
        </a>
      </div>
      <div className="grid grid-cols-3">
        <div className='py-3 border-b border-base-300 pl-5 font-semibold'>Nickname</div>
        <div className='py-3 border-b border-base-300 col-span-2 pl-5 border-l'>{student?.nickname}</div>
        <div className='py-3 border-b border-base-300 pl-5 font-semibold'>Mobile</div>
        <div className='py-3 border-b border-base-300 col-span-2 pl-5 border-l'>{student?.mobile_no}</div>
        <div className='py-3 border-b border-base-300 pl-5 font-semibold'>Location</div>
        <div className='py-3 border-b border-base-300 col-span-2 pl-5 border-l'>{student?.expand?.user.location}</div>
        <div className='py-3 pl-5 font-semibold'>Joined</div>
        <div className='py-3 border-base-300 col-span-2 pl-5 border-l'>{getDateFromString(student?.expand?.user.created)}</div>
      </div>
    </div>
  )
}

export default StudentInfo