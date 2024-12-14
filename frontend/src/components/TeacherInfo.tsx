import { usePocket } from '../contexts/PocketContext';
import { getDateInDayMonthYearFormat } from '../helpers/calendar';

const TeacherInfo = () => {
  const { teacher } = usePocket();

  return (
    <div className='card border-2 border-base-300 bg-base-100'>
      <div className="w-full font-semibold py-3 px-5 border-b border-base-300">
        Teacher Info
      </div>
      <div className="grid grid-cols-3">
        <div className='py-3 border-b border-base-300 pl-5 font-semibold'>Nickname</div>
        <div className='py-3 border-b border-base-300 col-span-2 pl-5 border-l'>{teacher?.nickname}</div>
        <div className='py-3 border-b border-base-300 pl-5 font-semibold'>Mobile</div>
        <div className='py-3 border-b border-base-300 col-span-2 pl-5 border-l'>{teacher?.mobile_no}</div>
        <div className='py-3 border-b border-base-300 pl-5 font-semibold'>Location</div>
        <div className='py-3 border-b border-base-300 col-span-2 pl-5 border-l'>{teacher?.expand?.user.location}</div>
        <div className='py-3 pl-5 font-semibold'>Joined</div>
        <div className='py-3 border-base-300 col-span-2 pl-5 border-l'>{teacher?.expand?.user.created ? getDateInDayMonthYearFormat(teacher.expand.user.created) : ""}</div>
      </div>
    </div>
  )
}

export default TeacherInfo