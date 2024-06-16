import {ExpensesContext} from "../../context";
import {useContext, useMemo} from "react";
import {isToday} from "date-fns";

export const TodayExpenses = () => {
    const {expensesArray} = useContext(ExpensesContext);
    const lastExpense = useMemo(() => expensesArray.sort((a, b) => b.timestamp - a.timestamp)[0], [expensesArray]);
    const todayItems = useMemo(() => expensesArray.filter(item => isToday(item.timestamp)), [expensesArray]);
    console.log({lastExpense, todayItems});

    return (
        <section className="m-4 w-1/2 h-full bg-white border-8 border-gray-500 shadow p-4">
            <h1 className="text-5xl font-mono">Today's Expenses</h1>
        </section>
    )
}