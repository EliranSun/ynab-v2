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
    <div className={classNames("flex justify-start gap-4 py-2", {
      "": !isVisible,
      "bg-gray-200": index % 2 === 0 || isVisible,
    })}>
      <span className="w-2/6">
        <b>{name}</b>
      </span>
      <input
        type="text"
        placeholder="note"
        value={note}
        className="w-1/6 border border-gray-500 px-2"
        onChange={(event) => {
          setExpenses((prev) => {
            const newExpenses = [...prev];
            newExpenses[index].note = event.target.value;
            return newExpenses;
          });
        }}/>
      <span className="cursor-pointer w-1/6" onClick={() => {
        setExpenses((prev) => {
          const newExpenses = [...prev];
          newExpenses[index].categoryId = null;
          return newExpenses;
        });
      }}>
        {subcategory?.icon} {subcategory?.name}
      </span>
      <span className="w-1/6">
        {amount}
      </span>
      <span className="w-1/6">
        {date}
      </span>
      <span className="px-4 cursor-pointer">
        <X color="red" size={20}/>
      </span>
    </div>
  );
};