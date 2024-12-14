import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import { ThemeName, useThemeStore } from '../stores/themeStore';

const ThemeSwitcher = ({ asMobile }: { asMobile?: boolean }) => {
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        setTheme(theme)
    }, [])

    if (!asMobile) {
        return (
            <div className='flex items-center'>
                <label className="swap swap-rotate">
                    <input
                        type="checkbox"
                        checked={theme == ThemeName.Dark} 
                        onChange={() => setTheme(theme == ThemeName.Dark ? ThemeName.Light : ThemeName.Dark)}
                    />
                    <MoonIcon className='h-5 w-5 swap-on' />
                    <SunIcon className='h-5 w-5 swap-off' />
                </label>
            </div>
        )
    } else {
        return (
            <button 
                className="btn btn-ghost justify-start btn-icon rounded-none hover:no-animation" 
                onClick={() => setTheme(theme == ThemeName.Dark ? ThemeName.Light : ThemeName.Dark)}
            >
                {theme == ThemeName.Dark && <MoonIcon className='h-5 w-5' />}
                {theme == ThemeName.Light && <SunIcon className='h-5 w-5' />}
                {theme == ThemeName.Dark && "Light"}
                {theme == ThemeName.Light && "Dark"}
            </button>
        )
    }
}

export default ThemeSwitcher;
