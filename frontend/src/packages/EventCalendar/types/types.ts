export enum CalendarViewTypes {
    DAY, WEEK, MONTH
}

export interface CalendarDataType {
    id: number | string;
    title: string;
    start_at: string;
    finish_at?: string;
    completed?: boolean;
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