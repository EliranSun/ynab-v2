import {useDate} from "../../molecules";
import {CategoryBalance} from "./CategoryBalance";
import {BalanceSummary} from "../../molecules/PastTwelveMonthsBalance/BalanceSummary";
import {useCategories} from "../../../hooks/useCategories";
import {useContext, useMemo, useState} from "react";
import {getBudgetSummary} from "../../../utils/budget";
import {BudgetContext} from "../../../context";
import {RealityVsExpectation} from "../../molecules/RealityVsExpectation";
import SubcategoryExpensesList from "./SubcategoryExpensesList";
import {LocaleContext} from "../../../context/LocaleContext";
import classNames from "classnames";
import {useSearchParams} from "react-router-dom";

const BalanceView = () => {
        const {locale} = useContext(LocaleContext);
        const [budget] = useContext(BudgetContext);
        const {currentTimestamp, NextButton, PreviousButton, isSameDate, isPreviousMonth} = useDate();
        const categories = useCategories(currentTimestamp);
        const budgetSummary = useMemo(() => getBudgetSummary(budget, categories.summary), [budget, categories]);
        const [selectedId, setSelectedId] = useState(null);

        console.log({categories, budgetSummary});

        const selectedSubcategory = useMemo(() => {
            let match;

            if (!selectedId && categories.summary.length > 0) {
                const categoriesWithAmount = categories.summary.filter((category) => category.amount > 0);
                const categoryWithAmount = categoriesWithAmount[Math.random() * categoriesWithAmount.length | 0];

                if (!categoryWithAmount) {
                    return null;
                }

                const subcategoriesWithAmount = categoryWithAmount.subcategories.filter((subcategory) => subcategory.amount > 0);
                const subcategoryWithAmount = subcategoriesWithAmount[Math.random() * subcategoriesWithAmount.length | 0];
                return subcategoryWithAmount;
            }

            categories.summary.forEach((category, index) => {
                if (match) {
                    return;
                }

                match = category.subcategories.find((subcategory) => {
                    return subcategory.id === selectedId;
                });
            });

            return match;
        }, [categories, selectedId]);

        return (
            <section className={classNames({
                "border-10 border-black w-full p-2 md:mt-8": true,
                "max-w-screen-2xl m-auto": true,
            })}>
                <div
                    className={classNames({
                        "flex flex-col md:flex-row my-2 md:top-0 md:w-96 md:m-auto": true,
                        "items-center justify-between md:justify-evenly bg-white": true,
                    })}>
                    <PreviousButton/>
                    <h1 className="font-black font-mono text-2xl md:text-4xl text-center">
                        {new Date(currentTimestamp).toLocaleString(locale === "he" ? "he-IL" : "en-GB", {
                            month: "long",
                            year: "numeric",
                        })}
                    </h1>
                    <NextButton/>
                </div>
                <div className="overflow-hidden w-full">
                    <BalanceSummary timestamp={currentTimestamp}/>
                    <RealityVsExpectation categories={categories} budgetSummary={budgetSummary}/>
                </div>
                <div className="md:w-full">
                    <SubcategoryExpensesList
                        timestamp={currentTimestamp}
                        selectedSubcategoryId={selectedId || selectedSubcategory?.id}
                        subcategory={selectedSubcategory}/>
                </div>
                <div
                    className={classNames({
                        "md:thin-scrollbar": true,
                        "w-full md:h-fit": true,
                        "flex flex-col md:flex-row gap-4": true,
                        "grid grid-cols-1 xl:grid-cols-2": false,
                    })}>
                    {categories.summary.map((category) => {
                        return (
                            <CategoryBalance
                                key={category.id}
                                selectedId={selectedId}
                                setSelectedId={setSelectedId}
                                categoryId={category.id}
                                subcategoriesIds={category.subcategories.map((subcategory) => subcategory.id)}
                                categoryName={category.icon + " " + category.name}
                                categoryBudget={category.budget}
                                subcategoryBudgets={budget[category.id] ? budget[category.id] : {}}
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
