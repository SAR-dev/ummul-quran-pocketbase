import { CalendarDataType, TimeRangeEventsType, TimeRangeType } from "../types/calendar";

export const weekdays = [
    {
        longName: "Monday",
        shortName: "Mon",
        index: 1
    },
    {
        longName: "Tuesday",
        shortName: "Tue",
        index: 2
    },
    {
        longName: "Wednesday",
        shortName: "Wed",
        index: 3
    },
    {
        longName: "Thursday",
        shortName: "Thu",
        index: 4
    },
    {
        longName: "Friday",
        shortName: "Fri",
        index: 5
    },
    {
        longName: "Saturday",
        shortName: "Sat",
        index: 6
    },
    {
        longName: "Sunday",
        shortName: "Sun",
        index: 7
    }
];

export const months = [
    {
        longName: "January",
        shortName: "Jan",
        index: 1
    },
    {
        longName: "February",
        shortName: "Feb",
        index: 2
    },
    {
        longName: "March",
        shortName: "Mar",
        index: 3
    },
    {
        longName: "April",
        shortName: "Apr",
        index: 4
    },
    {
        longName: "May",
        shortName: "May",
        index: 5
    },
    {
        longName: "June",
        shortName: "Jun",
        index: 6
    },
    {
        longName: "July",
        shortName: "Jul",
        index: 7
    },
    {
        longName: "August",
        shortName: "Aug",
        index: 8
    },
    {
        longName: "September",
        shortName: "Sep",
        index: 9
    },
    {
        longName: "October",
        shortName: "Oct",
        index: 10
    },
    {
        longName: "November",
        shortName: "Nov",
        index: 11
    },
    {
        longName: "December",
        shortName: "Dec",
        index: 12
    }
];

export const weeks = [1, 2, 3, 4, 5]

export const timeRanges: TimeRangeType[] = [
    { start: "00:00", end: "01:00" },
    { start: "01:00", end: "02:00" },
    { start: "02:00", end: "03:00" },
    { start: "03:00", end: "04:00" },
    { start: "04:00", end: "05:00" },
    { start: "05:00", end: "06:00" },
    { start: "06:00", end: "07:00" },
    { start: "07:00", end: "08:00" },
    { start: "08:00", end: "09:00" },
    { start: "09:00", end: "10:00" },
    { start: "10:00", end: "11:00" },
    { start: "11:00", end: "12:00" },
    { start: "12:00", end: "13:00" },
    { start: "13:00", end: "14:00" },
    { start: "14:00", end: "15:00" },
    { start: "15:00", end: "16:00" },
    { start: "16:00", end: "17:00" },
    { start: "17:00", end: "18:00" },
    { start: "18:00", end: "19:00" },
    { start: "19:00", end: "20:00" },
    { start: "20:00", end: "21:00" },
    { start: "21:00", end: "22:00" },
    { start: "22:00", end: "23:00" },
    { start: "23:00", end: "00:00" }
];


export const getYearsRange = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const endYear = currentYear + 5;

    const years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }

    return years;
}


const getWeekOfMonth = (date: Date): number => {
    // Get the first day of the month
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    // Get the day of the week (Monday as the start)
    const dayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Adjust so Monday is day 0

    // Calculate the offset based on the start of the week
    const offset = dayOfWeek; // Days before the first Monday of the month

    // Get the current day of the month
    const dayOfMonth = date.getDate();

    // Calculate the week number
    return Math.ceil((dayOfMonth + offset) / 7);
};

export const getDayOfWeekIndex = (date: Date): number => {
    // getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const day = date.getDay();
    // Adjust so Monday is 1 and Sunday is 7
    return day === 0 ? 7 : day;
};

export const getWeeksByYearAndMonth = (year: number, month: number) => {
    const weeks: { [key: number]: { [key: number]: number } } = {}; // Store weeks as key-value pairs
    const date = new Date(year, month - 1, 1); // Start from the first day of the month

    // Loop through all days of the month
    while (date.getMonth() === month - 1) {
        const dayPosition = getDayOfWeekIndex(date);
        const weekNo = getWeekOfMonth(date); // Get week number starting from Monday

        // If the week number doesn't exist, initialize it as an empty array
        if (!weeks[weekNo]) {
            weeks[weekNo] = {};
        }

        // Push the day into the corresponding week
        weeks[weekNo][dayPosition] = date.getDate();

        date.setDate(date.getDate() + 1); // Move to the next day
    }

    return weeks;
};

export const getWeekday = (year: number, month: number, date: number) => {
    // Create a new Date object
    const dateObject = new Date(year, month - 1, date); // month is 0-indexed in JS Date

    // Return the corresponding weekday name
    return dateObject.toLocaleDateString('en-us', { weekday: 'long' });
}

export const getDaysOfMonth = (year: number, month: number) => {
    // Get the number of days in the given month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Create an array with all the days of the month
    const daysArray = [];
    for (let day = 1; day <= daysInMonth; day++) {
        daysArray.push(day);
    }

    return daysArray;
}

export const isMatchingDate = ({
    dateObject,
    year,
    month,
    date
}: {
    dateObject: Date,
    year: number,
    month: number,
    date: number
}): boolean => {
    return (
        dateObject.getFullYear() === year &&
        (dateObject.getMonth() + 1) === month &&
        dateObject.getDate() === date
    );
};


export function formatTimestampToTime(timestamp?: string) {
    if (!timestamp) return "Pending";
    const date = new Date(timestamp);
    return `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
}

export const filterDayViewData = ({
    year,
    month,
    date,
    data
}: {
    year: number,
    month: number,
    date: number,
    data: CalendarDataType[]
}): TimeRangeEventsType[] => {
    return timeRanges.map(timeRange => {
        return {
            ...timeRange,
            events: data.filter(event =>
                isMatchingDate({
                    dateObject: new Date(event.start_at),
                    year,
                    month,
                    date
                }) &&
                formatTimestampToTime(event.start_at) >= timeRange.start &&
                formatTimestampToTime(event.start_at) < timeRange.end
            ),
        };
    });
}

export const dateToUtc = (date: Date) => `${date.toISOString().slice(0, 10)} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}.000Z`

export const getTimeIn12HourFormat = (val: string) => {
    const date = new Date(val);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

export const getDateFromString = (dateString?: string) => {
    if(!dateString) return;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = months[date.getMonth()].shortName
    const day = String(date.getDate()).padStart(2, '0');
    return `${day} ${month}, ${year}`;
};

export const getTimeOffset = () => {
    const offset = new Date().getTimezoneOffset(); // Get the offset in minutes
    const sign = offset <= 0 ? '+' : '-'; // Determine the sign
    const absOffsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0'); // Absolute hours with leading zero
    const absOffsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0'); // Absolute minutes with leading zero

    return `${sign}${absOffsetHours}:${absOffsetMinutes}`;
}

export const formatTimezoneOffset = (offset?: number) => {
    if(!offset) return;
    const sign = offset >= 0 ? "+" : "-";
    const absOffset = Math.abs(offset);
    const hours = Math.floor(absOffset).toString().padStart(2, "0");
    const minutes = ((absOffset * 60) % 60).toString().padStart(2, "0");
    
    return `${sign}${hours}:${minutes}`;
}