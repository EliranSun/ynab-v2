import { useContext, useMemo } from "react";
import { BudgetContext, ExpensesContext, getDateKey } from "../../context";
import { Categories } from "../../constants";
import { useDate } from "../DateChanger/DateChanger";
import { Title } from "../atoms";
import classNames from "classnames";
import { formatCurrency } from "../../utils";
import { CategoryBalance } from "./CategoryBalance";
import { orderBy } from "lodash";

const BottomLine = ({ label = "Reality", income = 0, outcome = 0 }) => {
  const bottomLine = income - outcome;
  return (
    <div className="flex w-full gap-4 items-center font-mono text-4xl font-bold">
      {label}:
      <div className="flex gap-1">
        <span className="text-green-400">
          {formatCurrency(income, true, true)}
        </span>
        <span className="text-red-400">
          {formatCurrency(-outcome, true, true)}
        </span>
      </div>
      <span>
        =
      </span>
      <span className={classNames("text-white", {
        'bg-green-500': bottomLine > 0,
        'bg-red-500': bottomLine < 0,
      })}>
        {formatCurrency(bottomLine, false, true)}
      </span>
    </div>
  )
};

const realityVsExpectationMessage = (diff) => {
  const absDiff = Math.abs(diff);
  console.log({ absDiff });

  switch (true) {
    case absDiff < 100:
      return `my budget is spot on!`;

    case absDiff < 500:
      return `perhaps a 1 off, but I should keep an eye on it`;

    case absDiff < 1000:
      return `my budget is nowhere NEAR reality.`;

    case absDiff > 1000:
      return `I'm in trouble.`;
  }
}

const BalanceView = () => {
    const { currentTimestamp, NextButton, PreviousButton, isSameDate, isPreviousMonth } = useDate();
    const { expensesArray: expenses } = useContext(ExpensesContext);
    const { budget } = useContext(BudgetContext);
    const incomeBudget = useMemo(() => {
      const thisMonthBudget = budget[getDateKey(currentTimestamp)];
      if (!thisMonthBudget) return 0;
      const incomeId = 8;
      if (!thisMonthBudget[incomeId]) return 0;

      let total = 0;

      Object.values(thisMonthBudget[incomeId]).forEach(amount => {
        total += amount;
      });

      return total;
    }, [budget]);
    const expensesBudget = useMemo(() => {
      const thisMonthBudget = budget[getDateKey(currentTimestamp)];
      if (!thisMonthBudget) return 0;

      let total = 0;

      Object.entries(thisMonthBudget).forEach(([categoryId, category]) => {
        if (categoryId === '8') return;

        Object.values(category).forEach(amount => {
          total += amount;
        });
      });

      return total;
    }, [budget]);
    const categoriesWithAmounts = useMemo(() => Categories.map((category) => {
      let expensesInCategorySum = 0;
      category.subCategories.forEach((subcategory) => {
        const expensesInCategory = expenses.filter((expense) => {
          // TODO: same type instead of casting
          return String(expense.categoryId) === String(subcategory.id);
        });

        const thisMonthExpenses = expensesInCategory.filter((expense) => {
          const date = new Date(currentTimestamp);
          const expenseDate = new Date(expense.timestamp);
          if (expense.isRecurring) {
            return expenseDate.getFullYear() === date.getFullYear();
          }

          return (
            expenseDate.getMonth() === date.getMonth() &&
            expenseDate.getFullYear() === date.getFullYear()
          );
        });
        const thisMonthAmount = thisMonthExpenses.reduce((acc, expense) => {
          return acc + expense.amount;
        }, 0);

        expensesInCategorySum += thisMonthAmount;
      });

      const categoryBudget = () => {
        const budgetKey = getDateKey(currentTimestamp);
        if (!budget[budgetKey]?.[category.id]) return 0;

        return Object.values(budget[budgetKey]?.[category.id]).reduce((acc, curr) => {
          return acc + curr;
        }, 0);
      };

      return {
        ...category,
        totalAmount: expensesInCategorySum,
        categoryBudget: categoryBudget(),
      };
    }), [expenses, currentTimestamp]);

    const totalExpenses = useMemo(() => {
      return Object.values(categoriesWithAmounts)
        .reduce((acc, curr) => {
          if (curr.isIncome) return acc;
          return acc + curr.totalAmount;
        }, 0);
    }, [categoriesWithAmounts]);
    const totalIncome = useMemo(() => {
      return Object.values(categoriesWithAmounts)
        .reduce((acc, curr) => {
          if (!curr.isIncome) return acc;
          return acc + curr.totalAmount;
        }, 0);
    }, [categoriesWithAmounts]);

    const diff = Math.round((incomeBudget - expensesBudget) - (totalIncome - totalExpenses));
    const diffCurrency = formatCurrency(diff);
    const diffMessage = realityVsExpectationMessage(diff);

    return (
      <section>
        <Title className="mb-4">BALANCE & BUDGET</Title>
        <div className="flex gap-2 my-4 items-center">
          <PreviousButton/>
          <span className="font-sans font-black text-3xl">
            {new Date(currentTimestamp).toLocaleString("en-US", {
              month: "short",
              year: "2-digit",
            })}
          </span>
          <NextButton/>
        </div>
        <BottomLine
          label="Actual"
          income={totalIncome}
          outcome={totalExpenses}/>
        <BottomLine
          label="Budget"
          income={incomeBudget}
          outcome={expensesBudget}/>
        <p className="bg-gray-100 font-serif text-6xl italic p-4 my-4">
          {diff > 0
            ? `I've spent ${diffCurrency} more than I planned... `
            : `With a spare of ${diffCurrency}, `}
          {diffMessage}
        </p>
        <div className="flex flex-wrap gap-4">
          {orderBy(categoriesWithAmounts, (item => {
            return item.totalAmount - item.categoryBudget;
          }), ['desc'])
            .map((category) => {
              return (
                <CategoryBalance
                  key={category.id}
                  currentTimestamp={currentTimestamp}
                  isSameDate={isSameDate}
                  isPreviousMonth={isPreviousMonth}
                  category={category}/>
              );
            })}
        </div>
      </section>
    );
  }
;

export default BalanceView;
