import { isSameMonth } from "date-fns";
import { useContext, useMemo } from "react";
import { ExpensesContext } from "../../context";
import { CategoriesContext } from "../../context/CategoriesContext";
import { formatCurrency } from "../../utils";
import classNames from "classnames";
const ONE_MONTH_TIMESTAMP = 1000 * 60 * 60 * 24 * 30;

const getExpensesInMonth = (expenses, incomeSubcategoryIds, timestamp) => {
    return expenses.reduce((acc, curr) => {
        const isExpenseThisMonth = isSameMonth(new Date(curr.timestamp), new Date(timestamp));
        if (incomeSubcategoryIds.includes(curr.subcategoryId) || !isExpenseThisMonth) return acc;

        return acc + curr.amount;
    }, 0);
};

const getIncomeInMonth = (expenses, incomeSubcategoryIds, timestamp) => {
    return expenses.reduce((acc, curr) => {
        const isExpenseThisMonth = isSameMonth(new Date(curr.timestamp), new Date(timestamp));
        if (!incomeSubcategoryIds.includes(curr.subcategoryId) || !isExpenseThisMonth) return acc;

        return acc + curr.amount;
    }, 0);
};

export const HalfYearBalanceSummary = ({ currentTimestamp }) => {
    const { expenses } = useContext(ExpensesContext);
    const { categories } = useContext(CategoriesContext);
    // const expenses = [
    //     {
    //         amount: 18000,
    //         subcategoryId: "1",
    //         timestamp: currentTimestamp - ONE_MONTH_TIMESTAMP * 5
    //     },
    //     {
    //         amount: 4500,
    //         subcategoryId: "1",
    //         timestamp: currentTimestamp - ONE_MONTH_TIMESTAMP * 5
    //     },
    //     {
    //         amount: 23400,
    //         subcategoryId: "3",
    //         timestamp: currentTimestamp - ONE_MONTH_TIMESTAMP * 5
    //     },
    //     {
    //         amount: 100,
    //         subcategoryId: "4",
    //         timestamp: currentTimestamp - ONE_MONTH_TIMESTAMP * 5
    //     }
    // ];

    // const categories = [
    //     {
    //         isIncome: true,
    //         subcategories: [
    //             { id: "1" },
    //             { id: "2" }
    //         ]
    //     }
    // ];

    const summary = useMemo(() => {
        const incomes = [];
        const newExpenses = [];
        const bottomLine = [];

        const incomeSubcategoryIds = categories
            .filter(category => category.isIncome)
            .map(category => category.subcategories.map(subcategory => subcategory.id))
            .flat();
        console.log({ expenses, incomeSubcategoryIds });

        for (let i = 0; i >= 12; i--) {
            const expensesInMonth = getExpensesInMonth(expenses, incomeSubcategoryIds, currentTimestamp - ONE_MONTH_TIMESTAMP * i);
            const incomeInMonth = getIncomeInMonth(expenses, incomeSubcategoryIds, currentTimestamp - ONE_MONTH_TIMESTAMP * i);
            newExpenses.push({
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

        const total = bottomLine.reduce((acc, curr) => acc + curr.amount, 0);

        return {
            incomes,
            newExpenses,
            bottomLine,
            total
        };
    }, [currentTimestamp, expenses]);

    return (
        <div className="text-xl p-4">
            <h1 className={classNames("text-4xl w-full text-center font-bold my-4", summary.total > 0 ? "text-green-500" : "text-red-500")}>
                {formatCurrency(summary.total)}
            </h1>
            {summary.incomes.map((income, index) => {
                const incomeAmount = income.amount;
                const expenseAmount = summary.newExpenses[index].amount;
                const bottomLineAmount = summary.bottomLine[index].amount;

                return (
                    <>
                        <h1 className="w-10 text-sm">{income.date.toLocaleString("he-IL", { month: "short" })}</h1>
                        <div key={index} className="flex justify-evenly mb-2 bg-slate-100 p-3 rounded-sm">
                            <span className="text-center font-mono w-20 text-green-500">{formatCurrency(incomeAmount, true, true)}</span>
                            <span className="text-center font-mono w-20 text-red-400">{formatCurrency(-expenseAmount, true, true)}</span>
                            <span className={classNames("text-center font-mono w-20", bottomLineAmount > 0 ? "text-green-500" : "text-red-500")}>
                                {formatCurrency(bottomLineAmount, false, true)}
                            </span>
                        </div>
                    </>
                )
            })}
        </div>
    )
};