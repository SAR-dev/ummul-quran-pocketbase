export enum CalendarViewTypes {
    DAY,  MONTH, LOGS
}

export interface CalendarDataType {
    id: number | string;
    title: string;
    start_at: string;
    student: string;
    student_mobile: string;
    class_mins: number;
    finish_at?: string;
    finished?: boolean;
    teachers_price?: number;
    students_price?: number;
}

export interface TimeRangeType {
    start: string;
    end: string;
}

export interface TimeRangeEventsType {
    start: string;
    end: string;
    events: CalendarDataType[]
}