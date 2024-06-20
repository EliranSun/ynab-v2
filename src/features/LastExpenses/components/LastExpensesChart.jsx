import {useMemo} from 'react';
import ExpensesChart from "../../../components/pages/BalanceView/ExpensesChart";
import {Timeframe} from "../constants";
import {formatChartDates} from "../utils";

const LastExpensesChart = ({
                               expenses = [],
                               budget = [],
                               income = [],
                               timeframeName = Timeframe.MONTH,
                           }) => {
    const data = useMemo(() => {
        return formatChartDates({expenses, timeframeName});
    }, [expenses, timeframeName]);

    // TODO:
    // console.log({ income });
    // const incomeData = useMemo(() => {
    //     return formatChartDates({expenses: income, timeframeName});
    // }, [income, timeframeName]);

    return (
        <ExpensesChart data={data} />
    );
};

export default LastExpensesChart;