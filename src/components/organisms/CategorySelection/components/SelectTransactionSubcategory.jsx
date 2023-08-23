import { noop } from "lodash";
import { useContext } from "react";
import { ExpensesContext } from "../../../../context";
import classNames from "classnames";


const SelectTransactionSubcategory = ({
    transaction,
    categoryId,
    onSelect = noop,
    categories = [],
    isListView = false,
    note = ""
  }) => {
    const { changeExpenseCategory } = useContext(ExpensesContext);
    
    if (isListView) {
      return (
        <select
          value={categoryId}
          onChange={(e) => {
            changeExpenseCategory(transaction.id, e.target.value, note);
            onSelect(e.target.value);
          }}
        >
          {categories.map((category) => (
            <>
              <option value={category.id}>======{category.name}======</option>
              {category?.subCategories?.map((subcategory) => (
                <option value={subcategory.id}>
                  {subcategory.icon} {subcategory.name}
                </option>
              ))}
            </>
          ))}
        </select>
      );
    }
    
    return (
      <div className="flex flex-wrap">
        {categories.map((option) => {
          return (
            <div key={option.id} className="border border-red-100 p-4 flex flex-wrap flex-col">
              <div>
                <b>{option.name}</b>
              </div>
              <div className="w-full">
                {option.subCategories.map((sub) => {
                  return (
                    <div
                      key={sub.id}
                      className={classNames("text-center justify-center flex items-center border border-red-300 w-40 h-16 shrink-0 hover:bg-red-500 hover:text-white hover:border-black-300", {
                        "bg-red-500 text-white border-black-300": String(categoryId) === String(sub.id),
                      })}
                      onClick={() => {
                        changeExpenseCategory(transaction.id, sub.id, note);
                        onSelect();
                      }}
                    >
                      <span>{sub.icon} {sub.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
;

export default SelectTransactionSubcategory;
