import { useDate } from "../../DateChanger/DateChanger";
import { Title } from "../../atoms";
import { CategoryBalance } from "./CategoryBalance";
import { ThisMonthBalance } from "../../molecules/ThisMonthBalance";
import { PastTwelveMonthsBalance } from "../../molecules/PastTwelveMonthsBalance";
import { useContext } from "react";
import { ExpensesContext } from "../../../context";

const BalanceView = () => {
    const { categoriesByAmount } = useContext(ExpensesContext);
    const { currentTimestamp, NextButton, PreviousButton, isSameDate, isPreviousMonth } = useDate();
    
    return (
      <section>
        <Title className="mb-4">BALANCE & BUDGET</Title>
        <ul className="w-full bg-gray-100 w-full h-10 my-2 flex">
          <li className="bg-blue-900 w-1/3 h-full"></li>
          <li className="bg-red-900 w-1/3 h-full"></li>
          <li className="bg-green-900 w-1/3 h-full"></li>
        </ul>
        <PastTwelveMonthsBalance timestamp={currentTimestamp}/>
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
        <ThisMonthBalance timestamp={currentTimestamp}/>
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
