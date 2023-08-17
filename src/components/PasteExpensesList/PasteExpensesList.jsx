import { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { Expense } from "../../models";
import { Button, Title, Spinner } from "../atoms";
import { withExpensesContext } from "../../HOC/withExpensesContext";
import { LeanCategorySelection } from "../CategorySelection";
import { Categories } from "../../constants";
// import { SheetUpload } from "../SheetUpload";

const isExistingExpense = (newExpense, expenses) => {
  return expenses.find((expense) => {
    if (expense.name === 'FREETV') {
      console.log({ expense, newExpense });
    }
    return (
        expense.name === newExpense.name &&
        expense.timestamp === newExpense.timestamp &&
        newExpense.amount === expense.amount
    );
  });
};

const parseNewExpenses = (text = '', existingExpenses = []) => {
  const rows = text.split("\n");
  return rows.map((row) => {
    const cells = row.split("\t");
    const name = cells[0];
    const amount = cells[4];
    const dateParts = cells[1]?.split("/");
    const year = dateParts && `20${dateParts[2]}`;
    const month = dateParts && Number(dateParts[1]) - 1;
    const day = dateParts && dateParts[0];
    const timestamp = new Date(Date.UTC(year, month, day)).getTime();
    const parsedAmount =
        amount &&
        parseFloat(amount.replace(",", "").replace("₪", "").trim());
    
    if (!name || !parsedAmount || !timestamp) {
      return {};
    }
    
    return new Expense({
      name: name,
      timestamp: timestamp,
      amount: parsedAmount,
      note: cells[5],
    });
  })
      .filter((row) => {
        if (isExistingExpense(row, existingExpenses)) {
          return false;
        }
        
        return row.name && row.amount && row.timestamp;
      });
};

export const PasteExpensesList = ({ text = "", expenses, setExpenses = () => {} }) => {
  const textAreaRef = useRef(null);
  const [message, setMessage] = useState("");
  const [value, setValue] = useState(text);
  const [isParseButtonDisabled, setIsParseButtonDisabled] = useState(false);
  const [parsedExpenses, setParsedExpenses] = useState([]);
  const [isStatusAnimated, setIsStatusAnimated] = useState(false);
  const [isCategorySelectionVisible, setIsCategorySelectionVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const expensesWithCategory = useMemo(() => parsedExpenses.filter((expense) => {
    return !!expense.categoryId;
  }), [parsedExpenses]);
  
  useEffect(() => {
    if (isStatusAnimated) {
      setTimeout(() => {
        setIsStatusAnimated(false);
      }, 3000);
    }
  }, [parsedExpenses, isStatusAnimated]);
  
  useEffect(() => {
    const savedTextareaValue = localStorage.getItem("textarea-value");
    const savedParsedExpenses = localStorage.getItem("parsed-expenses");
    
    if (savedParsedExpenses) {
      const data = JSON.parse(savedParsedExpenses);
      console.log(data.length);
      
      setParsedExpenses(data.filter(item => {
        return !isExistingExpense(item, expenses);
      }));
    }
    
    if (savedTextareaValue) {
      setValue(savedTextareaValue);
    }
  }, [expenses]);
  
  useEffect(() => {
    if (!value) {
      return;
    }
    
    localStorage.setItem("textarea-value", value);
  }, [value]);
  
  useEffect(() => {
    if (!parsedExpenses.length) {
      return;
    }
    
    localStorage.setItem("parsed-expenses", JSON.stringify(parsedExpenses));
  }, [parsedExpenses]);
  
  const setNewExpenses = () => {
    if (!textAreaRef.current) {
      return;
    }
    
    setIsStatusAnimated(true);
    const newExpenses = parseNewExpenses(textAreaRef.current.value, expenses);
    
    if (newExpenses.length === 0) {
      setMessage("Nothing new");
      return;
    }
    
    setMessage(`${newExpenses.length} new expenses`);
    setParsedExpenses(newExpenses);
    localStorage.setItem("parsed-expenses", JSON.stringify(newExpenses));
  }
  
  return (
      <div className="m-8">
        <Title type={Title.Types.H1}>Parse expenses</Title>
        <Title type={Title.Types.H2}>
          Existing expenses: {expenses.length}
          {parsedExpenses.length ? ` • New expenses: ${parsedExpenses.length}` : ''}
        </Title>
        <div className="flex gap-4 max-w-7xl flex-col-reverse lg:flex-row">
          <div className="flex flex-col w-1/3 h-full">
            <textarea
                className="border border-dashed border-black p-4 outline-none w-full h-full"
                placeholder="Paste expenses here"
                ref={textAreaRef}
                value={value}
                onChange={event => {
                  setIsParseButtonDisabled(!event.target.value);
                  setValue(event.target.value);
                }}/>
            <Button
                className={classNames("my-4", {
                  "animate-pulse duration-500": isStatusAnimated,
                })}
                isDisabled={isParseButtonDisabled}
                onClick={setNewExpenses}>
              {isStatusAnimated ? message : "Parse expenses"}
            </Button>
          </div>
          {/*<div className="w-1/3 text-center">*/}
          {/*  <Title type={Title.Types.H2}>Upload a sheet</Title>*/}
          {/*  <SheetUpload/>*/}
          {/*</div>*/}
          {/*{message &&*/}
          {/*    <div*/}
          {/*        role="status"*/}
          {/*        className={classNames("absolute bottom-20 mb-4 text-blue-500 p-4 border-2 border-dashed border-blue-500", {*/}
          {/*          "animate-pulse duration-500": isStatusAnimated,*/}
          {/*        })}>*/}
          {/*      {message}*/}
          {/*    </div>}*/}
          {parsedExpenses.length > 0 &&
              <div className="lg:w-2/3 border-none lg:border-l border-black lg:px-8">
                <div className="lg:p-4 mb-4 h-96 snap-y overflow-y-scroll">
                  {parsedExpenses.map((expense, index) => {
                    let subcategory;
                    Categories.forEach((category) => {
                      category.subCategories.forEach((sub) => {
                        if (sub.id === expense.categoryId) {
                          subcategory = sub;
                        }
                      });
                    });
                    return (
                        <div className="snap-start">
                          <div className={classNames("flex gap-4 py-2", {
                            "": !isCategorySelectionVisible,
                            "bg-gray-200": index % 2 === 0 || isCategorySelectionVisible,
                          })}>
                            <span className="w-2/6">
                              <b>{expense.name}</b>
                            </span>
                            <input
                                type="text"
                                placeholder="note"
                                value={expense.note}
                                onChange={(event) => {
                                  setParsedExpenses((prev) => {
                                    const newExpenses = [...prev];
                                    newExpenses[index].note = event.target.value;
                                    return newExpenses;
                                  });
                                }}
                                className="w-1/6 border border-gray-500 px-2"/>
                            <span className="cursor-pointer w-1/6" onClick={() => {
                              setParsedExpenses((prev) => {
                                const newExpenses = [...prev];
                                newExpenses[index].categoryId = null;
                                return newExpenses;
                              });
                            }}>
                              {subcategory?.icon} {subcategory?.name}
                            </span>
                            <span className="w-1/6">
                              {new Intl.NumberFormat('he-IL', {
                                style: 'currency',
                                currency: 'ILS'
                              }).format(expense.amount)}
                            </span>
                            <span className="w-1/6">
                              {new Date(expense.timestamp).toLocaleString('en-GB', {
                                month: 'short',
                                year: '2-digit',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          {isCategorySelectionVisible && !expense.categoryId &&
                              <LeanCategorySelection
                                  onCategorySelect={(categoryId) => {
                                    setParsedExpenses((prev) => {
                                      const newExpenses = [...prev];
                                      newExpenses[index].categoryId = categoryId;
                                      return newExpenses;
                                    });
                                  }}/>}
                        </div>
                    )
                  })}
                </div>
                <div className="flex justify-between">
                  <Button onClick={() => {
                    setIsCategorySelectionVisible(!isCategorySelectionVisible);
                  }}>
                    {isCategorySelectionVisible ? "Hide" : "Show"} category selection
                  </Button>
                  <Button
                      isDisabled={isLoading || expensesWithCategory.length === 0}
                      className="flex items-center gap-2"
                      onClick={async () => {
                        console.log({ expensesWithCategory });
                        setIsLoading(true);
                        await setExpenses(expensesWithCategory);
                        setIsLoading(false);
                      }}>
                    <Spinner className={isLoading && "animate-spin"}/>
                    <span>Submit {expensesWithCategory.length}</span>
                  </Button>
                </div>
              </div>}
        </div>
      </div>
  );
};

export default withExpensesContext(PasteExpensesList);
