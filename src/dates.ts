export type DateDelta = {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  months: number;
  years: number;
};

export function createDateDelta({
  milliseconds = 0,
  seconds = 0,
  minutes = 0,
  hours = 0,
  days = 0,
  months = 0,
  years = 0
}): DateDelta {
  return { milliseconds, seconds, minutes, hours, days, months, years };
}

export function addDateDelta(date: Date, delta: DateDelta): Date {
  return new Date(
    date.getFullYear() + delta.years,
    date.getMonth() + delta.months,
    date.getDate() + delta.days,
    date.getHours() + delta.hours,
    date.getMinutes() + delta.minutes,
    date.getSeconds() + delta.seconds,
    date.getMilliseconds() + delta.milliseconds
  );
}

export function multiplyDelta(amount: number, delta: DateDelta): DateDelta {
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
