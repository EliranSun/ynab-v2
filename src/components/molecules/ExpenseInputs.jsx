import classNames from "classnames";
import {CaretDown, X} from "@phosphor-icons/react";
import {noop} from "lodash";
import {msg} from "@lingui/macro";
import {useLingui} from "@lingui/react";
import {InputTypes} from "../pages/ParseExpensesList/constants";

const InputPlaceholder = {
    name: msg`name`,
    amount: msg`amount`,
    note: msg`note`,
};

const formatTimestamp = (timestamp) => {
    // timestamp to 2021-06-30
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
};

export const ExpenseInputs = ({
                                  index,
                                  name,
                                  note,
                                  amount,
                                  date,
                                  timestamp,
                                  isVisible,
                                  // setExpenses = noop,
                                  subcategory = {},
                                  onCategoryMenuClick = noop,
                                  isCategoryMenuOpen,
                                  onInputChange = noop,
                                  onRemove = noop,
                              }) => {
    const {_} = useLingui();
    console.log({amount, name});

    return (
        <div className={classNames("text-right w-full", {
            "rounded-xl p-4 md:p-2": true,
            "flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4": true,
            "bg-gray-200 border-gray-500": index % 2 === 0 || isVisible,
        })}>
            <span className="cursor-pointer" onClick={onRemove}>
                <X color="red" size={42}/>
            </span>
            <input
                type="date"
                className="w-44 p-4 border border-gray-300 rounded"
                // date="June 30, 24"
                // defaultValue="2021-06-30"
                defaultValue={formatTimestamp(timestamp)}
                onChange={(event) => {
                    onInputChange(InputTypes.DATE, event.target.value);
                }}
            />
            <div className="flex gap-2">
                <input
                    type="text"
                    defaultValue={name}
                    placeholder={_(InputPlaceholder.name)}
                    className="w-2/3 md:w-40 p-4 border border-gray-300 rounded"
                    onChange={(event) => {
                        onInputChange(InputTypes.NAME, event.target.value);
                    }}/>
                <input
                    type="number"
                    defaultValue={amount}
                    placeholder={_(InputPlaceholder.amount)}
                    className="w-1/3 md:w-40 p-4 border border-gray-300 rounded"
                    onChange={(event) => {
                        onInputChange(InputTypes.AMOUNT, event.target.value);
                    }}
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
                <span>{subcategory.icon} {subcategory.name}</span>
                <CaretDown/>
            </button>
            <input
                type="text"
                placeholder={_(InputPlaceholder.note)}
                defaultValue={note}
                className="border border-gray-300 rounded p-4 h-20 md:h-auto"
                onChange={(event) => {
                    onInputChange(InputTypes.NOTE, event.target.value);
                    // setExpenses((prev) => {
                    //     const newExpenses = [...prev];
                    //     newExpenses[index].note = event.target.value;
                    //     return newExpenses;
                    // });
                }}/>
        </div>
    );
};