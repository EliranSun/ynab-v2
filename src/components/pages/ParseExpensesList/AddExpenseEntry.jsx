import {ExpenseInputs} from "../../molecules/ExpenseInputs";
import {SimilarExpenses} from "../../organisms/SimilarExpenses";
import {LeanCategorySelection} from "../../organisms/CategorySelection";
import {useMemo, useState, useRef} from "react";
import {format} from "date-fns";
import {Categories} from "../../../constants";
import {X} from "@phosphor-icons/react";
import classNames from "classnames";
import {useClickAway} from "react-use";
import {Trans} from "@lingui/macro";
import {addExpenses} from "../../../utils";
import {Expense} from "../../../models";
import {InputTypes} from "./constants";
import {v4 as uuid} from 'uuid';

export const AddExpenseEntry = ({
                                    id = null,
                                    expenses = [],
                                    activeId = null,
                                    isCategorySelectionVisible = true
                                }) => {
    // eslint-disable-next-line no-undef
    const ref = useRef(null);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(11);
    const subcategory = useMemo(() => {
        let subcategoryFoo;
        Categories.forEach((category) => {
            category.subCategories.forEach((sub) => {
                if (sub.id === selectedSubcategoryId) {
                    subcategoryFoo = sub;
                }
            });
        });

        return subcategoryFoo;
    }, [selectedSubcategoryId]);

    const [expense, setExpense] = useState({
        id: uuid(),
        [InputTypes.NAME]: "",
        [InputTypes.NOTE]: "",
        [InputTypes.AMOUNT]: null,
        // eslint-disable-next-line no-undef
        [InputTypes.DATE]: format(new Date(), "yyyy-MM-dd"),
        subcategoryId: 11,
    });

    useClickAway(ref, () => {
        setIsCategoryMenuOpen(false);
    });

    return (
        <div
            className="snap-start w-full flex flex-col gap-4"
            id={id}
            // onClick={() => setActiveId(expense.id)}
        >
            <ExpenseInputs
                // index={index}
                name={expense.name}
                note={expense.note}
                amount={expense.amountCurrency}
                date={expense.date}
                isVisible={isCategorySelectionVisible}
                onCategoryMenuClick={() => setIsCategoryMenuOpen((prev) => !prev)}
                isCategoryMenuOpen={isCategoryMenuOpen}
                // setExpenses={setExpenses}
                subcategory={subcategory}
                onInputChange={(type, value) => {
                    setExpense((prev) => {
                        const newExpense = {...prev};
                        newExpense[type] = value;
                        return newExpense;
                    });
                }}
            />

            <button
                className="p-4 bg-blue-500 text-white cursor-pointer rounded-xl shadow-xl"
                onClick={async () => {
                    if (
                        !expense.name ||
                        !expense.amount ||
                        !expense.subcategoryId
                    ) {
                        alert(JSON.stringify(expense));
                        return;
                    }

                    const modeledExpense = new Expense(expense);
                    await addExpenses([modeledExpense]);
                    console.info("Success!", modeledExpense);
                }}>
                <Trans>Add Expense</Trans>
            </button>

            {/*{isCategorySelectionVisible && activeId === expense.id &&*/}
            {isCategoryMenuOpen &&
                <div
                    className={classNames({
                        "backdrop-blur-md": true,
                        "backdrop-brightness-50": false,
                        "absolute m-auto z-30 inset-0": true,
                        "flex flex-col items-center justify-center": true,
                    })}>
                    <div className="mb-4 rounded-full bg-black p-8">
                        <X size={32} color="white"/>
                    </div>
                    <div ref={ref} className={classNames({
                        "max-w-screen-lg h-5/6 w-11/12 overflow-y-auto p-4 bg-gray-100 rounded-xl": true,
                        "border-2 border-gray-500": true,
                    })}>
                        <SimilarExpenses
                            expense={expense}
                            existingExpenses={expenses}/>
                        <LeanCategorySelection
                            onCategorySelect={(id) => {
                                setIsCategoryMenuOpen(false);
                                setSelectedSubcategoryId(id);
                                setExpense((prev) => {
                                    const newExpense = {...prev};
                                    newExpense.subcategoryId = id;
                                    return newExpense;
                                });

                                // setExpenses((prev) => {
                                //     const newExpenses = [...prev];
                                //     newExpenses[index].categoryId = categoryId;
                                //     return newExpenses;
                                // });
                            }}/>
                    </div>
                </div>}
        </div>
    )
};
