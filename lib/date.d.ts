export declare type DateDelta = {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    months: number;
    years: number;
};
export declare function createDelta({milliseconds, seconds, minutes, hours, days, months, years}: {
    milliseconds?: number;
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
    months?: number;
    years?: number;
}): DateDelta;
export declare function addDateDelta(date: Date, delta: DateDelta): Date;
