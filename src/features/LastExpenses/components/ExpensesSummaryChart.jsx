import {useMemo} from 'react';
import ExpensesChart from "../../../components/pages/BalanceView/ExpensesChart";
import {Timeframe} from "../constants";
import {formatChartDates} from "../utils";
import {ChartType} from "../../../components/pages/BalanceView/useBasicChart";

const ExpensesSummaryChart = ({
                                  expenses = [],
                                  budget = 0,
                                  income = [],
                                  timeframeName = Timeframe.MONTH,
                              }) => {
    const data = useMemo(() => {
        return formatChartDates({expenses, timeframeName});
    }, [expenses, timeframeName]);

    const incomeData = useMemo(() => {
        let totalIncome = income.reduce((acc, item) => item.amount + acc, 0);

        switch (timeframeName) {
            case Timeframe.WEEK:
                totalIncome = totalIncome / 7;
                break;
            case Timeframe.MONTH:
                totalIncome = totalIncome / 4;
                break;
            case Timeframe.YEAR:
                totalIncome = totalIncome / 12;
                break;
            default:
                break;
        }

        let incomeExpenses = new Array(data.length).fill(null).map((_, index) => ({
            x: data[index].x,
            y: totalIncome
        }));

        console.log({incomeExpenses})

        // return formatChartDates({expenses: incomeExpenses, timeframeName});
        return incomeExpenses;
    }, [data, income, timeframeName]);

    const budgetData = useMemo(() => {
        return new Array(data.length).fill(null).map((_, index) => ({
            x: data[index].x,
            y: budget
        }));
    }, [data, budget, timeframeName]);

    return (
        <ExpensesChart data={data} type={ChartType.BAR} incomeData={incomeData} budgetData={budgetData}/>
    );
};

export default ExpensesSummaryChart;