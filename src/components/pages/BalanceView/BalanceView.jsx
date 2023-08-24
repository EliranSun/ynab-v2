import { useDate } from "../../molecules";
import { Title } from "../../atoms";
import { CategoryBalance } from "./CategoryBalance";
import { ThisMonthBalance } from "../../molecules/ThisMonthBalance/ThisMonthBalance";
import { PastTwelveMonthsBalance } from "../../molecules/PastTwelveMonthsBalance/PastTwelveMonthsBalance";
import { useContext } from "react";
import { ExpensesContext } from "../../../context";
import { useBudget } from "../../../hooks/useBudget";
import { useExpensesSummary } from "../../../hooks/useExpensesSummary";

const BalanceView = () => {
    const { categoriesByAmount } = useContext(ExpensesContext);
    const { currentTimestamp, NextButton, PreviousButton, isSameDate, isPreviousMonth } = useDate();
    
    const { income: incomeBudget, outcome: expensesBudget } = useBudget(currentTimestamp);
    const { totalIncomeThisMonth, totalExpensesThisMonth } = useExpensesSummary(currentTimestamp);
    
    return (
      <section className="h-[90vh] overflow-y-auto overflow-x-hidden">
        <div className="p-4">
          <Title className="mb-4">BALANCE & BUDGET</Title>
          <ul className="w-full bg-gray-100 w-full h-10 my-2 flex">
            <li className="bg-blue-900 w-1/3 h-full"></li>
            <li className="bg-red-900 w-1/3 h-full"></li>
            <li className="bg-green-900 w-1/3 h-full"></li>
          </ul>
        </div>
        <PastTwelveMonthsBalance timestamp={currentTimestamp}/>
        <div className="flex gap-2 md:my-4 items-center w-full justify-evenly sticky top-0 bg-white p-4 z-10">
          <PreviousButton/>
          <Title type={Title.Types.H2} className="font-sans font-black">
            {new Date(currentTimestamp).toLocaleString("en-US", {
              month: "short",
              year: "2-digit",
            })}
          </Title>
          <NextButton/>
        </div>
        <ThisMonthBalance
          incomeBudget={incomeBudget}
          expensesBudget={expensesBudget}
          totalIncomeThisMonth={totalIncomeThisMonth}
          totalExpensesThisMonth={totalExpensesThisMonth}
        />
        <div className="flex flex-wrap gap-4">
          {categoriesByAmount.map((category) => {
            return (
              <CategoryBalance
                key={category.id}
                categoryId={category.id}
                categoryName={category.name}
                currentTimestamp={currentTimestamp}
                isSameDate={isSameDate}
                isPreviousMonth={isPreviousMonth}/>
            );
          })}
        </div>
      </section>
    );
  }
;

export default BalanceView;
