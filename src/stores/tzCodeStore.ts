import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { constants } from './constantStore'

type TzCodeStore = {
    tzCode: string
    setTzCode: (props: string) => void
}

export const useTzCodeStore = create<TzCodeStore>()(
    persist(
        (set) => ({
            tzCode: constants.TIMEZONES[0].tzCode,
            setTzCode: (value: string) => {
                set(() => ({ tzCode: value }))
            },
        }), {
        name: constants.TZCODE_STORE_KEY,
        storage: createJSONStorage(() => localStorage),
    })
)