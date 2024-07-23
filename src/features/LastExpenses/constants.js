import {msg} from '@lingui/macro';

export const Timeframe = {
    WEEK: "WEEK",
    MONTH: "MONTH",
    QUARTER: "QUARTER",
    YEAR: "YEAR",
};

export const TimeframeNames = {
    [Timeframe.WEEK]: msg`this week`,
    [Timeframe.MONTH]: msg`this month`,
    [Timeframe.QUARTER]: msg`this quarter`,
    [Timeframe.YEAR]: msg`this year`,
};

export const INCOME_CATEGORY_ID = '8';

export const FilterName = {
    THIS_WEEK: "This week",
    LAST_WEEK: "Last week",
    THIS_MONTH: "This month",
}
export const MonthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];