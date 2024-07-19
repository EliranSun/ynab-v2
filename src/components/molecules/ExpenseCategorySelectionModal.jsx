import classNames from "classnames";
import {X} from "@phosphor-icons/react";
import {SimilarExpenses} from "../organisms/SimilarExpenses";
import {LeanCategorySelection} from "../organisms/CategorySelection";
import {useClickAway} from "react-use";
import {useMemo, useRef} from "react";
import {noop} from "lodash";
import {createPortal} from "react-dom";

export const ExpenseCategorySelectionModal = ({
                                                  isOpen = false,
                                                  onClose = noop,
                                                  expense = {},
                                                  expenses = [],
                                                  onCategorySelect = noop,
                                              }) => {
    const ref = useRef(null);
    const suggestedSubcategory = useMemo(() => {
        const similarExpense = expenses.find(existingItem => {
            if (!existingItem.subcategoryId || !expense.name || !existingItem.name) {
                return false;
            }

            return existingItem.name.toLowerCase() === expense.name.toLowerCase();
        });

        return similarExpense?.subcategoryId;
    }, [expenses]);

    useClickAway(ref, () => {
        onClose();
    });

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div
            dir="rtl"
            className={classNames({
                "backdrop-blur-md": true,
                "backdrop-brightness-50": false,
                "fixed m-auto z-40 top-0 inset-x-0 w-screen h-screen": true,
                "flex flex-col items-center justify-start": true,
            })}>
            <div className="my-8 rounded-full bg-black p-8">
                <X size={32} color="white"/>
            </div>
            <div ref={ref} className={classNames({
                "h-fit w-fit": true,
                "overflow-y-auto p-4 bg-gray-100 rounded-xl": true,
                "border-2 border-gray-500": true,
            })}>
                <SimilarExpenses expense={expense} existingExpenses={expenses}/>
                <LeanCategorySelection onCategorySelect={onCategorySelect}/>
                <div>
                    <h3 className="text-4xl">{suggestedSubcategory}</h3>
                </div>
            </div>
        </div>, document.body);
};
