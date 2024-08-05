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
    THIS_WEEK: msg`This week`,
    LAST_WEEK: msg`Last week`,
    THIS_MONTH: msg`This month`,
}
export const MonthNames = [
    msg`January`,
    msg`February`,
    msg`March`,
    msg`April`,
    msg`May`,
    msg`June`,
    msg`July`,
    msg`August`,
    msg`September`,
    msg`October`,
    msg`November`,
    msg`December`,
];