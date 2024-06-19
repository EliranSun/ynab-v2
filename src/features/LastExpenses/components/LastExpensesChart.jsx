import {useMemo} from 'react';
import {format} from 'date-fns';
import ExpensesChart from "../../../components/pages/BalanceView/ExpensesChart";

import {Timeframe} from "../constants";


const LastExpensesChart = ({expenses = [], timeframeName = Timeframe.MONTH}) => {
    const data = useMemo(() => {
        const aggregatedBy = {};
        let timeframeFormat = 'd.LL, EEE';
        switch (timeframeName) {
            default:
            case Timeframe.WEEK:
                timeframeFormat = 'd.LL, EEE';
                break;

            case Timeframe.MONTH:
                timeframeFormat = 'LLL wo yy';
                break;

            case Timeframe.QUARTER:
                timeframeFormat = 'LLL yy';
                break;

            case Timeframe.YEAR:
                timeframeFormat = 'LLL yy';
                break;
        }

        for (const expense of expenses) {
            const timeframe = format(expense.timestamp, timeframeFormat);
            if (!aggregatedBy[timeframe]) {
                aggregatedBy[timeframe] = {
                    amount: expense.amount,
                    timestamp: expense.timestamp,
                };
            } else {
                aggregatedBy[timeframe].amount += expense.amount;
            }
        }

        return Object.values(aggregatedBy).map(item => ({
            x: format(item.timestamp, timeframeFormat),
            y: item.amount,
        })).reverse();
    }, [expenses]);


    return (
        <ExpensesChart data={data}/>
    );
};

export default LastExpensesChart;