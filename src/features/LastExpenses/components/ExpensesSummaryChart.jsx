import {useMemo} from 'react';
import ExpensesChart from "../../../components/pages/BalanceView/ExpensesChart";
import {Timeframe} from "../constants";
import {formatChartDates} from "../utils";
import {ChartType} from "../../../components/pages/BalanceView/useBasicChart";
import {getDaysInMonth, getWeeksInMonth} from "date-fns";

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
        const date = expenses[0]?.timestamp;
        console.log({totalIncome});

        switch (timeframeName) {
            case Timeframe.WEEK:
                totalIncome = totalIncome / getDaysInMonth(date);
                break;
            case Timeframe.MONTH:
                totalIncome = totalIncome / data.length;
                break;
            case Timeframe.YEAR:
                totalIncome = totalIncome / data.length;
                break;

            default:
                break;
        }

        return new Array(data.length).fill(null).map((_, index) => ({
            x: data[index].x,
            y: totalIncome
        }));
    }, [data, income, timeframeName]);

    const budgetData = useMemo(() => {
        let budgetForTimeframe = budget;
        switch (timeframeName) {
            case Timeframe.WEEK:
                budgetForTimeframe = budget / 7;
                break;
            case Timeframe.MONTH:
                budgetForTimeframe = budget / 4;
                break;
            case Timeframe.YEAR:
                budgetForTimeframe = budget / 12;
                break;

            default:
                break;
        }

        return new Array(data.length).fill(null).map((_, index) => ({
            x: data[index].x,
            y: budgetForTimeframe
        }));
    }, [data, timeframeName, budget]);

    return (
        <ExpensesChart data={data} type={ChartType.BAR} incomeData={incomeData} budgetData={budgetData}/>
    );
};

export default ExpensesSummaryChart;