import {isSameMonth} from "date-fns";
import {useContext, useMemo} from "react";
import {ExpensesContext} from "../../context";

const ONE_MONTH_TIMESTAMP = 1000 * 60 * 60 * 24 * 30;
const getExpensesInMonth = (expenses, timestamp) => {
    return expenses.reduce((acc, curr) => {
        const isExpenseThisMonth = isSameMonth(new Date(curr.timestamp), new Date(timestamp));
        if (curr.isIncome || !isExpenseThisMonth) return acc;

        return acc + curr.amount;
    }, 0);
};
const getIncomeInMonth = (expenses, timestamp) => {
    return expenses.reduce((acc, curr) => {
        const isExpenseThisMonth = isSameMonth(new Date(curr.timestamp), new Date(timestamp));
        if (!curr.isIncome || !isExpenseThisMonth) return acc;

        return acc + curr.amount;
    }, 0);
};
export const HalfYearBalanceSummary = ({currentTimestamp}) => {
    const {expensesArray} = useContext(ExpensesContext);

    const summary = useMemo(() => {
        const incomes = [];
        const expenses = [];
        const bottomLine = [];

        for (let i = 5; i >= 0; i--) {
            const expensesInMonth = getExpensesInMonth(expensesArray, currentTimestamp - ONE_MONTH_TIMESTAMP * i);
            const incomeInMonth = getIncomeInMonth(expensesArray, currentTimestamp - ONE_MONTH_TIMESTAMP * i);
            expenses.push({
                amount: parseInt(expensesInMonth),
                date: new Date(currentTimestamp - ONE_MONTH_TIMESTAMP * i)
            });
            incomes.push({
                amount: parseInt(incomeInMonth),
                date: new Date(currentTimestamp - ONE_MONTH_TIMESTAMP * i)
            });
            bottomLine.push({
                amount: parseInt(incomeInMonth - expensesInMonth),
                date: new Date(currentTimestamp - ONE_MONTH_TIMESTAMP * i)
            });
        }

        const total = bottomLine.reduce((acc, curr) => acc + curr.amount, 5970.68);

        return {
            incomes,
            expenses,
            bottomLine,
            total
        };
    }, [currentTimestamp, expensesArray]);

    return (
        <div>
            {summary.incomes.map((income, index) => {
                const incomeAmount = income.amount;
                const expenseAmount = summary.expenses[index].amount;
                const bottomLineAmount = summary.bottomLine[index].amount;

                return (
                    <div key={index} className="flex gap-2 ">
                        <span className="w-10">{income.date.toLocaleString("en-GB", {month: "short"})}</span>
                        <span className="w-20 text-center text-green-500">{incomeAmount}</span>
                        <span className="w-4 text-center">-</span>
                        <span className="w-20 text-center text-red-400">{expenseAmount}</span>
                        <span className="text-blue-500">{bottomLineAmount}</span>
                    </div>
                )
            })}
            {summary.total}
        </div>
    )
};