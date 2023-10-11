import { Categories } from "../../../constants";
import { noop } from "lodash"
import { LeanCategorySelection } from "../../organisms/CategorySelection";
import { Button, Spinner } from "../../atoms";
import { useEffect, useMemo, useState } from "react";
import { SimilarExpenses } from "../../organisms/SimilarExpenses";
import { ParseExpenseHeader } from "../../molecules/ParseExpenseHeader";

export const ExpensesList = ({
    expenses = [],
    existingExpenses = [],
    setExpenses = noop,
    submitExpenses = noop
  }) => {
    const [isCategorySelectionVisible, setIsCategorySelectionVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const expensesWithCategory = useMemo(() => expenses.filter((expense) => {
      return !!expense.categoryId;
    }), [expenses]);

    const [activeId, setActiveId] = useState(expenses.find((expense) => {
      return !expense.categoryId;
    })?.id || null);

    useEffect(() => {
      if (!activeId) {
        return;
      }

      const element = document.getElementById(String(activeId));
      if (!element) {
        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      });
    }, [activeId]);

    useEffect(() => {
      const nextExpense = expenses.find((expense) => {
        return !expense.categoryId;
      });

      if (nextExpense?.id === activeId) {
        return;
      }

      setActiveId(nextExpense?.id || null);
      // we do not want to update based on activeId
    }, [expenses]); // eslint-disable-line react-hooks/exhaustive-deps

    if (expenses.length === 0) {
      return null;
    }

    return (
      <div className="w-full h-full border-none lg:border-l border-black">
        <div className="sticky top-0 flex justify-between bg-white">
          <Button onClick={() => {
            setIsCategorySelectionVisible(!isCategorySelectionVisible);
          }}>
            {isCategorySelectionVisible ? "Hide" : "Show"} category selection
          </Button>
          <Button
            isDisabled={isLoading || expensesWithCategory.length === 0}
            className="flex items-center gap-2"
            onClick={async () => {
              setIsLoading(true);
              await submitExpenses(expensesWithCategory);
              setIsLoading(false);
            }}>
            <Spinner className={isLoading && "animate-spin"}/>
            <span>Submit {expensesWithCategory.length}</span>
          </Button>
        </div>
        <div className="mb-4 h-2/3 snap-y overflow-y-auto xl:p-4">
          {expenses.map((expense, index) => {
            let subcategory;
            Categories.forEach((category) => {
              category.subCategories.forEach((sub) => {
                if (sub.id === expense.categoryId) {
                  subcategory = sub;
                }
              });
            });

            return (
              <div className="snap-start" id={expense.id} onClick={() => {
                setActiveId(expense.id);
              }}>
                <ParseExpenseHeader
                  index={index}
                  name={expense.name}
                  note={expense.note}
                  amount={expense.amountCurrency}
                  date={expense.date}
                  isVisible={isCategorySelectionVisible}
                  setExpenses={setExpenses}
                  subcategory={subcategory}
                />
                {isCategorySelectionVisible && activeId === expense.id &&
                  <>
                    <SimilarExpenses
                      expense={expense}
                      existingExpenses={existingExpenses}/>
                    <LeanCategorySelection
                      onCategorySelect={(categoryId) => {
                        setExpenses((prev) => {
                          const newExpenses = [...prev];
                          newExpenses[index].categoryId = categoryId;
                          return newExpenses;
                        });
                      }}/>
                  </>}
              </div>
            )
          })}
        </div>
      </div>
    );
  }
;
