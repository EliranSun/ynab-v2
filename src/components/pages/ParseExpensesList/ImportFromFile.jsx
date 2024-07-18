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
    const [notFoundSubcategories, setNotFoundSubcategories] = useState(computeNoSubcategoriesExpenses(categories, storedPendingExpenses));
    const [pendingExpenses, setPendingExpenses] = useState(storedPendingExpenses || []);
    const [mappedExpenses, setMappedExpenses] = useState(storedMappedExpenses || []);
    const onReaderLoad = useCallback(event => {
        const data = event.target.result;
        const expenses = JSON.parse(data);

        try {
            setNotFoundSubcategories(computeNoSubcategoriesExpenses(categories, expenses));
            setPendingExpenses(expenses);

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
                <div className="max-h-96 overflow-y-auto flex flex-wrap mt-8 mb-4">
                    {Object.values(notFoundSubcategories).map(subcategory => {
                        return (
                            <div key={subcategory.currentId} className="flex gap-1 items-center px-4">
                                <p className="w-28">
                                    {subcategory.icon}
                                    {subcategory.name}
                                </p>
                                <div className="w-40">
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
                <Button
                    isDisabled={pendingExpenses.length === 0 && mappedExpenses.length === 0}
                    onClick={async () => {
                        if (mappedExpenses.length > 0) {
                            await addExpenses(mappedExpenses);
                            return;
                        }

                        const newMappedExpenses = pendingExpenses.map(expense => {
                            const subcategory = notFoundSubcategories[expense.subcategoryId];
                            return {
                                ...expense,
                                subcategoryId: subcategory?.newId || null,
                            };
                        });

                        const missing = newMappedExpenses.find(expense => !expense.subcategoryId);
                        if (missing) {
                            console.info("Please map all subcategories before parsing", {missing});
                        }

                        console.log({newMappedExpenses});
                        localStorage.setItem("mappedExpenses", JSON.stringify(mappedExpenses));
                        setMappedExpenses(newMappedExpenses);
                    }}>
                    <Trans>Parse</Trans>{' '}
                    {mappedExpenses.length || pendingExpenses.length}{' '}
                    <Trans>Transactions</Trans>{' '}
                    {mappedExpenses.length > 0 ? <Trans>saved</Trans> : null}
                </Button>
            </div>
        </Box>
    )
};