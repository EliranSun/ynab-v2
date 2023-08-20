import { useMemo } from "react";
import { Title } from "../atoms";
import { withExpensesContext } from "../../HOC/withExpensesContext";
import { getExistingExpenses } from "../../utils/expenses";
import { X } from "@phosphor-icons/react";
import { noop } from "lodash";

const SeeingDoublePage = ({ expenses = [], deleteExpense = noop, refetchExpenses = noop }) => {
  const duplicateExpenses = useMemo(() => {
    const duplicates = [];
    const keys = [];
    expenses.forEach(expense => {
      const existing = getExistingExpenses(expense, expenses);
      const key = `${expense.name}-${expense.amount}-${expense.timestamp}`;
      if (existing.length > 1 && !keys.includes(key)) {
        duplicates.push(existing);
        keys.push(key);
      }
    });
    
    return duplicates;
  }, [expenses]);
  
  return (
      <section className="max-w-5xl m-auto">
        <Title>Seeing Double</Title>
        <Title type={Title.Types.H2}>{expenses.length} expenses, {duplicateExpenses.length} duplicates</Title>
        <div className="flex flex-wrap my-4 w-full justify-between">
          {duplicateExpenses.map((expenses, index) => {
            return (
                <div key={index} className="bg-gray-200 p-2 w-1/6 m-1">
                  {expenses.map(expense => {
                    return (
                        <div key={expense.id} className="relative bg-gray-100 m-1 p-2">
                          <span
                              onClick={async () => {
                                if (window.confirm("Are you sure you want to delete this expense?")) {
                                  await deleteExpense(expense.id);
                                  refetchExpenses()
                                }
                              }}
                              className="absolute top-0 -right-5 bg-white rounded-full drop-shadow p-1 cursor-pointer">
                            <X size={20} color="red"/>
                          </span>
                          <p><b>{expense.name}</b></p>
                          <p>{expense.amountCurrency}</p>
                          <p>{expense.subcategoryLabel}</p>
                          <p>{expense.date}</p>
                          <p className="text-sm">{expense.note}</p>
                        </div>
                    )
                  })}
                </div>
            )
          })}
        </div>
      </section>
  )
}

export default withExpensesContext(SeeingDoublePage);