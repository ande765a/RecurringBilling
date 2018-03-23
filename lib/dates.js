"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createDateDelta({ milliseconds = 0, seconds = 0, minutes = 0, hours = 0, days = 0, months = 0, years = 0 }) {
    return { milliseconds, seconds, minutes, hours, days, months, years };
}
exports.createDateDelta = createDateDelta;
function addDateDelta(date, delta) {
    return new Date(date.getFullYear() + delta.years, date.getMonth() + delta.months, date.getDate() + delta.days, date.getHours() + delta.hours, date.getMinutes() + delta.minutes, date.getSeconds() + delta.seconds, date.getMilliseconds() + delta.milliseconds);
}
exports.addDateDelta = addDateDelta;
function multiplyDelta(amount, delta) {
    return {
        milliseconds: amount * delta.milliseconds,
        seconds: amount * delta.seconds,
        minutes: amount * delta.minutes,
        hours: amount * delta.hours,
        days: amount * delta.days,
        months: amount * delta.months,
        years: amount * delta.years
    };
}
exports.multiplyDelta = multiplyDelta;
