import classNames from "classnames";
import {CaretDown} from "@phosphor-icons/react";
import {useContext, useEffect, useMemo, useState} from "react";
import {CategoriesContext} from "../../context/CategoriesContext";
import {noop} from "lodash";
import {ExpenseCategorySelectionModal} from "../molecules/ExpenseCategorySelectionModal";
import {ExpensesContext} from "../../context";
import {useLingui} from "@lingui/react";
import {msg} from "@lingui/macro";

const getSimilarSubcategory = (expense, expenses = []) => {
    const similarExpense = expenses.find(existingExpense => {
        if (!existingExpense.subcategoryId) {
            return false;
        }

        return existingExpense.name.toLowerCase().includes(expense.name.toLowerCase());
    });

    return similarExpense?.subcategory;
}
export const ExpenseCategorySelection = ({
                                             expense = {},
                                             onCategorySelect = noop,
                                             readonly = false,
                                         }) => {
    const {_} = useLingui();
    const {expenses} = useContext(ExpensesContext);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(expense.subcategoryId);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const {categories} = useContext(CategoriesContext);
    const categoryLabel = useMemo(() => {
        const category = categories.find(category => category.subcategories.some(subcategory => subcategory.id === selectedSubcategoryId));
        return category?.name || "";
    }, [categories, selectedSubcategoryId]);
    const subcategoryLabel = useMemo(() => {
        const subcategory = categories
            .map(category => category.subcategories)
            .flat()
            .find(subcategory => subcategory.id === selectedSubcategoryId);

        if (subcategory) {
            return `${subcategory.icon} ${subcategory.name}`;
        }

        const similarSubcategory = getSimilarSubcategory(expense, expenses);
        if (similarSubcategory) {
            return `${similarSubcategory.icon} ${similarSubcategory.name}`;
        }

        return _(msg`Select Subcategory`);
    }, [expense, expenses, categories, selectedSubcategoryId]);

    useEffect(() => {
        const similarSubcategory = getSimilarSubcategory(expense, expenses);

        if (similarSubcategory && !selectedSubcategoryId) {
            setSelectedSubcategoryId(similarSubcategory.id);
            onCategorySelect(similarSubcategory.id);
        }
    }, [expense, expenses]);

    return (
        <>
            <button
                className={classNames({
                    "w-full border border-gray-300 text-black": !isCategoryMenuOpen,
                    "cursor-pointer hover:bg-black hover:text-white": !readonly,
                    "p-4 font-mono flex items-center justify-between": true,
                    "bg-blue-100": Boolean(selectedSubcategoryId),
                    "bg-white": !selectedSubcategoryId,
                    "rounded": true,
                })}
                onClick={() => {
                    if (readonly) {
                        return;
                    }

                    setIsCategoryMenuOpen(true);
                }}>
                <div className="w-full text-right">
                    {categoryLabel} > {subcategoryLabel}
                </div>
                <CaretDown/>
            </button>
            <ExpenseCategorySelectionModal
                isOpen={isCategoryMenuOpen}
                onClose={() => setIsCategoryMenuOpen(false)}
                expense={expense}
                expenses={expenses}
                onCategorySelect={id => {
                    setIsCategoryMenuOpen(false);
                    setSelectedSubcategoryId(id);
                    onCategorySelect(id);
                }}/>
        </>
    )
}