import { useMemo, useState } from "react";
import { aggregateTransactionsByName, getExpenseCategoryName, } from "../../../utils";
import { Title } from "../../atoms";

const TopExpensesView = ({ expenses, isSameDate, toDate, date = '' }) => {
  // returns a list of expenses that are above 100 NIS
  const [topAmount, setTopAmount] = useState(100);
  const [selectedExpenseName, setSelectedExpenseName] = useState(null);
  const [isAggregateView, setIsAggregateView] = useState(false);
  const [sum, setSum] = useState(0);
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
      <table style={{ width: "1000px" }}>
        <thead>
        <tr>
          <td></td>
          <td></td>
          <td>{totalAmount} NIS</td>
        </tr>
        </thead>
        <tbody>
        {items
          .sort((a, b) => b.amount - a.amount)
          .map((expense) => {
            const { subcategoryName } = getExpenseCategoryName(
              expense.categoryId
            );
            return (
              <tr key={expense.id}>
                <td
                  onClick={() => {
                    if (
                      !expense.transactions ||
                      expense.transactions.length < 2
                    ) {
                      return;
                    }
                    
                    if (expense.name === selectedExpenseName) {
                      setSelectedExpenseName(null);
                      return;
                    }
                    setSelectedExpenseName(expense.name);
                  }}
                >
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
                <td>{expense.amount.toFixed(2)}</td>
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
