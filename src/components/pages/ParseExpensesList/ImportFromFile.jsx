import {Title} from "../../atoms";
import {Trans} from "@lingui/macro";
import {Box} from "../../atoms/Box";
import {useContext, useState} from "react";
import {CategoriesContext} from "../../../context/CategoriesContext";

export const ImportFromFile = () => {
    const {categories} = useContext(CategoriesContext);
    const [notFoundSubcategories, setNotFoundSubcategories] = useState({});

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
                            reader.onload = async (e) => {
                                const data = e.target.result;
                                const expenses = JSON.parse(data);


                                try {
                                    console.log("Adding expenses", expenses);
                                    const subcategories = categories.map(category => category.subcategories).flat();
                                    console.log({subcategories});

                                    expenses.forEach(expense => {
                                        if (!subcategories.find(subcategory => subcategory.id === expense.subcategoryId)) {
                                            setNotFoundSubcategories(prevState => ({
                                                ...prevState,
                                                [expense.subcategoryId]: expense.subcategory,
                                            }));
                                        }
                                    });

                                    // await addExpenses(expenses);
                                    console.info("Expenses added successfully");
                                } catch (error) {
                                    console.error(error);
                                }
                            };
                            reader.readAsText(event.target.files[0]);
                        }
                    }}/>
                <div>
                    {Object.keys(notFoundSubcategories).length > 0 ? Object.values(notFoundSubcategories).map(subcategory => {
                        return (
                            <div key={subcategory.id}>
                                <p>{subcategory.name}</p>
                            </div>
                        )
                    }) : null}
                </div>
            </div>
        </Box>
    )
};