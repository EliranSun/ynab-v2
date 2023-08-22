import { useState } from "react";
import { Amount, Checkbox, Title } from "../atoms";
import useSubcategoryExpensesData from "./useSubcategoryExpensesData";
import Expense from "../ExpenseView/Expense";

const Subcategory = ({ subcategory, selectedMonths = [], expensesInMonths = [], expenses = [] }) => {
  const [isAggregated, setIsAggregated] = useState(false);
  const {
    subcategoryExpenses,
    sumPreviousMonth,
    sumThisMonth,
  } = useSubcategoryExpensesData({
    isAggregated,
    selectedMonths,
    subcategory,
    expensesInMonths,
    allExpenses: expenses
  });

  return (
    <div className="bg-slate-200 my-4 p-4">
      <Title type="h2" className="flex gap-2">
        {subcategory.icon} {subcategory.name},
        <Amount
          isPositive={sumThisMonth <= sumPreviousMonth}
          amount={sumThisMonth}/>
      </Title>
      <span>
        {subcategoryExpenses.length} Expenses
      </span>
      <div className="flex">
        <div className="p-4 w-72">
          <Amount
            isVisible={selectedMonths.length === 1}
            amount={sumPreviousMonth}
            label="- Last month"/>
          <Amount
            amount={sumPreviousMonth}
            label="- Budget"/>
          <Checkbox
            isChecked={isAggregated}
            label="Aggregate?"
            onChange={() => {
              setIsAggregated(!isAggregated);
            }}/>
        </div>
        <div className="overflow-x-auto w-full flex gap-2">
          {subcategoryExpenses.map((expense) => (
            <Expense expense={expense} key={expense.id}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subcategory;