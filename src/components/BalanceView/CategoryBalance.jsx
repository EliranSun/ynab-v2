import { Categories } from "../../constants";
import { formatCurrency } from "../../utils";
import Subcategory from "./Subcategory";
import { useContext, useMemo, useState } from "react";
import { useDate } from "../DateChanger/DateChanger";
import { BudgetContext, getDateKey } from "../../context";

export const CategoryBalance = ({ category }) => {
  const { currentTimestamp, isSameDate, isPreviousMonth } = useDate();
  const [selectedId, setSelectedId] = useState(null);
  const { budget } = useContext(BudgetContext);
  const budgetKey = getDateKey(currentTimestamp);
  const categoryBudget = useMemo(() => {
    if (!budget[budgetKey]?.[category.id]) return 0;

    return Object.values(budget[budgetKey]?.[category.id]).reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  }, [budget, budgetKey, category.id]);
  const total = Math.round(category.totalAmount);
  const totalCurrency = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    currencyDisplay: 'symbol',
    notation: 'compact',
  }).format(total);
  const subcategories = Categories.find((c) =>
    c.id === category.id)?.subCategories;

  if (total === 0) {
    return null;
  }

  return (
    <div
      key={category.id}
      className="bg-gray-200 my-4 px-4 pb-4 w-fit gap-4 items-center text-center">
      <div className="flex justify-between my-2">
        <div className="flex items-center gap-2 my-2">
          <span className="text-2xl font-bold">{category.name}</span>
          <span className="text-3xl font-bold">{totalCurrency}</span>/
          <span className="text-3xl font-bold">
            {formatCurrency(categoryBudget, true)}
          </span>
        </div>
      </div>
      <div className="flex gap-2 min-w-fit flex-wrap">
        {subcategories.map((subcategory) => {
          if (subcategory.amount === 0) return null;

          return (
            <Subcategory
              {...subcategory}
              key={subcategory.id}
              categoryId={category.id}
              isSelected={selectedId === subcategory.id}
              onSubcategoryClick={setSelectedId}
              currentTimestamp={currentTimestamp}
              isPreviousMonth={isPreviousMonth}
              isSameDate={isSameDate}
            />
          );
        })}
      </div>
    </div>
  )
};
