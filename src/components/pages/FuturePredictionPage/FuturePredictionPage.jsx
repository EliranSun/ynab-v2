import "chartjs-adapter-date-fns";
import { useContext, useMemo, useRef, useState } from "react";
import { orderBy } from "lodash";
import { BudgetContext, ExpensesContext } from "../../../context";
import TransactionsSection from "./TransactionsSection";
import { calcExpenses, chart, ONE_MONTH_MS, useChart } from "./utils";
import { useDebounce } from "react-use";
import { Title } from "../../atoms";

const FuturePredictionPage = ({
  lookaheadInMonths = 3,
  startDate = new Date(new Date().getTime() - ONE_MONTH_MS * 10),
}) => {
  const canvasRef = useRef(null);
  const [balance, setBalance] = useState(Number(localStorage.getItem("balance")));
  const [debouncedBalance, setDebouncedBalance] = useState(balance);
  const { expensesArray: expenses } = useContext(ExpensesContext);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const { budget } = useContext(BudgetContext);
  const expensesData = useMemo(
    () =>
      calcExpenses(
        orderBy(expenses, ["timestamp"], ["asc"]),
        debouncedBalance,
        startDate
      ),
    [expenses, debouncedBalance, startDate]
  );
  
  const [isReady] = useDebounce(() => {
    setDebouncedBalance(balance);
  }, 2000, [balance]);
  
  useChart({
    expensesData,
    budget,
    balance: debouncedBalance,
    initialAmount: debouncedBalance,
    lookaheadInMonths,
    startDate,
    canvasRef,
  });
  
  const ready = isReady();
  
  return (
    <section className="h-screen">
      <Title>Projection</Title>
      <div className="text-4xl my-4">
        <label htmlFor="balance">Current Balance (graph is calculated backwards):</label>
        <input
          name="balance"
          type="number"
          placeholder="Current balance"
          value={balance}
          onChange={(e) => {
            setBalance(Number(e.target.value));
            localStorage.setItem("balance", e.target.value);
          }}
          className="border-b border-black ml-4"/>
      
      </div>
      <TransactionsSection
        selectedExpenseId={selectedExpenseId}
        setSelectedExpenseId={setSelectedExpenseId}
        data={expensesData}/>
      {!ready && <div>Calculating...</div>}
      <div
        className="h-3/5 w-full"
        onClick={(event) => {
          chart
            .getElementsAtEventForMode(
              event,
              "nearest",
              { intersect: true },
              true
            )
            .forEach(({ element }) => {
              const expenseId = element['$context']?.raw?.id;
              setSelectedExpenseId(expenseId);
              document
                .getElementById(expenseId)
                .scrollIntoView();
            });
        }}
      >
        <canvas id="myChart" ref={canvasRef}></canvas>
      </div>
    </section>
  );
};

export default FuturePredictionPage;
