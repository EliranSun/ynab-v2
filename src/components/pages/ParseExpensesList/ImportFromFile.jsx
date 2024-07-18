import {Button, Title} from "../../atoms";
import {Trans} from "@lingui/macro";
import {Box} from "../../atoms/Box";
import {useContext, useCallback, useState} from "react";
import {CategoriesContext} from "../../../context/CategoriesContext";
import {ExpenseCategorySelection} from "../../organisms/ExpenseCategorySelection";
import {addExpenses} from "../../../utils/db";
import {computeNoSubcategoriesExpenses} from "../../../utils/expenses";

const getStoredPendingExpenses = () => {
    return JSON.parse(localStorage.getItem("importedExpenses")) || [];
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
    // const [notFoundSubcategories, setNotFoundSubcategories] = useState(storedPendingExpenses);
    const [handledExpenses, setHandledExpenses] = useState(storedMappedExpenses || []);

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
        <Box>
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
                        if (event.target.files) {
                            const reader = new FileReader();
                            reader.onload = onReaderLoad;
                            reader.readAsText(event.target.files[0]);
                        }
                    }}/>
                <div className="w-full max-h-96 overflow-y-auto flex flex-col mt-8 mb-4">
                    {Object.values(notFoundSubcategories).map(subcategory => {
                        return (
                            <div key={subcategory.currentId} className="w-full flex justify-start items-center px-4">
                                <p className="w-1/2">
                                    {subcategory.icon}
                                    {subcategory.name}
                                </p>
                                <p>
                                    {subcategory.expenses.length}
                                    <Trans>Expenses in subcategory</Trans>
                                </p>
                                <div className="w-1/2">
                                    <ExpenseCategorySelection
                                        onCategorySelect={id => setNotFoundSubcategories(prevState => {
                                            return {
                                                ...prevState,
                                                [subcategory.currentId]: {
                                                    ...prevState[subcategory.currentId],
                                                    newId: id,
                                                }
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
                {handledExpenses.length === importedExpenses.length ? <Button
                    isDisabled={importedExpenses.length === 0 && handledExpenses.length === 0}
                    onClick={async () => {
                        const expensesWithCategoryId = importedExpenses.map(expense => {
                            const subcategory = notFoundSubcategories[expense.subcategoryId];
                            return {
                                ...expense,
                                subcategoryId: subcategory?.newId || null,
                            };
                        });

                        const missing = expensesWithCategoryId.find(expense => !expense.subcategoryId);
                        if (missing) {
                            console.info("Please map all subcategories before parsing", {missing});
                        }

                        console.log({expensesWithCategoryId});
                        localStorage.setItem("mappedExpenses", JSON.stringify(handledExpenses));
                        setHandledExpenses(expensesWithCategoryId);

                        try {
                            await addExpenses(expensesWithCategoryId);
                            alert("SUCCESS");
                        } catch (error) {
                            console.error(error);
                            alert("ERROR");
                        }
                    }}>
                    <Trans>Parse</Trans>{' '}
                    {handledExpenses.length}{' '}
                    <Trans>Transactions</Trans>{' '}
                </Button> : null}
            </div>
        </Box>
    )
};