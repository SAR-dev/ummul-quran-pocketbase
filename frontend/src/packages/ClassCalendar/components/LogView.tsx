import { getDateFromString } from "../helpers/calendar";
import { CalendarDataType } from "../types/types";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import ClassLogView from "../../../components/ClassLogView";

const LogView = ({
    data
}: {
    data: CalendarDataType[]
}) => {
    const groupedData = useMemo(() => {
        return data.reduce((acc, item) => {
            const date = getDateFromString(item.start_at);
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {} as { [key: string]: CalendarDataType[] });
    }, [data]);

    const sortedKeys = Object.keys(groupedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return (
        <div className="grid grid-cols-1">
            {sortedKeys.map((key, i) => (
                <div className="w-full my-5" key={i}>
                    <div className="text-sm flex items-center gap-2 mb-2"><CalendarIcon className="h-5 w-5" /> {key}</div>
                    <div className="grid grid-cols-1 gap-3">
                        {groupedData[key].map((e, i) => (
                            <ClassLogView 
                                id={e.id}
                                completed={e.completed}
                                start_at={e.start_at}
                                finish_at={e.finish_at}
                                student={e.student}
                                student_mobile={e.student_mobile}
                                class_mins={e.class_mins}
                                key={i} 
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default LogView
