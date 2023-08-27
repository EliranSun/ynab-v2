import { NetSummary } from "../NetSummary/NetSummary";
import { BalanceDiffMessage } from "../../atoms/BalanceDiffMessage/BalanceDiffMessage";
import { Trans } from "@lingui/macro";

export const ThisMonthBalance = ({ incomeBudget, expensesBudget, totalIncomeThisMonth, totalExpensesThisMonth }) => {
  return (
    <div className="flex md:items-center flex-col md:flex-row p-4">
      <div>
        <NetSummary
          label={<Trans>Actual</Trans>}
          income={totalIncomeThisMonth}
          outcome={totalExpensesThisMonth}/>
        <NetSummary
          label={<Trans>Budget</Trans>}
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