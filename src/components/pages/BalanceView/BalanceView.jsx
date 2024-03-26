import {useDate} from "../../molecules";
import {Title} from "../../atoms";
import {CategoryBalance} from "./CategoryBalance";
import {BalanceSummary} from "../../molecules/PastTwelveMonthsBalance/BalanceSummary";
import {useCategories} from "../../../hooks/useCategories";
import {formatCurrency} from "../../../utils";
import {useContext, useMemo} from "react";
import {getBudgetSummary} from "../../../utils/budget";
import {BudgetContext} from "../../../context";
import classNames from "classnames";


const BalanceView = () => {
        const {budget} = useContext(BudgetContext);
        const {currentTimestamp, NextButton, PreviousButton, isSameDate, isPreviousMonth} = useDate();
        const categories = useCategories(currentTimestamp);
        const budgetSummary = useMemo(() => getBudgetSummary(budget), [budget]);

        console.log({categories});
        return (
            <section className="w-full p-4">
                <div
                    className="flex my-2 md:top-0 gap-2 md:my-0 items-center w-full justify-between md:justify-evenly bg-white p-0 z-10 max-w-xl m-auto">
                    <PreviousButton/>
                    <Title type={Title.Types.H3} className="font-sans font-black">
                        {new Date(currentTimestamp).toLocaleString("en-GB", {
                            month: "short",
                            year: "2-digit",
                        })}
                    </Title>
                    <NextButton/>
                </div>
                <div className="flex flex-col-reverse md:flex md:flex-row md:gap-10">
                    <div className="md:w-1/6 md:inline">
                        <BalanceSummary timestamp={currentTimestamp}/>
                    </div>
                    <div className="md:w-2/3 flex flex-col my-4 gap-2 box-content items-center">
                        <div className="flex flex-col">
                            <span className="text-xs">
                            Reality (actual)
                            </span>
                            <div className="flex items-center w-full justify-start gap-4 text-3xl font-mono mb-2">
                                <div className="bg-green-500 text-white">
                                    {formatCurrency(categories.totalIncome)}
                                </div>
                                <div className="bg-red-500 text-white">
                                    {formatCurrency(-categories.totalExpenses)}
                                </div>
                                =
                                <div className={classNames({
                                    "font-black": true,
                                    "text-green-500": (categories.totalIncome - categories.totalExpenses) > 0,
                                    "text-red-500": (categories.totalIncome - categories.totalExpenses) < 0,
                                })}>
                                    {formatCurrency(categories.totalIncome - categories.totalExpenses)}
                                </div>
                            </div>
                            <span className="text-xs">
                            Expectation (budget)
                            </span>
                            <div className="flex items-center w-full justify-start gap-4 text-3xl font-mono opacity-70">
                                <div className="bg-green-500 text-white">
                                    {formatCurrency(budgetSummary.totalIncome)}
                                </div>
                                <div className="bg-red-500 text-white">
                                    {formatCurrency(-budgetSummary.totalExpenses)}
                                </div>
                                =
                                <div className={classNames({
                                    "font-black": true,
                                    "text-green-500": budgetSummary.totalIncome - budgetSummary.totalExpenses > 0,
                                    "text-red-500": budgetSummary.totalIncome - budgetSummary.totalExpenses < 0,
                                })}>
                                    {formatCurrency(budgetSummary.totalIncome - budgetSummary.totalExpenses)}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-8 w-full justify-end max-w-xl">
                            <span>Total</span>
                            <span>Budget</span>
                        </div>
                        {categories.summary.map((category) => {
                            return (
                                <CategoryBalance
                                    key={category.id}
                                    categoryId={category.id}
                                    categoryName={category.name}
                                    categoryBudget={category.budget}
                                    subcategoryBudgets={budget["8.2023"] ? budget["8.2023"][category.id] : {}}
                                    currentTimestamp={currentTimestamp}
                                    isSameDate={isSameDate}
                                    isPreviousMonth={isPreviousMonth}/>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }
;

export default BalanceView;
