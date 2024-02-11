import {useMemo, useState} from "react";
import {aggregateTransactionsByName, formatCurrency, getExpenseCategoryName,} from "../../../utils";
import {Title} from "../../atoms";
import {isSameDay} from "date-fns";
import classNames from "classnames";

const TopExpensesView = ({expenses, isSameDate, toDate, date = ''}) => {
    // returns a list of expenses that are above 100 NIS
    const [topAmount, setTopAmount] = useState(0);
    const [selectedExpenseName, setSelectedExpenseName] = useState(null);
    const [isAggregateView, setIsAggregateView] = useState(false);
    const [sum] = useState(0);
    const [textareaExpenses, setTextareaExpenses] = useState("");
    const [comparisonResults, setComparisonResults] = useState([]);

    const items = useMemo(() => {
        if (isAggregateView) {
            return aggregateTransactionsByName(expenses, isSameDate, true).filter(
                (expense) =>
                    expense.amount > topAmount &&
                    !expense.isIncome &&
                    isSameDate(expense.timestamp)
            );
        }
        return expenses.filter(
            (expense) =>
                expense.amount > topAmount &&
                !expense.isIncome &&
                isSameDate(expense.timestamp)
        );
    }, [expenses, isAggregateView, isSameDate, topAmount]);

    const totalAmount = useMemo(
        () => items.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2),
        [items]
    );

    return (
        <div>
            <Title type={Title.Types.H2}>{items.length} Expenses above {topAmount} NIS in {date}</Title>
            <h3 className="float top right">
                Subtotal:{" "}
                {Object.values(sum).reduce((acc, curr) => acc + curr, 0)}
            </h3>
            <div className="w-fit flex flex-col border border-black shadow p-4">
                <div>
                    <span className="w-44 mr-2 inline-block">Aggregate same name?</span>
                    <input
                        id="aggregateView"
                        type="checkbox"
                        onClick={() => setIsAggregateView(!isAggregateView)}
                    />
                </div>
                <span>
                    <span className="w-44 mr-2 inline-block">Show expenses above</span>
                    <input
                        className="w-20 border-b border-black"
                        type="number"
                        id="topAmount"
                        defaultValue={topAmount}
                        onChange={(event) => setTopAmount(Number(event.target.value))}
                    />
                    <label htmlFor="topAmount">NIS</label>
                </span>
            </div>
            <div>
                    <textarea
                        value={textareaExpenses}
                        onChange={(event) => setTextareaExpenses(event.target.value)}
                        placeholder="Paste expenses rows here to compare with existing expenses. 
                        Good for when there's a discrepancy between the bank and the app."
                        className="w-full"/>
                <button onClick={() => {
                    setComparisonResults([]);
                    
                    const expensesFromTextarea = textareaExpenses.split("\n").map((row) => {
                        const expenseData = row?.split("\t");
                        const day = expenseData[1].split("/")[0];
                        const month = expenseData[1].split("/")[1];
                        const year = expenseData[1].split("/")[2];

                        return {
                            name: expenseData[0],
                            dateString: expenseData[1],
                            date: new Date(`20${year}-${month}-${day}`),
                            amount: parseInt(Number(expenseData[4]?.split(' ')[0])),
                        };
                    });

                    expenses.filter(expense => isSameDate(expense.timestamp)).forEach(expense => {
                        const matchingExpense = expensesFromTextarea.find((e) => {
                            const isSame = isSameDay(e.date, new Date(expense.timestamp));
                            // console.log({
                            //     name: e.name,
                            //     bankDate: e.date,
                            //     bankDateString: e.dateString,
                            //     appDate: new Date(expense.timestamp),
                            //     isSameDay: isSame,
                            // });
                            //
                            // debugger;
                            return e.name === expense.name && isSame;
                        });
                        if (matchingExpense && matchingExpense.amount !== parseInt(expense.amount)) {
                            setComparisonResults((prev) => {
                                    return [
                                        ...prev,
                                        {
                                            name: expense.name,
                                            appAmount: expense.amount,
                                            bankAmount: matchingExpense.amount,
                                            difference: matchingExpense.amount - parseInt(expense.amount),
                                        },
                                    ];
                                }
                            );
                        }
                    });

                    expensesFromTextarea.forEach((expense) => {
                        const matchingExpense = expenses.find((e) => e.name === expense.name);
                        if (!matchingExpense) {
                            setComparisonResults((prev) => {
                                return [
                                    ...prev,
                                    {
                                        name: expense.name,
                                        appAmount: 0,
                                        bankAmount: expense.amount,
                                        difference: -expense.amount,
                                    },
                                ];
                            });
                        }
                    });
                }}>
                    Compare
                </button>
            </div>
            Diff of {comparisonResults.length} expenses, with a total amount
            of {comparisonResults.reduce((acc, curr) => {
            if (!curr.difference) {
                return acc;
            }

            return acc + curr.difference;
        }, 0)} NIS
            <div>
                {comparisonResults.map((result, index) => {
                    return (
                        <div className={classNames("flex gap-4 p-4", {
                            "bg-gray-100": index % 2 === 0,
                        })}>
                            <span className="w-1/4">{result.name}</span>
                            <div className="flex gap-2 w-1/2">
                                <span className="w-1/3">app: {result.appAmount}</span>
                                <span className="w-1/3">bank: {result.bankAmount}</span>
                                <span className="font-black">
                                    diff: {formatCurrency(result.difference, false, false)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <table className="w-1/2">
                <thead>
                <tr>
                    <td></td>
                    <td></td>
                    <td>{totalAmount} NIS</td>
                </tr>
                </thead>
                <tbody>
                {items
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .map((expense, index) => {
                        const {subcategoryName} = getExpenseCategoryName(
                            expense.categoryId
                        );
                        return (
                            <tr key={expense.id} className={index % 2 === 0 ? "bg-gray-200" : ""}>
                                <td onClick={() => {
                                    if (!expense.transactions || expense.transactions.length < 2) {
                                        return;
                                    }

                                    if (expense.name === selectedExpenseName) {
                                        setSelectedExpenseName(null);
                                        return;
                                    }
                                    setSelectedExpenseName(expense.name);
                                }}>
                                    {expense.name}{" "}
                                    {expense.transactions?.length > 1
                                        ? `(${expense.transactions?.length})`
                                        : ""}
                                    {selectedExpenseName === expense.name &&
                                        expense.transactions.map((transaction) => (
                                            <p>
                                                <span>{transaction.amount} NIS</span>{" "}
                                                <span>{toDate(transaction.timestamp)}</span>
                                            </p>
                                        ))}
                                </td>
                                <td>{subcategoryName}</td>
                                <td>{formatCurrency(expense.amount.toFixed(2))}</td>
                                <td>{expense.note}</td>
                                <td>
                                    {expense.timestamp &&
                                        new Date(expense.timestamp).toDateString("en-GB")}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TopExpensesView;
