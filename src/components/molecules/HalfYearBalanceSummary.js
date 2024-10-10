import {isSameMonth} from "date-fns";
import {useContext, useMemo} from "react";
import {ExpensesContext} from "../../context";
import {CategoriesContext} from "../../context/CategoriesContext";

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

export const HalfYearBalanceSummary = ({currentTimestamp}) => {
    const {expenses} = useContext(ExpensesContext);
    const {categories} = useContext(CategoriesContext);

    const summary = useMemo(() => {
        const incomes = [];
        const newExpenses = [];
        const bottomLine = [];

        const incomeSubcategoryIds = categories
            .filter(category => category.isIncome)
            .map(category => category.subcategories.map(subcategory => subcategory.id))
            .flat();
        console.log({expenses, incomeSubcategoryIds});

        for (let i = 5; i >= 0; i--) {
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

        const total = bottomLine.reduce((acc, curr) => acc + curr.amount, 5970.68);

        return {
            incomes,
            newExpenses,
            bottomLine,
            total
        };
    }, [currentTimestamp, expenses]);

    return (
        <div>
            {summary.incomes.map((income, index) => {
                const incomeAmount = income.amount;
                const expenseAmount = summary.newExpenses[index].amount;
                const bottomLineAmount = summary.bottomLine[index].amount;

                return (
                    <div key={index} className="flex gap-2 ">
                        <span className="w-10">{income.date.toLocaleString("he-IL", {month: "short"})}</span>
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