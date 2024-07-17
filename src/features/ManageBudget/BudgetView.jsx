import {CategoriesIds} from "../../constants";
import {InitBudget} from "../../constants/init-budget";
import {updateBudget} from "../../utils";
import {Trans} from "@lingui/macro";
import {useContext, useMemo, useState} from "react";
import {BudgetContext, ExpensesContext} from "../../context";
import {isEqual, toNumber} from "lodash";
import {Button} from "../../components";
import {CategoriesContext} from "../../context/CategoriesContext";
import {BudgetInfoCard, BudgetInfoType} from "./BudgetInfoCard";
import {SubcategoryBudget} from "./SubcategoryBudget";

const cleanAmountValue = (value) => {
    return toNumber(value.replace(/[^0-9.]/g, ''));
}

export const BudgetView = () => {
    const [cutOffInMonths, setCutOffInMonths] = useState(6);
    const [budget, setBudget] = useContext(BudgetContext);
    const {expensesPerMonthPerCategory} = useContext(ExpensesContext);
    const {categories} = useContext(CategoriesContext);

    const totalBudget = useMemo(() => {
        const totalBudget = {
            expenses: 0,
            income: 0,
        };

        budget.forEach(({amount, subcategory}) => {
            if (subcategory.category.isIncome) {
                totalBudget.income += amount;
            } else {
                totalBudget.expenses += amount;
            }
        });

        return totalBudget;
    }, [budget]);

    return (
        <section className="max-w-screen-xl m-auto relative">
            <h1 className="text-6xl my-8">
                <Trans>Budget</Trans>
            </h1>
            {/*<div className="absolute top-10 left-0">*/}
            {/*    <Button*/}
            {/*        type={Button.Types.PRIMARY}*/}
            {/*        isDisabled={isEqual(budget, InitBudget)}*/}
            {/*        onClick={async () => {*/}
            {/*            console.log('Save budget', budget);*/}
            {/*            try {*/}
            {/*                await updateBudget(budget);*/}
            {/*            } catch (error) {*/}
            {/*                console.error("Error saving budget", error);*/}
            {/*            }*/}
            {/*        }}>*/}
            {/*        <Trans>Save Budget</Trans>*/}
            {/*    </Button>*/}
            {/*</div>*/}
            <div className="flex flex-col gap-4">
                <div className="sticky top-0 p-4 bg-white border-b shadow-lg h-fit">
                    <div className="flex w-full justify-evenly gap-4 m-auto mb-2">
                        <BudgetInfoCard amount={totalBudget.income} type={BudgetInfoType.INCOME}/>
                        <BudgetInfoCard amount={totalBudget.expenses} type={BudgetInfoType.EXPENSES}/>
                        <BudgetInfoCard amount={totalBudget.income - totalBudget.expenses}
                                        type={BudgetInfoType.DIFFERENCE}/>
                    </div>
                    <div className="text-xl text-center">
                        <Trans>Cutoff by</Trans>
                        <input
                            type="number"
                            value={cutOffInMonths}
                            onChange={(event) => setCutOffInMonths(Number(event.target.value))}
                            className="text-center text-3xl font-mono w-16 px-2"/>
                        <Trans>months</Trans>
                    </div>
                </div>
                <div className="flex gap-4 w-full overflow-x-auto pb-8">
                    {categories.map(category => {
                        return (
                            <div key={category.id}
                                 className="flex flex-col items-start p-2 bg-gray-50/50 flex-wrap border rounded-xl">
                                <h2 className="text-xl bg-gray-200 mb-4">{category.icon} {category.name}</h2>
                                <div className="flex flex-wrap gap-4">
                                    {category.subcategories.map((subcategory) => {
                                        const subcategoryBudget = budget.find((item) => item.subcategoryId === subcategory.id);

                                        return (
                                            <SubcategoryBudget
                                                key={subcategory.id}
                                                subcategory={subcategory}
                                                budget={subcategoryBudget}
                                                cutoffInMonths={cutOffInMonths}
                                                expenses={expensesPerMonthPerCategory || {}}
                                                onChange={(id, value) => {
                                                    setBudget((prev) => {
                                                        return {
                                                            ...prev,
                                                            [category]: {
                                                                ...prev[category],
                                                                [id]: cleanAmountValue(value),
                                                            },
                                                        };
                                                    });
                                                }}/>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
};