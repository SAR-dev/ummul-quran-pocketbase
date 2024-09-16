import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ReactNode } from 'react';
import classNames from 'classnames';

interface DropDownSelectProps {
    button: ReactNode;
    options: {
        icon?: ReactNode
        text: string
        value: string
        handleClick?: () => void;
    }[]
    selectedValue?: string;
}

const DropdownSelect = ({ ...props }: DropDownSelectProps) => {
    return (
        <Menu>
            <MenuButton>
                {props.button}
            </MenuButton>
            <MenuItems
                anchor="bottom end"
                className="absolute card right-0 mt-2 w-56 origin-top-right divide-y shadow-lg bg-base-100 ring-1 ring-base-content/10 focus:outline-none">
                <div className="px-1 py-1 ">
                    {props.options.map((option, i) => (
                        <MenuItem key={i}>
                            {({ focus }) => (
                                <button
                                    className={classNames({
                                        "card flex flex-row gap-2 items-center w-full p-2 text-sm my-px": true,
                                        "bg-primary/80 text-primary-content": focus,
                                        "bg-primary text-primary-content": props.selectedValue == option.value
                                    })}
                                    onClick={option.handleClick}
                                >
                                    {option.icon}
                                    {option.text}
                                </button>
                            )}
                        </MenuItem>
                    ))}
                </div>
            </MenuItems>
        </Menu>
    );
}

export default DropdownSelect;