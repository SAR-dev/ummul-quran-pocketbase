import { ReactNode, useMemo } from 'react';
import { useTzCodeStore } from '../stores/tzCodeStore';

function TimeViewer({ dateString, children }: { dateString: string, children: ReactNode }) {
    const { tzCode } = useTzCodeStore()

    const timeFormatter = useMemo(() => {
        return new Intl.DateTimeFormat('en-GB', {
            timeZone: tzCode,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    }, [dateString, tzCode]);

    return (
        <div className="tooltip" data-tip={dateString.length > 0 ? `${tzCode}: ${timeFormatter.format(new Date(dateString)).toUpperCase()}` : "No date"}>
            {children}
        </div>
    );
}

export default TimeViewer