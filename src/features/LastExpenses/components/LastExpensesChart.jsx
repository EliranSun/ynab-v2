import {useMemo} from 'react';
import ExpensesChart from "../../../components/pages/BalanceView/ExpensesChart";

import {Timeframe} from "../constants";
import {formatChartDates} from "../utils";

const LastExpensesChart = ({
                               expenses = [],
                               timeframeName = Timeframe.MONTH,
                           }) => {
    const data = useMemo(() => {
        return formatChartDates({expenses, timeframeName});
    }, [expenses, timeframeName]);

    console.log({data});

    return (
        <ExpensesChart data={data}/>
    );
};

export default LastExpensesChart;