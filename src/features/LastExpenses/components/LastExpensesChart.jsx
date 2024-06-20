import {useMemo} from 'react';
import {format, getWeek} from 'date-fns';
import ExpensesChart from "../../../components/pages/BalanceView/ExpensesChart";

import {Timeframe} from "../constants";
import {getOrdinalSuffix} from "../utils";

const LastExpensesChart = ({
                               expenses = [],
                               timeframeName = Timeframe.MONTH,
                           }) => {
    const data = useMemo(() => {
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
                    ? getWeek(expense.timestamp) + ' ' + getOrdinalSuffix(expense.timestamp.getMonth() + 1)
                    : format(expense.timestamp, timeframeFormat);

            if (!aggregatedBy[timeframe]) {
                aggregatedBy[timeframe] = {
                    amount: expense.amount,
                    timestamp: expense.timestamp,
                };
            } else {
                aggregatedBy[timeframe].amount += expense.amount;
            }
        }

        return Object.values(aggregatedBy)
            .map(item => ({
                x: format(item.timestamp, timeframeFormat),
                y: item.amount,
            }))
            .reverse();
    }, [expenses]);


    console.log({data});

    return (
        <ExpensesChart data={data}/>
    );
};

export default LastExpensesChart;