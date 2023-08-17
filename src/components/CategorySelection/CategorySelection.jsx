import { useMemo, useState } from "react";
import { aggregateTransactionsByName } from "../../utils";
import { Transaction, TransactionList } from "./components";
import { Title } from "../atoms";

const CategorySelectionViewModes = {
  SLIDES: "SLIDES",
  LIST: "LIST",
};

const CategorySelection = ({ expenses = [], lean }) => {
  const [viewMode, setViewMode] = useState(CategorySelectionViewModes.SLIDES);
  const aggregatedExpenses = useMemo(
      () => aggregateTransactionsByName(expenses),
      [expenses]
  );
  const firstUncategorizedTransactionIndex = useMemo(
      () =>
          aggregatedExpenses.findIndex((expense) => !expense.categoryId),
      [aggregatedExpenses]
  );
  
  const [transactionIndex, setTransactionIndex] = useState(
      firstUncategorizedTransactionIndex === -1
          ? 0
          : firstUncategorizedTransactionIndex
  );
  
  if (!aggregatedExpenses.length) {
    return null;
  }
  
  if (lean) {
    
  }
  
  // TODO: show only unhandled expense
  // TODO: on row click - highlight row
  return (
      <section>
        <Title>Prepare - Expenses Category Selection</Title>
        <div className="flex flex-col">
          <div>
            <button
                disabled={transactionIndex === 0}
                onClick={() => {
                  if (transactionIndex === 0) {
                    return;
                  }
                  
                  setTransactionIndex(prev => prev - 1);
                }}
            >
              Previous Transaction
            </button>
            <span>{" "}{transactionIndex + 1} / {aggregatedExpenses.length}{" "}</span>
            <button
                onClick={() => {
                  if (transactionIndex === aggregatedExpenses.length - 1) {
                    return;
                  }
                  
                  setTransactionIndex(prev => prev + 1);
                }}
                disabled={transactionIndex === aggregatedExpenses.length + 1}
            >
              Next Transaction
            </button>
            <div>
              {viewMode === CategorySelectionViewModes.SLIDES ? (
                  <Transaction
                      onSelect={() => {
                        if (transactionIndex === aggregatedExpenses.length - 1) {
                          return;
                        }
                        
                        setTransactionIndex(prev => prev + 1)
                      }}
                      transaction={aggregatedExpenses[transactionIndex]}
                  />
              ) : (
                  <TransactionList
                      transactions={aggregatedExpenses}
                  />
              )}
            </div>
          
          </div>
          
          <div>
            <Title type={Title.Types.H4}>Grouped Expenses count: {aggregatedExpenses.length}</Title>
            <Title type={Title.Types.H4}>Total Expenses count: {expenses.length}</Title>
            <div>
              <fieldset>
                <legend>Categories Selection View</legend>
                <div>
                  <input
                      id="slides"
                      type="radio"
                      name="category-selection-view"
                      onClick={() => setViewMode(CategorySelectionViewModes.SLIDES)}
                  />
                  <label htmlFor="slides">
                    Slides (good for choosing category for transaction batches)
                  </label>
                </div>
                <div>
                  <input
                      type="radio"
                      id="list"
                      name="category-selection-view"
                      onClick={() => setViewMode(CategorySelectionViewModes.LIST)}
                  />
                  <label htmlFor="list">
                    List (good for changing specific transactions)
                  </label>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </section>
  );
};

CategorySelection.whyDidYouRender = true;
export default CategorySelection;
