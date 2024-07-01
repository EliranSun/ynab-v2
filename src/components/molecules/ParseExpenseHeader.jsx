import classNames from "classnames";
import {X} from "@phosphor-icons/react";
import {noop} from "lodash";
import {useState} from "react";

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
    const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);

    return (
        <div className={classNames("text-right w-full", {
            "rounded-xl p-4 md:p-0 md:py-2 shadow-xl": true,
            "flex flex-col md:flex-row justify-center gap-2 md:gap-8": true,
            "bg-gray-100": index % 2 === 0 || isVisible,
        })}>
            <span className="cursor-pointer">
                <X color="red" size={20}/>
            </span>
            <input type="date"  className="w-full p-4 border border-gray-300 rounded" defaultValue={date}/>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder='name'
                    defaultValue={name}
                    className="w-auto md:w-40 p-4 border border-gray-300 rounded"/>
                <input
                    type="number"
                    className="w-auto md:w-40 p-4 border border-gray-300 rounded"
                    defaultValue={amount}/>
            </div>
            <span
                className={classNames({
                    "border-4 border-black bg-white text-black": !isCategoriesMenuOpen,
                    "hover:bg-black hover:text-white": true,
                    "bg-black text-white p-4 flex items-center justify-center": true,
                    "cursor-pointer rounded-full w-32": true,
                })}
                  onClick={() => {
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
                className="border border-gray-300 rounded p-4 h-20 md:h-auto"
                onChange={(event) => {
                    setExpenses((prev) => {
                        const newExpenses = [...prev];
                        newExpenses[index].note = event.target.value;
                        return newExpenses;
                    });
                }}/>
        </div>
    );
};