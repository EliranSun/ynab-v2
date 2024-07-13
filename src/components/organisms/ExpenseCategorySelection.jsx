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
                                             subcategoryId,
                                             onCategorySelect = noop,
                                             readonly,
                                             onClick = noop
                                         }) => {
    const {_} = useLingui();
    const {expenses} = useContext(ExpensesContext);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const {categories} = useContext(CategoriesContext);
    const subcategoryLabel = useMemo(() => {
        const subcategory = categories
            .map(category => category.subcategories)
            .flat()
            .find(subcategory => subcategory.id === subcategoryId);

        return subcategory ? `${subcategory.icon} ${subcategory.name}` : _("Select category");
    }, [categories, subcategoryId]);

    return (
        <>
            <button
                className={classNames({
                    "border border-gray-300 bg-white text-black": !isCategoryMenuOpen,
                    "hover:bg-black hover:text-white": true,
                    "p-4 font-mono flex items-center justify-between": true,
                    "cursor-pointer rounded w-1/6": true,
                })}
                onClick={() => {
                    if (readonly) {
                        return;
                    }

                    onClick();
                }}>
                <span>{subcategoryLabel}</span>
                <CaretDown/>
            </button>
            <ExpenseCategorySelectionModal
                isOpen={isCategoryMenuOpen}
                onClose={() => setIsCategoryMenuOpen(false)}
                expense={expense}
                expenses={expenses}
                onCategorySelect={onCategorySelect}/>
        </>
    )
}