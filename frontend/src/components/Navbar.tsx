import { Link } from 'react-router-dom'
import { Bars3Icon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react'
import ThemeSwitcher from './ThemeSwitcher';
import SignInButton from './SignInButton';

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false)

    return (
        <>
            <nav className="border-b border-base-300 w-full flex justify-between items-center px-5 py-4 bg-base-100">
                <Link className="flex gap-3 items-center" to="/">
                    <img className="h-6" src="https://i.ibb.co/qjD26QZ/quran.png" alt="" />
                    <div className="font-bold text-xl hidden md:block">Ummul Quran</div>
                </Link>

                <div className="gap-3 hidden md:flex">
                    <Link to="/class-planner" className="btn btn-ghost">
                        Class Planner
                    </Link>
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
                    <Link to="/class-planner" className="btn btn-icon btn-ghost rounded-none justify-start">
                        <PlusIcon className='h-5 w-5' />
                        Class Planner
                    </Link>
                    <ThemeSwitcher asMobile={true} />
                    <SignInButton asMobile={true} />
                </div>
            )}
        </>
    )
}

export default Navbar