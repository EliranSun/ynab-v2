import {useDate} from "../../molecules";
import {Title} from "../../atoms";
import {CategoryBalance} from "./CategoryBalance";
import {BalanceSummary} from "../../molecules/PastTwelveMonthsBalance/BalanceSummary";
import {useCategories} from "../../../hooks/useCategories";
import {formatCurrency} from "../../../utils";
import {useContext, useMemo} from "react";
import {getBudgetSummary} from "../../../utils/budget";
import {BudgetContext} from "../../../context";


const BalanceView = () => {
        const {budget} = useContext(BudgetContext);
        const {currentTimestamp, NextButton, PreviousButton, isSameDate, isPreviousMonth} = useDate();
        const categories = useCategories(currentTimestamp);
        const budgetSummary = useMemo(() => getBudgetSummary(budget), [budget]);

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
                    <div className="md:w-full flex flex-col my-4 gap-2 box-content items-center">
                        <div className="flex">
                            <div className="flex items-center w-full justify-center gap-2">
                                Total:
                                <div className="text-lg text-center text-green-500">
                                    {formatCurrency(categories.totalIncome)}
                                </div>
                                <div className="text-lg text-center text-red-500">
                                    {formatCurrency(-categories.totalExpenses)}
                                </div>
                                =
                                <Title type={Title.Types.H3} className="text-center font-black">
                                    {formatCurrency(categories.totalIncome - categories.totalExpenses)}
                                </Title>
                            </div>
                            <div className="flex items-center w-full justify-center gap-4">
                                Budget:
                                <div className="text-lg text-center text-green-500">
                                    {formatCurrency(budgetSummary.totalIncome)}
                                </div>
                                <div className="text-lg text-center text-red-500">
                                    {formatCurrency(-budgetSummary.totalExpenses)}
                                </div>
                                =
                                <Title type={Title.Types.H3} className="text-center font-black">
                                    {formatCurrency(budgetSummary.totalIncome - budgetSummary.totalExpenses)}
                                </Title>
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
