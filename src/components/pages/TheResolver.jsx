import {useState, useMemo} from "react";
import {Title} from "../atoms";
import {withExpensesContext} from "../../HOC/withExpensesContext";
import {getExistingExpenses} from "../../utils/expenses";
import {Check, X} from "@phosphor-icons/react";
import {noop} from "lodash";
import Expense from "./ExpenseView/Expense";
import {Trans} from "@lingui/macro";

const DoubleExpenseItem = ({expense, deleteExpense}) => {
    const [optimisticIsDeleted, setOptimisticIsDeleted] = useState(false);

    if (optimisticIsDeleted) {
        return (
            <div className="relative w-full bg-gray-100 p-2 flex items-center">
                DELETED
            </div>
        );
    }

    return (
        <div className="relative w-full bg-gray-100 p-2 flex items-center">
            <span
                className="w-10 h-10 mx-4 bg-white rounded-full drop-shadow p-1 cursor-pointer flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => {
                    deleteExpense(expense.id);
                    setOptimisticIsDeleted(true);
                }}>
                <X size={20}/>
            </span>
            <div>
                <p><b>{expense.name}</b></p>
                <p className="text-sm">{expense.amountCurrency}</p>
                <p className="text-sm">{expense.subcategoryLabel}</p>
                <p className="text-sm">{expense.date}</p>
                <p className="text-sm">{expense.note}</p>
            </div>
        </div>
    );
};

const TheResolver = ({
                         expenses = [],
                         deleteExpense = noop,
                         refetchExpenses = noop,
                         markExpensesAsOriginal = noop
                     }) => {
    const forgottenExpenses = useMemo(() => {
        const forgotten = expenses.filter(expense => {
            return !expense.subcategoryId;
        });

        const aggregatedByName = forgotten.reduce((acc, expense) => {
            if (!acc[expense.name]) {
                acc[expense.name] = [];
            }

            acc[expense.name] = expense;

            return acc;
        }, {});

        return Object.values(aggregatedByName);
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
            <Title><Trans>The Resolver</Trans></Title>
            <Title type={Title.Types.H2}>
                {duplicateExpenses.length === 0
                    ? <>
                        <Trans>No duplicates</Trans>! 🎉🎊🥳
                    </> : (
                        <>
                            {expenses.length} <Trans>expenses</Trans> {duplicateExpenses.length}{' '}
                            <Trans>duplicates</Trans>
                        </>
                    )
                }
            </Title>
            <div className="flex flex-wrap my-4 w-full items-stretch md:gap-4">
                {duplicateExpenses.map((expenses, index) => {
                    return (
                        <div key={index} className="bg-gray-200 p-2 m-1 w-full md:w-1/2 relative min-w-fit flex gap-2">
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
                                    <DoubleExpenseItem
                                        key={expense.id}
                                        expense={expense}
                                        deleteExpense={() => deleteExpense(expense.id)}/>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
            <Title type={Title.Types.H2}>
                {forgottenExpenses.length === 0
                    ? <><Trans>No forgotten expenses</Trans>🎉🎊🥳</> :
                    <>{forgottenExpenses.length} <Trans>forgotten</Trans></>}
            </Title>
            <div className="flex flex-wrap my-4 w-full items-stretch md:gap-4">
                {forgottenExpenses.map(expense => {
                    return (
                        <Expense
                            key={expense.id}
                            expense={expense} isListView/>
                    );
                })}
            </div>
        </section>
    )
}

export default withExpensesContext(TheResolver);