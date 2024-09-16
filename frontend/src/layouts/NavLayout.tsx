import { ReactNode } from 'react';
import Navbar from '../components/Navbar';

const NavLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen w-full bg-base-100">
            <Navbar />
            {children}
        </div>
    )
}

export default NavLayout