import { NetSummary } from "../NetSummary/NetSummary";
import { BalanceDiffMessage } from "../../atoms/BalanceDiffMessage/BalanceDiffMessage";

export const ThisMonthBalance = ({ incomeBudget, expensesBudget, totalIncomeThisMonth, totalExpensesThisMonth }) => {
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