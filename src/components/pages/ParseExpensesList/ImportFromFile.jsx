import {Button, Title} from "../../atoms";
import {Trans} from "@lingui/macro";
import {Box} from "../../atoms/Box";
import {useContext, useCallback, useState} from "react";
import {CategoriesContext} from "../../../context/CategoriesContext";
import {ExpenseCategorySelection} from "../../organisms/ExpenseCategorySelection";
import {addExpenses} from "../../../utils/db";
import {computeNoSubcategoriesExpenses} from "../../../utils/expenses";
import classNames from "classnames";
import Expense from "../ExpenseView/Expense";
import {AddExpenseEntry} from "./AddExpenseEntry";
import {ImportExpensesByCategory} from "./ImportExpensesByCategory";

const getStoredPendingExpenses = () => {
    const imported = JSON.parse(localStorage.getItem("importedExpenses")) || [];
    return imported.filter(Boolean).filter(expense => Object.keys(expense).length > 0);
};

const getStoredMappedExpenses = () => {
    return JSON.parse(localStorage.getItem("mappedExpenses")) || [];

}

const storedPendingExpenses = getStoredPendingExpenses();
const storedMappedExpenses = getStoredMappedExpenses();

export const ImportFromFile = () => {
        const {categories} = useContext(CategoriesContext);
        const [importedExpenses, setImportedExpenses] = useState(storedPendingExpenses || []);
        const [notFoundSubcategories, setNotFoundSubcategories] = useState(computeNoSubcategoriesExpenses(categories, storedPendingExpenses));
        const [handledExpenses, setHandledExpenses] = useState(storedMappedExpenses || []);

        console.log({importedExpenses, handledExpenses});

        const onReaderLoad = useCallback(event => {
            const data = event.target.result;
            const expenses = JSON.parse(data);

            try {
                setImportedExpenses(expenses);
                setNotFoundSubcategories(computeNoSubcategoriesExpenses(categories, expenses));

                localStorage.setItem("importedExpenses", JSON.stringify(expenses));
            } catch (error) {
                console.error(error);
            }
        }, []);

        return (
            <section className={classNames({
                "max-w-screen-xl my-8 mx-auto": true,
            })}>
                <div>
                    <Title type={Title.Types.H1} className="mb-4">
                        <Trans>Import from file</Trans>
                    </Title>
                    <input
                        type="file"
                        name="upload-json"
                        id="upload-json"
                        onChange={(event) => {
                            event.preventDefault();
                            if (!event.target.files) {
                                return;
                            }

                            const reader = new FileReader();
                            reader.onload = onReaderLoad;
                            reader.readAsText(event.target.files[0]);
                        }}/>
                    <ImportExpensesByCategory
                        expensesByCategory={Object.values(notFoundSubcategories)}
                        expenses={importedExpenses}/>
                    {/*<div className="w-full overflow-y-auto flex flex-col gap-1 mt-8 mb-4 pb-60">*/}
                    {/*    {Object.values(notFoundSubcategories).map(subcategory => {*/}
                    {/*        return (*/}
                    {/*            <div key={subcategory.currentId}*/}
                    {/*                 className="w-full flex justify-start items-center px-4 bg-gray-100 rounded">*/}
                    {/*                {subcategory.name === "Unknown" ? (*/}
                    {/*                        <div className="w-1/2 flex flex-col my-4">*/}
                    {/*                            <p className="w-1/6 mb-4">*/}
                    {/*                                {subcategory.icon} {subcategory.name.slice(0, 12)}*/}
                    {/*                            </p>*/}
                    {/*                            <div className="w-full">*/}
                    {/*                                {subcategory.expenses.map(expense => {*/}
                    {/*                                    return (*/}
                    {/*                                        <AddExpenseEntry*/}
                    {/*                                            key={expense.id}*/}
                    {/*                                            isListView*/}
                    {/*                                            expense={expense}*/}
                    {/*                                            onRemove={() => {*/}
                    {/*                                                const currentStorage = JSON.parse(localStorage.getItem("importedExpenses"));*/}
                    {/*                                                const newStorage = currentStorage.filter(e => e.id !== expense.id);*/}
                    {/*                                                localStorage.setItem("importedExpenses", JSON.stringify(newStorage));*/}
                    {/*                                            }}*/}
                    {/*                                            onSuccess={() => {*/}
                    {/*                                                const currentStorage = JSON.parse(localStorage.getItem("importedExpenses"));*/}
                    {/*                                                const newStorage = currentStorage.filter(e => e.id !== expense.id);*/}
                    {/*                                                localStorage.setItem("importedExpenses", JSON.stringify(newStorage));*/}
                    {/*                                            }}/>*/}
                    {/*                                    )*/}
                    {/*                                })}*/}
                    {/*                            </div>*/}
                    {/*                        </div>*/}
                    {/*                    ) :*/}
                    {/*                    (<>*/}
                    {/*                        <p className="w-1/6">*/}
                    {/*                            {subcategory.icon} {subcategory.name.slice(0, 12)}*/}
                    {/*                        </p>*/}
                    {/*                        <p className="w-1/4">*/}
                    {/*                            {subcategory.expenses.length}{' '}*/}
                    {/*                            <Trans>Expenses in subcategory</Trans>*/}
                    {/*                        </p>*/}
                    {/*                        <div className="w-1/2">*/}
                    {/*                            <ExpenseCategorySelection*/}
                    {/*                                onCategorySelect={id => setNotFoundSubcategories(prevState => {*/}
                    {/*                                    return {*/}
                    {/*                                        ...prevState,*/}
                    {/*                                        [subcategory.currentId]: {*/}
                    {/*                                            ...prevState[subcategory.currentId],*/}
                    {/*                                            newId: id,*/}
                    {/*                                        }*/}
                    {/*                                    }*/}
                    {/*                                })}*/}
                    {/*                            />*/}
                    {/*                        </div>*/}
                    {/*                    </>)}*/}
                    {/*            </div>*/}
                    {/*        )*/}
                    {/*    })}*/}
                    {/*</div>*/}
                    {/*{handledExpenses.length === importedExpenses.length ? <Button*/}
                    {/*    isDisabled={importedExpenses.length === 0 && handledExpenses.length === 0}*/}
                    {/*    onClick={async () => {*/}
                    {/*        const expensesWithCategoryId = importedExpenses.map(expense => {*/}
                    {/*            const subcategory = notFoundSubcategories[expense.subcategoryId];*/}
                    {/*            return {*/}
                    {/*                ...expense,*/}
                    {/*                subcategoryId: subcategory?.newId || null,*/}
                    {/*            };*/}
                    {/*        });*/}

                    {/*        const missing = expensesWithCategoryId.find(expense => !expense.subcategoryId);*/}
                    {/*        if (missing) {*/}
                    {/*            console.info("Please map all subcategories before parsing", {missing});*/}
                    {/*        }*/}

                    {/*        localStorage.setItem("mappedExpenses", JSON.stringify(handledExpenses));*/}
                    {/*        setHandledExpenses(expensesWithCategoryId);*/}

                    {/*        try {*/}
                    {/*            await addExpenses(expensesWithCategoryId);*/}
                    {/*            alert("SUCCESS");*/}
                    {/*        } catch (error) {*/}
                    {/*            console.error(error);*/}
                    {/*            alert("ERROR");*/}
                    {/*        }*/}
                    {/*    }}>*/}
                    {/*    <Trans>Parse</Trans>{' '}*/}
                    {/*    {handledExpenses.length}{' '}*/}
                    {/*    <Trans>Transactions</Trans>{' '}*/}
                    {/*</Button> : null}*/}
                </div>
            </section>
        )
    }
;