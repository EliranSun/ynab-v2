import classNames from "classnames";
import {X} from "@phosphor-icons/react";
import {SimilarExpenses} from "../organisms/SimilarExpenses";
import {LeanCategorySelection} from "../organisms/CategorySelection";
import {useClickAway} from "react-use";
import {useRef} from "react";
import {noop} from "lodash";

export const ExpenseCategorySelectionModal = ({
                                                  isOpen = false,
                                                  onClose = noop,
                                                  expense = {},
                                                  expenses = [],
                                                  onCategorySelect = noop,
                                              }) => {
    const ref = useRef(null);

    useClickAway(ref, () => {
        onClose();
    });

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className={classNames({
                "backdrop-blur-md": true,
                "backdrop-brightness-50": false,
                "fixed m-auto z-30 inset-0": true,
                "flex flex-col items-center justify-center": true,
            })}>
            <div className="mb-4 rounded-full bg-black p-8">
                <X size={32} color="white"/>
            </div>
            <div ref={ref} className={classNames({
                "max-w-screen-lg h-5/6 w-11/12 overflow-y-auto p-4 bg-gray-100 rounded-xl": true,
                "border-2 border-gray-500": true,
            })}>
                <SimilarExpenses expense={expense} existingExpenses={expenses}/>
                <LeanCategorySelection onCategorySelect={onCategorySelect}/>
            </div>
        </div>
    );
};
