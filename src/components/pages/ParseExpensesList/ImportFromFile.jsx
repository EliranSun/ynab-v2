import {Title} from "../../atoms";
import {Trans} from "@lingui/macro";
import {useContext, useCallback, useState} from "react";
import {CategoriesContext} from "../../../context/CategoriesContext";
import {computeNoSubcategoriesExpenses} from "../../../utils/expenses";
import classNames from "classnames";
import {ImportExpensesByCategory} from "./ImportExpensesByCategory";

const getStoredPendingExpenses = () => {
    const imported = JSON.parse(localStorage.getItem("importedExpenses")) || [];
    return imported.filter(Boolean).filter(expense => Object.keys(expense).length > 0);
};

const storedPendingExpenses = getStoredPendingExpenses();

export const ImportFromFile = () => {
        const {categories} = useContext(CategoriesContext);
        const [importedExpenses, setImportedExpenses] = useState(storedPendingExpenses || []);
        const [notFoundSubcategories, setNotFoundSubcategories] = useState(computeNoSubcategoriesExpenses(categories, storedPendingExpenses));

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
                        onRemoveExpense={importedExpenseId => {
                            const newExpenses = importedExpenses.filter(expense => expense.id !== importedExpenseId);
                            setImportedExpenses(newExpenses);
                            setNotFoundSubcategories(computeNoSubcategoriesExpenses(categories, newExpenses));
                            localStorage.setItem("importedExpenses", JSON.stringify(newExpenses));
                        }}
                        onRemove={importedSubcategoryId => {
                            const newExpenses = importedExpenses.filter(expense => expense.subcategoryId !== importedSubcategoryId);
                            setImportedExpenses(newExpenses);
                            setNotFoundSubcategories(computeNoSubcategoriesExpenses(categories, newExpenses));
                            localStorage.setItem("importedExpenses", JSON.stringify(newExpenses));
                        }}
                    />
                </div>
            </section>
        )
    }
;