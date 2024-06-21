import {useMemo} from 'react';
import ExpensesChart from "../../../components/pages/BalanceView/ExpensesChart";
import {Timeframe} from "../constants";
import {formatChartDates} from "../utils";
import {ChartType} from "../../../components/pages/BalanceView/useBasicChart";

const LastExpensesChart = ({
                               expenses = [],
                               budget = 0,
                               income = [],
                               timeframeName = Timeframe.MONTH,
                           }) => {
    const data = useMemo(() => {
        return formatChartDates({expenses, timeframeName});
    }, [expenses, timeframeName]);

    // TODO:
    const incomeData = useMemo(() => {
        return formatChartDates({expenses: income, timeframeName});
    }, [income, timeframeName]);

    const budgetData = useMemo(() => {
        const foo = new Array(data.length).fill(null).map((_, index) => ({
            timestamp: expenses[index].timestamp,
            amount: budget
        }));

        return formatChartDates({
            timeframeName,
            expenses: foo
        });
    }, [data, budget, timeframeName]);

    console.log({budget, budgetData, incomeData, data});

    return (
        <ExpensesChart data={data} type={ChartType.BAR} incomeData={incomeData} budgetData={budgetData}/>
    );
};

export default LastExpensesChart;