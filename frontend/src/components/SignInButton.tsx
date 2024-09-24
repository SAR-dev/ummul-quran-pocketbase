import { usePocket } from '../contexts/PocketContext';
import { useNotification } from '../contexts/NotificationContext';
import { NotificationType } from '../types/notification';
import DropdownSelect from './DropDownSelect';
import { getImageUrl } from '../helpers/base';
import { PowerIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const SignInButton = ({ asMobile }: { asMobile?: boolean }) => {
    const notification = useNotification()
    const navigate = useNavigate()
    const { logout, teacher, student } = usePocket()

    const signOut = () => {
        logout()
        notification.remove()
        navigate("/sign-in")
        window.location.reload()
    }

    const handleSignOut = () => {
        notification.add({
            title: "Confirmation Required",
            message: "Are you sure you want to Sign Out ? If you sign out all your data will be cleared.",
            status: NotificationType.INFO,
            body: (
                <div className='flex gap-3 justify-center w-full'>
                    <button className="btn btn-error" onClick={signOut}>Yes, I am Sure</button>
                    <button className="btn btn-success" onClick={() => notification.remove()}>No, I will Stay</button>
                </div>
            )
        })
    }

    return (
        <>
            {teacher && !asMobile && (
                <DropdownSelect
                    button={
                        <button className="btn btn-ghost border-base-300">
                            <img src={getImageUrl({ collectionId: teacher.expand?.user.collectionId, dataId: teacher.expand?.user.id, image: teacher.expand?.user.avatar })} className='h-5 w-5 rounded-full object-cover' />
                            <div>{teacher.nickname}</div>
                        </button>
                    }
                    options={[
                        { text: "Sign Out", value: "sign-out", handleClick: handleSignOut, icon: <PowerIcon className='h-5 w-5' /> },
                    ]}
                />
            )}
            {teacher && asMobile && (
                <>
                    <button className="btn btn-icon btn-ghost rounded-none justify-start hover:no-animation">
                        <img src={getImageUrl({ collectionId: teacher.expand?.user.collectionId, dataId: teacher.expand?.user.id, image: teacher.expand?.user.avatar })} className='h-5 w-5 rounded-full object-cover' />
                        <div>{teacher.nickname}</div>
                    </button>
                    <button className="btn btn-icon btn-ghost rounded-none justify-start hover:no-animation" onClick={handleSignOut}>
                        <PowerIcon className='h-5 w-5' />
                        Sign Out
                    </button>
                </>
            )}
            {student && !asMobile && (
                <DropdownSelect
                    button={
                        <button className="btn btn-ghost border-base-300">
                            <img src={getImageUrl({ collectionId: student.expand?.user.collectionId, dataId: student.expand?.user.id, image: student.expand?.user.avatar })} className='h-5 w-5 rounded-full object-cover' />
                            <div>{student.nickname}</div>
                        </button>
                    }
                    options={[
                        { text: "Sign Out", value: "sign-out", handleClick: handleSignOut, icon: <PowerIcon className='h-5 w-5' /> },
                    ]}
                />
            )}
            {student && asMobile && (
                <>
                    <button className="btn btn-icon btn-ghost rounded-none justify-start hover:no-animation">
                        <img src={getImageUrl({ collectionId: student.expand?.user.collectionId, dataId: student.expand?.user.id, image: student.expand?.user.avatar })} className='h-5 w-5 rounded-full object-cover' />
                        <div>{student.nickname}</div>
                    </button>
                    <button className="btn btn-icon btn-ghost rounded-none justify-start hover:no-animation" onClick={handleSignOut}>
                        <PowerIcon className='h-5 w-5' />
                        Sign Out
                    </button>
                </>
            )}
        </>
    )
}

export default SignInButton