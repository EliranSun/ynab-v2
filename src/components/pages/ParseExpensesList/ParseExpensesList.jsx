import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Expense } from "../../../models";
import { Button, Title } from "../../atoms";
import { withExpensesContext } from "../../../HOC/withExpensesContext";
import { SheetUpload } from "../../organisms/SheetUpload";
import { ExpensesList } from "./ExpensesList";
import { isExistingExpense, parseNewExpenses } from "../../../utils/expenses";
import { ClipboardText } from "@phosphor-icons/react";

const isMobile = window.innerWidth < 768;

export const ParseExpensesList = ({
  text = "", expenses, setExpenses = () => {
  }
}) => {
  const textAreaRef = useRef(null);
  const [message, setMessage] = useState("");
  const [value, setValue] = useState(text);
  const [isParseButtonDisabled, setIsParseButtonDisabled] = useState(false);
  const [parsedExpenses, setParsedExpenses] = useState([]);
  const [isStatusAnimated, setIsStatusAnimated] = useState(false);


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
      setParsedExpenses(data.filter(item => {
        return !isExistingExpense(item, expenses);
      }).map(item => new Expense(item)));
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
    <section className="h-screen overflow-y-auto p-4">
      <Title type={Title.Types.H1} className="flex items-center gap-2 mb-4">
        <ClipboardText size={50}/> Parse
      </Title>

      <div className="max-w-6xl m-auto">
        {parsedExpenses.length > 0 &&
          <Title type={isMobile ? Title.Types.H3 : Title.Types.H2}>
            Existing expenses: {expenses.length} • New expenses: ${parsedExpenses.length}
          </Title>}
        <ExpensesList
          expenses={parsedExpenses}
          existingExpenses={expenses}
          setExpenses={setParsedExpenses}
          submitExpenses={setExpenses}/>
      </div>
      <div className="flex items-start gap-4 max-w-7xl flex-col">
        <div className="flex flex-col md:w-1/3 h-full">
          <Title type={Title.Types.H2} className="mb-4">Paste</Title>
          <textarea
            className="border border-dashed border-black p-4 outline-none w-full h-full"
            placeholder="Paste expenses here"
            rows={isMobile ? 5 : 15}
            ref={textAreaRef}
            value={value}
            onChange={event => {
              setIsParseButtonDisabled(!event.target.value);
              setValue(event.target.value);
            }}/>
        </div>
        <div className="mb-4">
          <Title type={Title.Types.H2} className="mb-4">Upload</Title>
          <SheetUpload onSheetParse={data => console.log(data)}/>
        </div>
        <div className="">
          <Title type={Title.Types.H2} className="mb-4">Manual</Title>
          WIP
        </div>
        <Button
          size={Button.Sizes.FULL}
          isDisabled={isParseButtonDisabled}
          onClick={setNewExpenses}
          className={classNames("my-4 w-72 mx-auto text-center", {
            "animate-pulse duration-500": isStatusAnimated,
          })}>
          {isStatusAnimated ? message : "Parse expenses"}
        </Button>
      </div>
    </section>
  );
};

export default withExpensesContext(ParseExpensesList);
