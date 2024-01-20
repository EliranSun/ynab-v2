import { useMemo } from "react";
import { Title } from "../atoms";
import { withExpensesContext } from "../../HOC/withExpensesContext";
import { getExistingExpenses } from "../../utils/expenses";
import { Check, X } from "@phosphor-icons/react";
import { noop } from "lodash";
import Expense from "./ExpenseView/Expense";

const SeeingDoublePage = ({
    expenses = [],
    deleteExpense = noop,
    refetchExpenses = noop,
    markExpensesAsOriginal = noop
}) => {
    const forgottenExpenses = useMemo(() => {
        return expenses.filter(expense => {
            return !expense.categoryId;
        });
    }, [expenses]);

    const duplicateExpenses = useMemo(() => {
        const duplicates = [];
        const keys = [];
        expenses.forEach(expense => {
            const existing = getExistingExpenses(expense, expenses);
            const key = `${expense.name}-${expense.amount}-${expense.timestamp}`;

            if (existing.length > 1 && !keys.includes(key) && !expense.isOriginal) {
                duplicates.push(existing);
                keys.push(key);
            }
        });

        return duplicates.sort((a, b) => {
            return b[0].timestamp - a[0].timestamp;
        });
    }, [expenses]);

    return (
        <section className="">
            <Title>Seeing Double</Title>
            <Title type={Title.Types.H2}>
                {duplicateExpenses.length === 0
                    ? "Yay, no duplicates! 🎉🎊🥳" :
                    `${expenses.length} expenses, ${duplicateExpenses.length} duplicates`}
            </Title>
            <div className="flex flex-wrap my-4 w-full items-stretch md:gap-4">
                {duplicateExpenses.map((expenses, index) => {
                    return (
                        <div key={index} className="bg-gray-200 p-2 m-1 w-full md:w-1/6 relative min-w-fit flex gap-2">
                            <span
                                onClick={async () => {
                                    if (window.confirm("Are you sure you want to mark these expenses as not duplicated?")) {
                                        await markExpensesAsOriginal(expenses.map(expense => expense.id));
                                        refetchExpenses();
                                    }
                                }}
                                className="absolute bottom-0 -right-3 z-10 bg-white rounded-full drop-shadow p-1 cursor-pointer">
                                <Check size={20} color="green"/>
                            </span>
                            {expenses.map(expense => {
                                return (
                                    <div key={expense.id} className="relative bg-gray-100 p-2">
                                        <span
                                            className="absolute top-0 -left-5 bg-white rounded-full drop-shadow p-1 cursor-pointer"
                                            onClick={async () => {
                                                deleteExpense(expense.id);
                                                refetchExpenses()
                                            }}>
                                            <X size={20} color="red"/>
                                        </span>
                                        <p><b>{expense.name}</b></p>
                                        <p>{expense.amountCurrency}</p>
                                        <p>{expense.subcategoryLabel}</p>
                                        <p>{expense.date}</p>
                                        <p className="text-sm">{expense.note}</p>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
            <Title type={Title.Types.H2}>
                {forgottenExpenses.length === 0
                    ? "No forgotten expenses! 🎉🎊🥳" :
                    `${forgottenExpenses.length} forgotten`}
            </Title>
            <div className="flex flex-wrap my-4 w-full items-stretch md:gap-4">
                {forgottenExpenses.map(expense => {
                    return <Expense expense={expense}/>;
                })}
            </div>
        </section>
    )
}

export default withExpensesContext(SeeingDoublePage);