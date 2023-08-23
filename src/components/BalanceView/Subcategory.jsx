import { Button, Title } from "../atoms";
import { useContext, useMemo, useRef, useState } from "react";
import { noop, orderBy } from "lodash";
import { BudgetContext, ExpensesContext, getDateKey } from "../../context";
import { isSameMonth } from "date-fns";
import { formatCurrency } from "../../utils";
import SubcategoryExpensesList from "./SubcategoryExpensesList";
import classNames from "classnames";
import { CheckFat, PiggyBank, Spinner } from "@phosphor-icons/react";

const Subcategory = ({
  icon,
  name,
  id,
  categoryId,
  onSubcategoryClick = noop,
  isSameDate = noop,
  isPreviousMonth = noop,
  isSelected = false,
  currentTimestamp,
  isIncome
}) => {
  const { expensesArray: expenses, expensesPerMonthPerCategory } = useContext(ExpensesContext);
  const { setBudget, budget } = useContext(BudgetContext);
  const [isBudgeting, setIsBudgeting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const budgetDateKey = getDateKey(currentTimestamp);
  const categoryBudget = budget[budgetDateKey]?.[categoryId]?.[id];
  const [budgetAmount, setBudgetAmount] = useState(Number(categoryBudget || 0));
  const expensesInCategory = expenses.filter((expense) => {
    // TODO: same type instead of casting
    return (
      String(expense.categoryId) === String(id)
    );
  });
  
  const thisMonthExpenses = useMemo(() => expensesInCategory.filter((expense) => {
    const date = new Date(currentTimestamp);
    const expenseDate = new Date(expense.timestamp);
    
    if (expense.isRecurring) {
      return (
        expenseDate.getFullYear() === date.getFullYear()
      );
    }
    
    return isSameMonth(expenseDate, date);
  }), [currentTimestamp, expensesInCategory]);
  
  
  const intThisMonthAmount = useRef(0);
  const thisMonthAmount = useMemo(() => {
    const amount = thisMonthExpenses.reduce((acc, expense) => {
      return acc + expense.amount;
    }, 0);
    
    intThisMonthAmount.current = amount;
    return formatCurrency(amount);
  }, [currentTimestamp, thisMonthExpenses]);
  
  const totalInPreviousMonth = useMemo(() => {
    const amount = expenses.reduce(
      (total, expense) => {
        if (id === expense.categoryId && isPreviousMonth(expense.timestamp)) {
          return total + expense.amount;
        }
        return total;
      }, 0);
    return formatCurrency(amount);
  }, [expenses, id, isPreviousMonth]);
  
  const getAverageAmount = (id) => {
    if (!expensesPerMonthPerCategory[id]) {
      return 0;
    }
    
    let total = 0;
    let count = 0;
    const months = Object.values(expensesPerMonthPerCategory[id]);
    for (const month of months) {
      total += month.amount;
      count += month.expenses.length;
    }
    
    return formatCurrency(total / count);
  };
  
  const averageAmount = getAverageAmount(String(id));
  
  const expensesInCategoryThisDate = useMemo(() => {
    return orderBy(
      expensesInCategory
        .filter((expense) => isSameDate(expense.timestamp))
        .map((expense) => {
          return (
            <li>■ {expense.name.slice(0, 15)} {expense.amount}</li>
          );
        }),
      "amount",
      "desc"
    );
  }, [expensesInCategory, isSameDate]);
  
  if (thisMonthAmount === formatCurrency(0)) {
    return null;
  }
  
  return (
    <div className="relative min-w-fit">
      <div className="bg-white/80 p-4 cursor-pointer" onClick={() => {
        onSubcategoryClick(isSelected ? null : id);
      }}>
        <Title type={Title.Types.H4} className="truncate w-full flex">
          {icon} {name}
        </Title>
        <div className={classNames("flex gap-2 mb-2", {
          "text-red-500": isIncome
            ? intThisMonthAmount.current < budgetAmount
            : intThisMonthAmount.current > budgetAmount,
          "text-green-400": isIncome
            ? intThisMonthAmount.current > budgetAmount
            : intThisMonthAmount.current < budgetAmount
        })}>
          <span className="font-bold text-2xl">{thisMonthAmount}</span>
          <span>/</span>
          <span className="font-bold text-2xl">
            {isBudgeting
              ? <input
                type="number"
                placeholder="budget"
                className="w-20"
                value={budgetAmount}
                onClick={event => event.stopPropagation()}
                onChange={(event) => {
                  setBudgetAmount(Number(event.target.value));
                }}/>
              : formatCurrency(budgetAmount)}
          </span>
        </div>
        <div className="text-xs text-left mb-2">
          <div>Previous month: {totalInPreviousMonth}</div>
          <div>Average: {averageAmount}</div>
        </div>
        <div className="w-full flex justify-end">
          <Button type={Button.Types.GHOST} onClick={async (event) => {
            event.stopPropagation();
            if (isBudgeting && budgetAmount !== categoryBudget?.amount) {
              setIsLoading(true);
              await setBudget({
                amount: budgetAmount,
                categoryId: categoryId,
                subcategoryId: id,
                timestamp: currentTimestamp
              });
              setIsLoading(false);
            }
            
            setIsBudgeting(!isBudgeting);
          }}>
            {isBudgeting
              ? isLoading
                ? <Spinner className="animate-spin" size={21}/>
                : <CheckFat size={21}/>
              : <PiggyBank size={21}/>}
          </Button>
        </div>
      </div>
      {isSelected && expensesInCategoryThisDate.length > 0 &&
        <SubcategoryExpensesList
          id={id}
          expensesPerMonthPerCategory={expensesPerMonthPerCategory[id]}
          onSubcategoryClick={onSubcategoryClick}
        />}
    </div>
  );
};

export default Subcategory;