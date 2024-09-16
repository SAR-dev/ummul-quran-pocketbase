export enum CalendarViewTypes {
    DAY, WEEK, MONTH
}

export interface CalendarDataType {
    id: number;
    title: string;
    start_at: string;
    end_at: string;
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