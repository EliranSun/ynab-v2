import classNames from "classnames";
import {CaretDown, X} from "@phosphor-icons/react";
import {noop} from "lodash";
import {useState} from "react";
import {Trans, msg} from "@lingui/macro";
import {useLingui} from "@lingui/react";

const InputPlaceholder = {
    name: msg`name`,
    amount: msg`amount`,
    note: msg`note`,
}
export const ExpenseInput = ({
                                 index,
                                 name,
                                 note,
                                 amount,
                                 date,
                                 isVisible,
                                 setExpenses = noop,
                                 subcategory,
                                 onCategoryMenuClick = noop,
                                 isCategoryMenuOpen,
                             }) => {
    const {_} = useLingui();

    return (
        <div className={classNames("text-right w-full", {
            "rounded-xl p-4 md:p-0 md:py-2 shadow-xl": true,
            "flex flex-col md:flex-row justify-center gap-2 md:gap-8": true,
            "bg-gray-100": index % 2 === 0 || isVisible,
        })}>
            <span className="cursor-pointer">
                <X color="red" size={20}/>
            </span>
            <input type="date" className="w-full p-4 border border-gray-300 rounded" defaultValue={date}/>
            <div className="flex gap-2">
                <input
                    type="text"
                    defaultValue={name}
                    placeholder={_(InputPlaceholder.name)}
                    className="w-2/3 md:w-40 p-4 border border-gray-300 rounded"/>
                <input
                    type="number"
                    defaultValue={amount}
                    placeholder={_(InputPlaceholder.amount)}
                    className="w-1/3 md:w-40 p-4 border border-gray-300 rounded"
                />
            </div>
            <button
                className={classNames({
                    "border border-gray-300 bg-white text-black": !isCategoryMenuOpen,
                    "hover:bg-black hover:text-white": true,
                    "p-4 font-mono flex items-center justify-between": true,
                    "cursor-pointer rounded md:w-32": true,
                })}
                onClick={() => {
                    onCategoryMenuClick();
                    // setExpenses((prev) => {
                    //     const newExpenses = [...prev];
                    //     newExpenses[index].categoryId = null;
                    //     return newExpenses;
                    // });
                }}>
                <span>{subcategory?.icon} {subcategory?.label}</span>
                <CaretDown/>
            </button>
            <input
                type="text"
                placeholder={_(InputPlaceholder.note)}
                value={note}
                className="border border-gray-300 rounded p-4 h-20 md:h-auto"
                onChange={(event) => {
                    setExpenses((prev) => {
                        const newExpenses = [...prev];
                        newExpenses[index].note = event.target.value;
                        return newExpenses;
                    });
                }}/>
            <button className="p-4 bg-blue-500 text-white cursor-pointer rounded-xl shadow-xl">
                <Trans>Add Expense</Trans>
            </button>
        </div>
    );
};