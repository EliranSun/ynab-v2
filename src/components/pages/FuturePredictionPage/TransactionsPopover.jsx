import classNames from "classnames";
import { getSubCategoryName } from "../../../constants";
import { deleteExpense } from "../../../utils";
import { noop } from "lodash";

const IncomeCategoryIds = [80, 81, 82, 83];

const TransactionPopover = ({
  data = [],
  isFullView = false,
  selectedExpenseId = null,
  setSelectedExpenseId = noop
}) => {
  return (
    <div
      className={classNames("fixed bottom-10 right-20 z-10 w-fit resize-x shadow-xl rounded-2xl p-4 bg-white", {
        "h-60": !isFullView,
        "h-5/6": isFullView,
      })}>
      <div className="overflow-auto h-full">
        <table cellPadding={10}>
          <tbody>
          {data.map((expense, index) => {
            const isIncome = IncomeCategoryIds.includes(expense.categoryId);
            const isSelected = expense.id === selectedExpenseId;
            return (
              <tr
                id={expense.id}
                key={expense.id}
                onClick={() => setSelectedExpenseId(expense.id)}
                className={classNames({
                  "bg-white": !isSelected && index % 2 === 0,
                  "bg-gray-100": !isSelected && index % 2 !== 0,
                  "text-white": isSelected,
                  "text-green-500": isIncome && !isSelected,
                  "text-red-500": !isIncome && !isSelected,
                  "bg-green-500": isIncome && isSelected,
                  "bg-red-500": !isIncome && isSelected,
                })}
              >
                <td>{new Date(expense.date).toLocaleDateString("en-GB")}</td>
                <td>{expense.name}</td>
                <td>{getSubCategoryName(expense.categoryId)}</td>
                <td className="text-xs">{expense.note}</td>
                <td>{expense.amount}</td>
                <td>{expense.balance.toFixed(2)}</td>
                <td
                  style={{
                    cursor: "pointer",
                    opacity: isSelected ? 1 : 0.5,
                  }}
                  onClick={async () => {
                    if (!isSelected) {
                      return;
                    }
                    if (!window.confirm("Are you sure you want to delete this expense?")) {
                      return;
                    }
                    
                    await deleteExpense(expense.id);
                  }}
                >
                  ❌
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default TransactionPopover;
