import { useContext, useMemo, useState } from "react";
import { orderBy, round } from "lodash";
import { isSameMonth } from "date-fns";
import { Exclude, Faders, PiggyBank } from "@phosphor-icons/react";
import { Categories } from "../../../constants";
import { formatCurrency } from "../../../utils";
import Subcategory from "../Subcategory/Subcategory";
import { ExpensesContext } from "../../../context";
import { useCategoryExpensesSummary } from "../../../hooks/useCategoryExpensesSummary";
import classNames from "classnames";
import { Title } from "../../atoms";
import { Trans } from "@lingui/macro";
import { CategoriesContext } from "../../../context/CategoriesContext";
import { isDesktop, isMobile } from "../../../utils/device";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/macro";
import { GuageBar } from "../../atoms/GuageBar";

const DataStrip = ({ categoryId, categoryBudget, averages, diff }) => {
    return (
        <div className="flex justify-between">
            <div className="flex flex-col items-center">
                <div className={classNames({
                    "font-bold font-mono text-lg": true,
                    "text-green-500": diff > 0,
                    "text-red-500": diff < 0
                })}>
                    {formatCurrency(diff)}
                </div>
                <div className="flex gap-1 items-center text-xs">
                    <Exclude /> {diff > 0 ? <Trans>left to spend</Trans> : <Trans>over budget</Trans>}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="font-mono text-lg">
                    {formatCurrency(categoryBudget, false, false)}
                </div>
                <div className="flex gap-1 items-center text-xs">
                    <PiggyBank /> <Trans>budget</Trans>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="font-mono text-lg">
                    {formatCurrency(averages[categoryId], false, false)}
                </div>
                <div className="flex gap-1 items-center text-xs">
                    <Faders />
                    <Trans>average</Trans>
                </div>
            </div>
        </div>
    )
};

export const CategoryBalance = ({
    isNsfw,
    categoryId,
    subcategories,
    categoryName,
    currentTimestamp,
    isSameDate,
    isPreviousMonth,
    selectedId,
    setSelectedId
}) => {
    const { _ } = useLingui();
    const [isExpanded, setIsExpanded] = useState(isDesktop());
    const { expenses } = useContext(ExpensesContext);
    const { categories } = useContext(CategoriesContext);
    const { subcategoriesSummary, categoriesExpensesSummary } = useCategoryExpensesSummary(subcategories, currentTimestamp);
    const { totalExpensesSum, averages } = categoriesExpensesSummary;


    const categoryBudget = useMemo(() => {
        return subcategories.reduce((acc, subcategory) => {
            return acc + subcategory.budget;
        }, 0);
    }, [subcategories]);

    // const diff = useMemo(() => categoryBudget - totalExpensesSum, [categoryBudget, totalExpensesSum]);

    // if (totalExpensesSum === 0) {
    //     return null;
    // }

    console.log({ subcategories });

    if (totalExpensesSum === 0) {
        return null;
    }

    return (
        <div className={classNames({
            "md:h-fit p-2 md:p-4 box-border relative flex-grow shadow": true,
            "bg-gray-50": !isNsfw,
            'rounded-lg': isMobile()
        })}>
            <div
                className={classNames({
                    "cursor-pointer flex flex-row-reverse md:flex-col items-center md:items-start justify-between": true,
                    "md:mb-4": !isExpanded,
                    "mb-2 pb-2 border-b": isExpanded
                })}
                onClick={() => setIsExpanded(!isExpanded)}>
                <div className={classNames({
                    "text-lg font-mono relative": true,
                    // "border-red-500": diff < 0,
                    // "border-green-600": diff >= 0,
                    "flex flex-col items-center justify-between": true,
                    "border border-gray-300": false,
                    "px-2 py-1 w-40 md:w-full overflow-hidden": true,
                })}>
                    <div className="w-full flex items-end justify-between">
                        <span className={classNames({
                            "font-semibold relative z-10": true,
                            "text-gray-800": true,
                            // "text-red-500": diff < 0,
                            // "text-green-600": diff >= 0
                        })}>
                            {formatCurrency(round(totalExpensesSum, -1), false, false)}
                        </span>
                    </div>
                    <GuageBar amount={totalExpensesSum} max={categoryBudget} />
                </div>
                <Title type={Title.Types.H4} className="">
                    {categoryName}
                </Title>
            </div>
            {/* <DataStrip
                categoryId={categoryId}
                categoryBudget={categoryBudget}
                averages={averages}
                diff={diff} /> */}
            {isExpanded ?
                <div className="flex flex-col gap-1 md:gap-4 w-full md:h-fit overflow-y-auto">
                    {subcategoriesSummary.map((subcategory) => {
                        return (
                            <Subcategory
                                {...subcategory}
                                key={subcategory.id}
                                budget={subcategory.budget}
                                isSelected={selectedId === subcategory.id}
                                onSubcategoryClick={setSelectedId}
                                currentTimestamp={currentTimestamp}
                                isPreviousMonth={isPreviousMonth}
                                isSameDate={isSameDate}
                            />
                        );
                    })}
                </div> : null}
        </div>
    )
};
