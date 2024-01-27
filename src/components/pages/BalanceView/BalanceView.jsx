import { useContext, useMemo, useState } from "react";
import { useDate } from "../../molecules";
import { Title } from "../../atoms";
import { CategoryBalance } from "./CategoryBalance";
import { ThisMonthBalance } from "../../molecules/ThisMonthBalance/ThisMonthBalance";
import { PastTwelveMonthsBalance } from "../../molecules/PastTwelveMonthsBalance/PastTwelveMonthsBalance";
import { useBudget } from "../../../hooks/useBudget";
import { useExpensesSummary } from "../../../hooks/useExpensesSummary";
import { Trans } from "@lingui/macro";
import { useCategories } from "../../../hooks/useCategories";
import { isSameMonth } from "date-fns";
import { ExpensesContext } from "../../../context";

const isDesktop = window.innerWidth > 768;

const ONE_MONTH_TIMESTAMP = 1000 * 60 * 60 * 24 * 30;

const getExpensesInMonth = (expenses, timestamp) => {
    return expenses.reduce((acc, curr) => {
        const isExpenseThisMonth = isSameMonth(new Date(curr.timestamp), new Date(timestamp));
        if (curr.isIncome || !isExpenseThisMonth) return acc;

        return acc + curr.amount;
    }, 0);
};

const getIncomeInMonth = (expenses, timestamp) => {
    return expenses.reduce((acc, curr) => {
        const isExpenseThisMonth = isSameMonth(new Date(curr.timestamp), new Date(timestamp));
        if (!curr.isIncome || !isExpenseThisMonth) return acc;

        return acc + curr.amount;
    }, 0);
};

const HalfYearBalanceSummary = ({ currentTimestamp }) => {
    const { expensesArray } = useContext(ExpensesContext);

    const summary = useMemo(() => {
        const incomes = [];
        const expenses = [];
        const bottomLine = [];

        for (let i = 5; i >= 0; i--) {
            const expensesInMonth = getExpensesInMonth(expensesArray, currentTimestamp - ONE_MONTH_TIMESTAMP * i);
            const incomeInMonth = getIncomeInMonth(expensesArray, currentTimestamp - ONE_MONTH_TIMESTAMP * i);
            expenses.push({
                amount: parseInt(expensesInMonth),
                date: new Date(currentTimestamp - ONE_MONTH_TIMESTAMP * i)
            });
            incomes.push({
                amount: parseInt(incomeInMonth),
                date: new Date(currentTimestamp - ONE_MONTH_TIMESTAMP * i)
            });
            bottomLine.push({
                amount: parseInt(incomeInMonth - expensesInMonth),
                date: new Date(currentTimestamp - ONE_MONTH_TIMESTAMP * i)
            });
        }

        const total = bottomLine.reduce((acc, curr) => acc + curr.amount, 5970.68);

        return {
            incomes,
            expenses,
            bottomLine,
            total
        };
    }, [currentTimestamp, expensesArray]);

    console.log({ summary });

    return (
        <div>
            {summary.incomes.map((income, index) => {
                const incomeAmount = income.amount;
                const expenseAmount = summary.expenses[index].amount;
                const bottomLineAmount = summary.bottomLine[index].amount;

                return (
                    <div key={index} className="flex gap-2 ">
                        <span className="w-10">{income.date.toLocaleString("en-GB", { month: "short" })}</span>
                        <span className="w-20 text-center text-green-500">{incomeAmount}</span>
                        <span className="w-4 text-center">-</span>
                        <span className="w-20 text-center text-red-400">{expenseAmount}</span>
                        <span className="text-blue-500">{bottomLineAmount}</span>
                    </div>
                )
            })}
            {summary.total}
        </div>
    )
};

const BalanceView = () => {
        const [isPastTwelveMonthsOpen, setIsPastTwelveMonthsOpen] = useState(false);
        const { currentTimestamp, NextButton, PreviousButton, isSameDate, isPreviousMonth } = useDate();
        const { income: incomeBudget, outcome: expensesBudget } = useBudget(currentTimestamp);
        const { totalIncomeThisMonth, totalExpensesThisMonth } = useExpensesSummary(currentTimestamp);
        const categories = useCategories(currentTimestamp);

        return (
            <section className="md:h-screen overflow-y-auto overflow-x-hidden w-full">
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
                <div className="flex items-start my-2">
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
                    <HalfYearBalanceSummary currentTimestamp={currentTimestamp}/>
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
