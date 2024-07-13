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
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const {categories} = useContext(CategoriesContext);
    const subcategoryLabel = useMemo(() => {
        const subcategory = categories
            .map(category => category.subcategories)
            .flat()
            .find(subcategory => subcategory.id === selectedSubcategoryId);

        return subcategory ? `${subcategory.icon} ${subcategory.name}` : _("Select category");
    }, [categories, selectedSubcategoryId]);

    return (
        <>
            <button
                className={classNames({
                    "border border-gray-300 bg-white text-black": !isCategoryMenuOpen,
                    "hover:bg-black hover:text-white": true,
                    "p-4 font-mono flex items-center justify-between": true,
                    "cursor-pointer rounded": true,
                })}
                onClick={() => {
                    if (readonly) {
                        return;
                    }

                    setIsCategoryMenuOpen(true);
                }}>
                <span>{subcategoryLabel}</span>
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