import { Button, Title } from "../../atoms";
import { formatCurrency } from "../../../utils";
import { useContext, useMemo, useState } from "react";
import { isAfter, subMonths } from "date-fns";
import { ExpensesContext } from "../../../context";
import { useBudget } from "../../../hooks/useBudget";
import { Trans } from "@lingui/macro";
import { Calendar } from "@phosphor-icons/react";
import { noop } from "lodash";

const IncomeSubcategoryIds = [80, 81, 82, 83];

export const PastTwelveMonthsBalance = ({ timestamp, onViewToggle = noop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { expensesArray: expenses = [] } = useContext(ExpensesContext);
  const { income: incomeBudget, outcome: expensesBudget } = useBudget(timestamp);
  
  const totalIncome = useMemo(() => {
    return expenses.reduce((acc, curr) => {
      const isExpenseThisYear = isAfter(new Date(curr.timestamp), subMonths(new Date(timestamp), 12));
      if (!IncomeSubcategoryIds.includes(curr.categoryId) || !isExpenseThisYear) return acc;
      return acc + curr.amount;
    }, 0);
  }, [expenses]);
  
  const totalExpenses = useMemo(() => {
    return expenses.reduce((acc, curr) => {
      const isExpenseThisYear = isAfter(new Date(curr.timestamp), subMonths(new Date(timestamp), 12));
      if (IncomeSubcategoryIds.includes(curr.categoryId) || !isExpenseThisYear) return acc;
      return acc + curr.amount;
    }, 0);
  }, [expenses]);
  
  const actualBottomLine = totalIncome - totalExpenses;
  const budgetBottomLine = incomeBudget * 12 - expensesBudget * 12;
  
  return (
    <div className="m-4">
      <Button type={Button.Types.GHOST_BORDERED}>
        <Calendar size={24} onClick={() => {
          setIsOpen(!isOpen);
          onViewToggle();
        }} color="black"/>
      </Button>
      {isOpen && <div className="text-xl font-bold bg-gray-100">
        <Title type={Title.Types.H3} className="mb-4">
          <Trans>
            Past 12 months
          </Trans>
        </Title>
        <p className="text-sm italic mb-4 font-light">
          <Trans>
            Put in mind though - the budget is for the current month only,
            so some months (i.e. vacation) are skewing these results.
          </Trans>
        </p>
        <div className="text-lg flex gap-4 mb-4">
          <div>
            <Trans>Budget:</Trans> <br/>
            <span className="text-green-500">{formatCurrency(incomeBudget * 12)}</span> - <br/>
            <span className="text-red-500">{formatCurrency(expensesBudget * 12)}</span> = <br/>
            <hr/>
            {formatCurrency(budgetBottomLine)}
          </div>
          <div>
            <Trans>Actual:</Trans><br/>
            <span className="text-green-500">{formatCurrency(totalIncome)}</span> - <br/>
            <span className="text-red-500">{formatCurrency(totalExpenses)}</span> = <br/>
            <hr/>
            {formatCurrency(actualBottomLine)}
          </div>
          <div>
            <Trans>Diffs:</Trans> <br/>
            <span className="text-green-500">
              {formatCurrency(totalIncome - (incomeBudget * 12))}
            </span> - <br/>
            <span className="text-red-500">
              {formatCurrency(totalExpenses - (expensesBudget * 12))}</span> = <br/>
            <hr/>
            {formatCurrency(actualBottomLine - budgetBottomLine)}
          </div>
        </div>
      </div>}
    </div>
  )
};