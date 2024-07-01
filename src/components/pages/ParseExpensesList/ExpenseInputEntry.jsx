import {ExpenseInput} from "../../molecules/ExpenseInput";
import {SimilarExpenses} from "../../organisms/SimilarExpenses";
import {LeanCategorySelection} from "../../organisms/CategorySelection";
import {useMemo, useState, useRef} from "react";
import {format} from "date-fns";
import {Categories} from "../../../constants";
import {X} from "@phosphor-icons/react";
import classNames from "classnames";
import {useClickAway} from "react-use";

export const ExpenseInputEntry = ({
                                      id = null,
                                      expenses = [],
                                      activeId = null,
                                      isCategorySelectionVisible = true
                                  }) => {
    // eslint-disable-next-line no-undef
    const ref = useRef(null);
    const [expense, setExpense] = useState({
        id: null,
        name: "",
        note: "",
        amountCurrency: null,
        // eslint-disable-next-line no-undef
        date: format(new Date(), "yyyy-MM-dd"),
        categoryId: 11,
    });
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

    useClickAway(ref, () => {
        setIsCategoryMenuOpen(false);
    });

    return (
        <div
            className="snap-start"
            id={id}
            // onClick={() => setActiveId(expense.id)}
        >
            <ExpenseInput
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
            />
            {/*{isCategorySelectionVisible && activeId === expense.id &&*/}
            {isCategoryMenuOpen &&
                <div
                    className={classNames({
                        "absolute m-auto z-10 inset-0 backdrop-blur-lg md:static": true,
                        "flex flex-col items-center justify-center": true,
                    })}>
                    <X size={32} className="mb-4"/>
                    <div ref={ref} className="h-5/6 w-11/12 overflow-y-auto p-4 bg-gray-100 rounded-xl">
                        <SimilarExpenses
                            expense={expense}
                            existingExpenses={expenses}/>
                        <LeanCategorySelection
                            onCategorySelect={(id) => {
                                setSelectedSubcategoryId(id);
                                setIsCategoryMenuOpen(false);
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
