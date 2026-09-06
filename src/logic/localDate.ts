const padDatePart = (value: number) => String(value).padStart(2, "0");

export function formatLocalDate(date = new Date()) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

export function getMillisecondsUntilNextLocalMidnight(now = new Date()) {
  const nextMidnight = new Date(now);
  nextMidnight.setDate(nextMidnight.getDate() + 1);
  nextMidnight.setHours(0, 0, 0, 0);
  return Math.max(1, nextMidnight.getTime() - now.getTime());
}
