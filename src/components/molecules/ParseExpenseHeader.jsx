import classNames from "classnames";
import { X } from "@phosphor-icons/react";
import { noop } from "lodash";

export const ParseExpenseHeader = ({
    index,
    name,
    note,
    amount,
    date,
    isVisible,
    setExpenses = noop,
    subcategory
}) => {
    return (
        <div className={classNames("flex py-2 justify-center gap-8 text-right", {
            "": !isVisible,
            "bg-gray-200": index % 2 === 0 || isVisible,
        })}>
            <span className="w-40"><b>{name}</b></span>
            <span className="cursor-pointer w-32 text-left" onClick={() => {
                setExpenses((prev) => {
                    const newExpenses = [...prev];
                    newExpenses[index].categoryId = null;
                    return newExpenses;
                });
            }}>
                {subcategory?.icon} {subcategory?.name}
            </span>
            <input
                type="text"
                placeholder="note"
                value={note}
                className="border border-gray-500 px-2"
                onChange={(event) => {
                    setExpenses((prev) => {
                        const newExpenses = [...prev];
                        newExpenses[index].note = event.target.value;
                        return newExpenses;
                    });
                }}/>
            <span className="w-16">{amount}</span>
            <span className="w-32" dir="">{date}</span>
            <span className="px-4 cursor-pointer">
                <X color="red" size={20}/>
            </span>
        </div>
    );
};