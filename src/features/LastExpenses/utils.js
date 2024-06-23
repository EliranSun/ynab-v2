import {Timeframe} from "./constants";
import {format, getWeek} from "date-fns";

export function getOrdinalSuffix(n) {
    const s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const weekOfYearFormat = (date) => getOrdinalSuffix(getWeek(date));

export const formatChartDates = ({expenses, timeframeName, sort = 'asc'}) => {
    const aggregatedBy = {};
    let timeframeFormat = 'd.LL, EEE';  // "1.1, Mon"
    switch (timeframeName) {
        default:
        case Timeframe.WEEK:
            timeframeFormat = 'd.LL, EEE'; // "1.1, Mon"
            break;

        case Timeframe.MONTH:
            timeframeFormat = 'LLL wo yy'; // "Jan 1st 2023"
            break;

        case Timeframe.QUARTER:
            timeframeFormat = 'LLL yy'; // "Jan 2023"
            break;

        case Timeframe.YEAR:
            timeframeFormat = 'LLL yy'; // "Jan 2023"
            break;
    }

    for (const expense of expenses) {
        const timeframe =
            timeframeName === Timeframe.MONTH
                ? `${weekOfYearFormat(expense.timestamp)} week, ${format(expense.timestamp, 'LLL yyyy')}`
                : format(expense.timestamp, timeframeFormat);

        if (!aggregatedBy[timeframe]) {
            aggregatedBy[timeframe] = {
                y: expense.amount,
                x: timeframe,
            };
        } else {
            aggregatedBy[timeframe].y += expense.amount;
        }
    }

    const results = Object.values(aggregatedBy)
        .map(item => ({
            x: item.x,
            y: item.y,
        }));

    if (sort === 'asc') {
        return results.reverse();
    }
}