import { useState } from "react";
import { useDate } from "../../molecules";
import { Title } from "../../atoms";
import { CategoryBalance } from "./CategoryBalance";
import { ThisMonthBalance } from "../../molecules/ThisMonthBalance/ThisMonthBalance";
import { PastTwelveMonthsBalance } from "../../molecules/PastTwelveMonthsBalance/PastTwelveMonthsBalance";
import { useBudget } from "../../../hooks/useBudget";
import { useExpensesSummary } from "../../../hooks/useExpensesSummary";
import { Trans } from "@lingui/macro";
import { useCategories } from "../../../hooks/useCategories";

const isDesktop = window.innerWidth > 768;

const BalanceView = () => {
    const [isPastTwelveMonthsOpen, setIsPastTwelveMonthsOpen] = useState(false);
    const { currentTimestamp, NextButton, PreviousButton, isSameDate, isPreviousMonth } = useDate();
    const { income: incomeBudget, outcome: expensesBudget } = useBudget(currentTimestamp);
    const { totalIncomeThisMonth, totalExpensesThisMonth } = useExpensesSummary(currentTimestamp);
    const categories = useCategories(currentTimestamp);

    return (
      <section className="h-[90vh] md:h-screen overflow-y-auto overflow-x-hidden p-4">
        {isDesktop &&
          <div className="">
            <Title className="mb-4">
              <Trans>BALANCE & BUDGET</Trans>
            </Title>
            <ul className="w-full bg-gray-100 w-full h-4 my-2 flex">
              <li className="bg-blue-900 w-1/3 h-full"></li>
              <li className="bg-red-900 w-1/3 h-full"></li>
              <li className="bg-green-900 w-1/3 h-full"></li>
            </ul>
          </div>}
        <div className="flex items-start">
          <PastTwelveMonthsBalance
            onViewToggle={() => setIsPastTwelveMonthsOpen(!isPastTwelveMonthsOpen)}
            timestamp={currentTimestamp}/>
          <div className="flex gap-2 md:my-0 items-center w-full justify-evenly sticky top-0 bg-white p-4 md:p-0 z-10 max-w-2xl">
            <PreviousButton/>
            <Title type={Title.Types.H2} className="font-sans font-black">
              {new Date(currentTimestamp).toLocaleString("he-IL", {
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
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
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
