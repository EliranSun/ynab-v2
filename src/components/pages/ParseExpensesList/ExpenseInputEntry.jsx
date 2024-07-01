import {ParseExpenseHeader} from "../../molecules/ParseExpenseHeader";
import {SimilarExpenses} from "../../organisms/SimilarExpenses";
import {LeanCategorySelection} from "../../organisms/CategorySelection";
import {useMemo, useState} from "react";
import {format} from "date-fns";
import {Categories} from "../../../constants";

export const ExpenseInputEntry = ({
                                      id = null,
                                      expenses = [],
                                      activeId = null,
                                      isCategorySelectionVisible = true
}) => {
    const [expense, setExpense] = useState({
        id: null,
        name: "",
        note: "",
        amountCurrency: 0,
        // eslint-disable-next-line no-undef
        date: format(new Date(), "yyyy-MM-dd"),
        categoryId: 11,
    });
    const subcategory = useMemo(() => {
        let subcategoryFoo;
        Categories.forEach((category) => {
            category.subCategories.forEach((sub) => {
                if (sub.id === expense.categoryId) {
                    subcategoryFoo = sub;
                }
            });
        });

        return subcategoryFoo;
    }, [expense.categoryId]);

    return (
        <div
            className="snap-start"
            id={id}
            // onClick={() => setActiveId(expense.id)}
        >
            <ParseExpenseHeader
                // index={index}
                name={expense.name}
                note={expense.note}
                amount={expense.amountCurrency}
                date={expense.date}
                isVisible={isCategorySelectionVisible}
                // setExpenses={setExpenses}
                subcategory={subcategory}
            />
            {isCategorySelectionVisible && activeId === expense.id &&
                <>
                    <SimilarExpenses
                        expense={expense}
                        existingExpenses={expenses}/>
                    <LeanCategorySelection
                        onCategorySelect={(categoryId) => {
                            // setExpenses((prev) => {
                            //     const newExpenses = [...prev];
                            //     newExpenses[index].categoryId = categoryId;
                            //     return newExpenses;
                            // });
                        }}/>
                </>}
        </div>
    )
};
