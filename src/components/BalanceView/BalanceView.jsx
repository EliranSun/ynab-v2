import { useContext, useMemo } from "react";
import { BudgetContext, ExpensesContext, getDateKey } from "../../context";
import { Categories } from "../../constants";
import { useDate } from "../DateChanger/DateChanger";
import { Title } from "../atoms";
import classNames from "classnames";
import { formatCurrency } from "../../utils";
import { CategoryBalance } from "./CategoryBalance";
import { orderBy } from "lodash";
import { isAfter, subMonths } from "date-fns";

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
  switch (true) {
    case diff < 100:
      return `my budget is spot on!`;

    case diff < 500:
      return `perhaps a 1 off, but I should keep an eye on it`;

    case diff < 1000:
      return `my budget is nowhere NEAR reality.`;

    case diff > 1000:
      return `I'm in trouble.`;

    case diff < 0:
    default:
      return 'while good, I should keep an eye on it.';
  }
}

const IncomeSubcategoryIds = [80, 81, 82, 83];

const Message = ({ diff, diffCurrency, diffMessage }) => {
  const foo = <span className="text-3xl font-black">{diffCurrency}</span>;

  if (diff > 0) {
    return (
      <p className="w-1/3 font-serif text-xl italic p-4 my-4">
        I've spent {foo} more than I planned...
        {diffMessage}
      </p>
    )
  }

  return (
    <p className="w-1/3 font-serif text-xl italic p-4 my-4">
      With a spare of {foo},
      {diffMessage}
    </p>
  )
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

    const totalExpensesThisMonth = useMemo(() => {
      return Object.values(categoriesWithAmounts)
        .reduce((acc, curr) => {
          if (curr.isIncome) return acc;
          return acc + curr.totalAmount;
        }, 0);
    }, [categoriesWithAmounts]);

    const totalIncomeThisMonth = useMemo(() => {
      return Object.values(categoriesWithAmounts)
        .reduce((acc, curr) => {
          if (!curr.isIncome) return acc;
          return acc + curr.totalAmount;
        }, 0);
    }, [categoriesWithAmounts]);

    const totalIncome = useMemo(() => {
      return expenses.reduce((acc, curr) => {
        const isExpenseThisYear = isAfter(new Date(curr.timestamp), subMonths(new Date(currentTimestamp), 12));
        if (!IncomeSubcategoryIds.includes(curr.categoryId) || !isExpenseThisYear) return acc;
        return acc + curr.amount;
      }, 0);
    }, [expenses]);

    const totalExpenses = useMemo(() => {
      return expenses.reduce((acc, curr) => {
        const isExpenseThisYear = isAfter(new Date(curr.timestamp), subMonths(new Date(currentTimestamp), 12));
        if (IncomeSubcategoryIds.includes(curr.categoryId) || !isExpenseThisYear) return acc;
        return acc + curr.amount;
      }, 0);
    }, [expenses]);

    const diff = Math.round((incomeBudget - expensesBudget) - (totalIncomeThisMonth - totalExpensesThisMonth));
    const diffCurrency = formatCurrency(diff);
    const diffMessage = realityVsExpectationMessage(diff);
    const actualBottomLine = totalIncome - totalExpenses;
    const budgetBottomLine = incomeBudget * 12 - expensesBudget * 12;

    return (
      <section>
        <Title className="mb-4">BALANCE & BUDGET</Title>
        <ul className="w-full bg-gray-100 w-full h-10 my-2 flex">
          <li className="bg-blue-900 w-1/3 h-full"></li>
          <li className="bg-red-900 w-1/3 h-full"></li>
          <li className="bg-green-900 w-1/3 h-full"></li>
        </ul>
        <div className="text-xl font-bold bg-gray-100 p-4">
          <Title type={Title.Types.H2}>Past 12 months</Title>
          <p className="font-normal italic">
            These are the incomes and expenses over the last 12 months.
            Put in mind though - the budget is for the current month only,
            so some months (i.e. vacation) are skewing these results.
          </p>
          <div className="flex gap-4">
            <div>
              Actual: <br/>
              <span className="text-green-500">{formatCurrency(totalIncome)}</span> - <br/>
              <span className="text-red-500">{formatCurrency(totalExpenses)}</span> = <br/>
              <hr/>
              {formatCurrency(actualBottomLine)}
            </div>

            <div>
              Budget: <br/>
              <span className="text-green-500">{formatCurrency(incomeBudget * 12)}</span> - <br/>
              <span className="text-red-500">{formatCurrency(expensesBudget * 12)}</span> = <br/>
              <hr/>
              {formatCurrency(budgetBottomLine)}
            </div>

            <div>
              Diffs: <br/>
              <span className="text-green-500">
                {formatCurrency(totalIncome - (incomeBudget * 12))}
              </span> - <br/>
              <span className="text-red-500">
                {formatCurrency(totalExpenses - (expensesBudget * 12))}</span> = <br/>
              <hr/>
              {formatCurrency(actualBottomLine - budgetBottomLine)}
            </div>
          </div>
        </div>
        <div className="flex gap-2 my-4 items-center">
          <PreviousButton/>
          <Title type={Title.Types.H2} className="font-sans font-black">
            {new Date(currentTimestamp).toLocaleString("en-US", {
              month: "short",
              year: "2-digit",
            })}
          </Title>
          <NextButton/>
        </div>
        <div className="flex items-center">
          <div>
            <BottomLine
              label="Actual"
              income={totalIncomeThisMonth}
              outcome={totalExpensesThisMonth}/>
            <BottomLine
              label="Budget"
              income={incomeBudget}
              outcome={expensesBudget}/>
          </div>
          <Message
            diff={diff}
            diffCurrency={diffCurrency}
            diffMessage={diffMessage}/>
        </div>
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
