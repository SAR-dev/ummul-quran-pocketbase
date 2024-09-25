import { Link } from 'react-router-dom'
import { Bars3Icon, PlusIcon, WalletIcon } from '@heroicons/react/24/outline';
import { useState } from 'react'
import ThemeSwitcher from './ThemeSwitcher';
import SignInButton from './SignInButton';
import { usePocket } from '../contexts/PocketContext';

const Navbar = () => {
    const { teacher } = usePocket()
    const [showMenu, setShowMenu] = useState(false)

    return (
        <>
            <nav className="border-b border-base-300 w-full flex justify-between items-center px-5 py-4 bg-base-100">
                <Link className="flex gap-3 items-center" to="/teacher">
                    <img className="h-6" src="https://merakiui.com/images/logo.svg" alt="" />
                </Link>

                <div className="gap-3 hidden md:flex">
                    {teacher && (
                        <Link to="/teacher/class-planner" className="btn btn-ghost">
                            Class Planner
                        </Link>
                    )}
                    {teacher && (
                        <Link to="/teacher/invoices" className="btn btn-ghost">
                            Invoices
                        </Link>
                    )}
                    <ThemeSwitcher />
                    <SignInButton />
                </div>
                <div className='flex md:hidden'>
                    <button className="btn btn-sm btn-ghost" onClick={() => setShowMenu(!showMenu)}>
                        <Bars3Icon className='h-5 w-5' />
                    </button>
                </div>
            </nav>
            {showMenu && (
                <div className="flex flex-col divide-y divide-base-300 border-b border-base-300 md:hidden shadow">
                    {teacher && (
                        <Link to="/teacher/class-planner" className="btn btn-icon btn-ghost rounded-none justify-start hover:no-animation">
                            <PlusIcon className='h-5 w-5' />
                            Class Planner
                        </Link>
                    )}
                    {teacher && (
                        <Link to="/teacher/invoices" className="btn btn-icon btn-ghost rounded-none justify-start hover:no-animation">
                            <WalletIcon className='h-5 w-5' />
                            Invoices
                        </Link>
                    )}
                    <ThemeSwitcher asMobile={true} />
                    <SignInButton asMobile={true} />
                </div>
            )}
        </>
    )
}

export default Navbar