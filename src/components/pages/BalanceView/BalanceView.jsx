import {useDate} from "../../molecules";
import {Title} from "../../atoms";
import {CategoryBalance} from "./CategoryBalance";
import {BalanceSummary} from "../../molecules/PastTwelveMonthsBalance/BalanceSummary";
import {useCategories} from "../../../hooks/useCategories";
import {useContext, useMemo, useState} from "react";
import {getBudgetSummary} from "../../../utils/budget";
import {BudgetContext} from "../../../context";
import {RealityVsExpectation} from "../../molecules/RealityVsExpectation";
import SubcategoryExpensesList from "./SubcategoryExpensesList";
import {LocaleContext} from "../../../context/LocaleContext";
import {Trans} from "@lingui/macro";

const BalanceView = () => {
        const {budget} = useContext(BudgetContext);
        const {currentTimestamp, NextButton, PreviousButton, isSameDate, isPreviousMonth} = useDate();
        const categories = useCategories(currentTimestamp);
        const budgetSummary = useMemo(() => getBudgetSummary(budget), [budget]);
        const [selectedId, setSelectedId] = useState(null);
        const {locale} = useContext(LocaleContext);

        const selectedSubcategory = useMemo(() => {
            let match;
            categories.summary.forEach((category, index) => {
                if (match) {
                    return;
                }

                match = category.subCategories.find((subcategory) => {
                    if (!selectedId) {
                        return index === 0;
                    }

                    return subcategory.id === selectedId;
                });
            });

            return match;
        }, [categories, budget, selectedId]);

        return (
            <section className="overflow-x-hidden border-10 border-black w-full p-2 md:mt-8">
                <div
                    className="flex flex-col md:flex-row my-2 md:top-0 md:w-2/3 md:my-0 items-center justify-between md:justify-evenly bg-white">
                    <div className="w-full flex gap-2 md:gap-16 items-center justify-between md:justify-center">
                        <PreviousButton/>
                        <h1 className="font-black font-mono text-2xl md:text-9xl md:w-[1000px] text-center">
                            {new Date(currentTimestamp).toLocaleString(locale === "he" ? "he-IL" : "en-GB", {
                                month: "long",
                                year: "numeric",
                            })}
                        </h1>
                        <NextButton/>
                    </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-4">
                    <div
                        className="flex flex-col md:flex-row w-full md:w-2/3 md:flex-wrap gap-4 md:h-[1000px] overflow-auto md:thin-scrollbar">
                        {categories.summary.map((category) => {
                            return (
                                <CategoryBalance
                                    key={category.id}
                                    selectedId={selectedId}
                                    setSelectedId={setSelectedId}
                                    categoryId={category.id}
                                    categoryName={category.label}
                                    categoryBudget={category.budget}
                                    subcategoryBudgets={budget[category.id] ? budget[category.id] : {}}
                                    currentTimestamp={currentTimestamp}
                                    isSameDate={isSameDate}
                                    isPreviousMonth={isPreviousMonth}/>
                            );
                        })}
                    </div>
                    <div className="md:w-1/3">
                        <SubcategoryExpensesList
                            timestamp={currentTimestamp}
                            subcategory={selectedSubcategory}/>
                    </div>
                </div>
                <div className="overflow-hidden w-full">
                    <BalanceSummary timestamp={currentTimestamp}/>
                    <RealityVsExpectation categories={categories} budgetSummary={budgetSummary}/>
                </div>
            </section>
        );
    }
;

export default BalanceView;
