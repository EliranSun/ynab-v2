import { useState } from "react";
import { Amount, Checkbox, Title } from "../atoms";
import useSubcategoryExpensesData from "./useSubcategoryExpensesData";

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
    <div>
      <Title type="h2">{subcategory.icon} {subcategory.name}</Title>
      <span>
        Expenses count: {subcategoryExpenses.length}
      </span>
      <div className="flex">
        <div className="p-4 w-72">
          <Amount
            isPositive={sumThisMonth <= sumPreviousMonth}
            amount={sumThisMonth}/>
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
        <div className="overflow-x-auto w-full flex">
          {subcategoryExpenses.map((expense) => (
            <div className="w-48 h-40 shrink-0 border border-black p-4">
              <span className="font-bold">{expense.name}</span>
              <Amount
                label={expense.average ? "Total" : ""}
                amount={expense.amount}/>
              <Amount
                amount={expense.average}
                label="Average"/>
              <Amount
                isCurrency={false}
                amount={expense.count}
                label="time(s)"/>
              <span>{expense.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subcategory;