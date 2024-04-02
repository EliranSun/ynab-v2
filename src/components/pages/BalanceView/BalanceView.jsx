import {useDate} from "../../molecules";
import {Title} from "../../atoms";
import {CategoryBalance} from "./CategoryBalance";
import {BalanceSummary} from "../../molecules/PastTwelveMonthsBalance/BalanceSummary";
import {useCategories} from "../../../hooks/useCategories";
import {useContext, useMemo} from "react";
import {getBudgetSummary} from "../../../utils/budget";
import {BudgetContext} from "../../../context";
import SubcategoryExpensesList from "./SubcategoryExpensesList";
import {RealityVsExpectation} from "../../molecules/RealityVsExpectation";

const BalanceView = () => {
        const {budget} = useContext(BudgetContext);
        const {currentTimestamp, NextButton, PreviousButton, isSameDate, isPreviousMonth} = useDate();
        const categories = useCategories(currentTimestamp);
        const budgetSummary = useMemo(() => getBudgetSummary(budget), [budget]);
        console.log({
            categories
        });

        return (
            <section className="w-full mt-8">
                <div className="md:w-1/6 md:inline">
                    <BalanceSummary timestamp={currentTimestamp}/>
                </div>
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
                <RealityVsExpectation categories={categories} budgetSummary={budgetSummary}/>
                <div className="md:w-full flex flex-col my-4 gap-2 box-content items-center">
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
            </section>
        );
    }
;

export default BalanceView;
