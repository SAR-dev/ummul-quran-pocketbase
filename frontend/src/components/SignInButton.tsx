import { usePocket } from '../contexts/PocketContext';
import { useNotification } from '../contexts/NotificationContext';
import { NotificationType } from '../types/notification';
import DropdownSelect from './DropDownSelect';
import { getImageUrl } from '../helpers/base';

const SignInButton = ({ asMobile }: { asMobile?: boolean }) => {
    const notification = useNotification()
    const { logout, teacher } = usePocket()

    const handleSignOut = () => {
        notification.add({
            title: "Confirmation Required",
            message: "Are you sure you want to Sign Out ? If you sign out all your data will be cleared.",
            status: NotificationType.INFO,
            body: (
                <div className='flex gap-3 justify-center w-full'>
                    <button className="btn btn-error" onClick={logout}>Yes, I am Sure</button>
                    <button className="btn btn-success" onClick={() => notification.remove()}>No, I will Stay</button>
                </div>
            )
        })
    }

    const navigateToProfileUrl = () => {

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
                        { text: teacher.nickname ?? "User Profile", value: teacher.nickname, handleClick: navigateToProfileUrl, icon: <div className='mr-1'>😎</div> },
                        { text: "Sign Out", value: "sign-out", handleClick: handleSignOut, icon: <div className='mr-1'>👋</div> },
                    ]}
                />
            )}
            {teacher && asMobile && (
                <>
                    <button className="btn btn-icon btn-ghost rounded-none justify-start" onClick={navigateToProfileUrl}>
                        <img src={getImageUrl({ collectionId: teacher.expand?.user.collectionId, dataId: teacher.expand?.user.id, image: teacher.expand?.user.avatar })} className='h-5 w-5 rounded-full object-cover' />
                        <div>{teacher.nickname}</div>
                    </button>
                    <button className="btn btn-icon btn-ghost rounded-none justify-start" onClick={handleSignOut}>
                        <div>👋</div>
                        Sign Out
                    </button>
                </>
            )}
        </>
    )
}

export default SignInButton