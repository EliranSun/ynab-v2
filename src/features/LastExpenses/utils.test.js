import {formatChartDates, weekOfYearFormat} from './utils';
import {Timeframe} from './constants';

describe('weekOfYearFormat', () => {
    it('Should return st', () => {
        const result = weekOfYearFormat(new Date(2024, 0, 1));
        expect(result).toBe('1st');
    });

    it('Should return nd', () => {
        const result = weekOfYearFormat(new Date(2024, 4, 27));
        expect(result).toBe('22nd');
    });

    it('Should return rd', () => {
        const result = weekOfYearFormat(new Date(2024, 9, 21));
        expect(result).toBe('43rd');
    });

    it('Should return th', () => {
        const result = weekOfYearFormat(new Date(2024, 8, 2));
        expect(result).toBe('36th');
    });
});

describe('formatChartDate', () => {
    test('formatChartDate WEEK timeframe', () => {
        const result = formatChartDates({
            timeframeName: Timeframe.WEEK,
            expenses: [
                {timestamp: new Date(2023, 0, 1), amount: 100},
                {timestamp: new Date(2023, 0, 1), amount: 100},
                {timestamp: new Date(2023, 0, 2), amount: 200},
                {timestamp: new Date(2023, 0, 10), amount: 150},
                {timestamp: new Date(2023, 0, 15), amount: 250},
            ],
        });
        expect(result).toEqual([
            {x: '15.01, Sun', y: 250},
            {x: '10.01, Tue', y: 150},
            {x: '2.01, Mon', y: 200},
            {x: '1.01, Sun', y: 200},
        ]);
    });

    test('formatChartDate MONTH timeframe', () => {
        const result = formatChartDates({
            timeframeName: Timeframe.MONTH,
            expenses: [
                {timestamp: new Date(2024, 0, 1), amount: 100}, // week 1, 2023
                {timestamp: new Date(2024, 0, 1), amount: 200}, // week 1, 2023
                {timestamp: new Date(2024, 0, 2), amount: 200}, // week 1, 2023
                {timestamp: new Date(2024, 0, 10), amount: 150}, // week 2, 2023
                {timestamp: new Date(2024, 0, 10), amount: 150}, // week 2, 2023
                {timestamp: new Date(2024, 0, 15), amount: 500}, // week 3, 2023
            ],
        });

        expect(result).toEqual([
            {x: '3rd week, 2024', y: 500},
            {x: '2nd week, 2024', y: 300},
            {x: '1st week, 2024', y: 500},
        ]);
    });

    test('formatChartDate QUARTER timeframe', () => {
        const result = formatChartDates({
            timeframeName: Timeframe.QUARTER,
            expenses: [
                {timestamp: new Date(2023, 0, 1), amount: 100}, // Jan 2023
                {timestamp: new Date(2023, 0, 1), amount: 200}, // Jan 2023
                {timestamp: new Date(2023, 2, 1), amount: 300}, // Mar 1, 2023
                {timestamp: new Date(2023, 2, 1), amount: 300}, // Mar 1, 2023
            ]
        });
        expect(result).toEqual([
            {x: 'Mar 23', y: 600}, // Mar 1, 2023
            {x: 'Jan 23', y: 300}, // Jan 2023 total
        ]);
    });

    test('formatChartDate YEAR timeframe', () => {
        const result = formatChartDates({
            timeframeName: Timeframe.YEAR,
            expenses: [
                {timestamp: new Date(2023, 0, 1), amount: 100}, // Jan 2023
                {timestamp: new Date(2023, 0, 1), amount: 200}, // Jan 2023
                {timestamp: new Date(2023, 2, 1), amount: 300}, // Mar 1, 2023
                {timestamp: new Date(2023, 2, 1), amount: 300}, // Mar 1, 2023
            ]
        });
        expect(result).toEqual([
            {x: 'Mar 23', y: 600}, // Mar 1, 2023
            {x: 'Jan 23', y: 300}, // Jan 2023 total
        ]);
    });

    test('formatChartDate with empty expenses', () => {
        const result = formatChartDates({
            expenses: [], timeframeName: Timeframe.WEEK
        });
        expect(result).toEqual([]);
    });
});