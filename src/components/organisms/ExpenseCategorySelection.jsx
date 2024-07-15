import classNames from "classnames";
import {CaretDown} from "@phosphor-icons/react";
import {useContext, useMemo, useState} from "react";
import {CategoriesContext} from "../../context/CategoriesContext";
import {noop} from "lodash";
import {ExpenseCategorySelectionModal} from "../molecules/ExpenseCategorySelectionModal";
import {ExpensesContext} from "../../context";
import {useLingui} from "@lingui/react";

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
    const subcategoryLabel = useMemo(() => {
        const subcategory = categories
            .map(category => category.subcategories)
            .flat()
            .find(subcategory => subcategory.id === selectedSubcategoryId);

        return subcategory ? `${subcategory.icon} ${subcategory.name}` : _("Subcategory");
    }, [categories, selectedSubcategoryId]);

    return (
        <>
            <button
                className={classNames({
                    "w-full border border-gray-300 bg-white text-black": !isCategoryMenuOpen,
                    "cursor-pointer hover:bg-black hover:text-white": !readonly,
                    "p-4 font-mono flex items-center justify-between": true,
                    "rounded": true,
                })}
                onClick={() => {
                    if (readonly) {
                        return;
                    }

                    setIsCategoryMenuOpen(true);
                }}>
                <div className="w-fit">{subcategoryLabel}</div>
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