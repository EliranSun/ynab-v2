import { NetSummary } from "./NetSummary";
import { BalanceDiffMessage } from "../atoms/BalanceDiffMessage/BalanceDiffMessage";
import { useBudget } from "../../hooks/useBudget";
import { useExpensesSummary } from "../../hooks/useExpensesSummary";

export const ThisMonthBalance = ({ timestamp }) => {
  const { income: incomeBudget, outcome: expensesBudget } = useBudget(timestamp);
  const { totalIncomeThisMonth, totalExpensesThisMonth } = useExpensesSummary(timestamp);
  
  return (
    <div className="flex items-center">
      <div>
        <NetSummary
          label="Actual"
          income={totalIncomeThisMonth}
          outcome={totalExpensesThisMonth}/>
        <NetSummary
          label="Budget"
          income={incomeBudget}
          outcome={expensesBudget}/>
      </div>
      <BalanceDiffMessage
        incomeBudget={incomeBudget}
        expensesBudget={expensesBudget}
        totalIncomeThisMonth={totalIncomeThisMonth}
        totalExpensesThisMonth={totalExpensesThisMonth}/>
    </div>
  )
};