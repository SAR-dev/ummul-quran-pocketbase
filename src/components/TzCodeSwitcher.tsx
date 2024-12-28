import { GlobeAltIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useTzCodeStore } from '../stores/tzCodeStore';
import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { constants } from '../stores/constantStore';

const TzCodeSwitcher = ({ asMobile }: { asMobile?: boolean }) => {
    const { tzCode, setTzCode } = useTzCodeStore();
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {asMobile ? (
                <button onClick={() => setIsOpen(true)} className="btn btn-ghost justify-start btn-icon rounded-none hover:no-animation">
                    <GlobeAltIcon className='h-5 w-5' />
                    Secondary Region
                </button>
            ) : (
                <button onClick={() => setIsOpen(true)} className="btn btn-square btn-ghost">
                    <GlobeAltIcon className='h-5 w-5' />
                </button>
            )}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-20">
                <DialogBackdrop className="fixed inset-0 bg-base-content/25" />
                <div className="fixed inset-0 flex w-screen items-center justify-center">
                    <DialogPanel className="card p-4 bg-base-100 w-96">
                        <button className="btn btn-square btn-sm absolute top-0 right-0 m-3" onClick={() => setIsOpen(false)}>
                            <XMarkIcon className='h-5 w-5' />
                        </button>
                        <div className="font-semibold">Select Secondary Timezone</div>
                        <select value={tzCode} onChange={e => setTzCode(e.target.value)} className="select select-bordered w-full my-3">
                            {constants.TIMEZONES.map((e, i) => (
                                <option key={i} value={e.tzCode}>
                                    {e.utc} {e.tzCode}
                                </option>
                            ))}
                        </select>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}

export default TzCodeSwitcher;
