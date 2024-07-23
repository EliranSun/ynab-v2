import {useContext, useEffect, useState} from "react";
import {ExpensesContext} from "../../../context";
import {Categories} from "../../../constants";
import {Button, Title} from "../../atoms";
import {Checkbox} from "../../index";
import Subcategory from "./Subcategory";
import useCategoryExpensesData from "./useCategoryExpensesData";
import {Trans} from "@lingui/macro";
import {X} from "@phosphor-icons/react";
import classNames from "classnames";

const CategoryButton = ({children, isSelected, onClick, name = "", isEditable = false}) => {
    const [value, setValue] = useState(name);

    return (
        <div className="flex gap-2 items-center">
            {isEditable ?
                <span className="bg-white rounded-full">
                    <X color="red" size={28}/>
                </span> : null}
            <button
                onClick={onClick}
                className={classNames({
                    "p-4 flex items-center rounded-full h-10 text-lg w-fit": true,
                    "bg-black text-white": isSelected,
                    "hover:bg-black hover:text-white": true,
                    "border-2 border-black text-black": !isSelected,
                })}>
                {isEditable ?
                    <input
                        type="text"
                        className="bg-transparent border-none focus:outline-none w-28"
                        onChange={(e) => setValue(e.target.value)}
                        value={value}/> : children}
            </button>
        </div>
    );
}

const CategoryView = () => {
        const [categoryId, setCategoryId] = useState(Categories[0].id);
        const {expenses = []} = useContext(ExpensesContext);
        const [selectedMonths, setSelectedMonths] = useState([]);
        const {
            category,
            expensesInCategoryThisMonth,
            totalAmountInCategory,
            monthsAndYearsOptions,
        } = useCategoryExpensesData({
            categoryId,
            selectedMonths,
            expenses,
        });

        const [selectedMonthIndex, setSelectedMonthIndex] = useState(monthsAndYearsOptions.length - 1);

        useEffect(() => {
            if (selectedMonthIndex !== null && monthsAndYearsOptions.length > 0) {
                setSelectedMonths([monthsAndYearsOptions[selectedMonthIndex]?.value]);
            }
        }, [monthsAndYearsOptions, selectedMonthIndex]);

        const nextMonth = () => {
            if (selectedMonthIndex >= monthsAndYearsOptions.length - 1) {
                setSelectedMonthIndex(0);
                return;
            }

            setSelectedMonthIndex(selectedMonthIndex + 1);
        }

        const previousMonth = () => {
            if (selectedMonthIndex <= 0) {
                setSelectedMonthIndex(monthsAndYearsOptions.length - 1);
                return;
            }

            setSelectedMonthIndex(selectedMonthIndex - 1);
        };

        const selectAllMonths = () => {
            setSelectedMonths(monthsAndYearsOptions.map(({value}) => value));
        };

        const selectCurrentMonth = () => {
            setSelectedMonths([monthsAndYearsOptions[monthsAndYearsOptions.length - 1].value]);
            setSelectedMonthIndex(monthsAndYearsOptions.length - 1);
        };

        return (
            <div className="overflow-y-auto h-[90vh] pb-96 max-w-screen-xl m-auto">
                <div className="flex gap-4">
                    <div className="w-1/3">
                        <Title><Trans>Categories</Trans></Title>
                        <div className="flex flex-wrap gap-2 h-fit w-full">
                            {Categories.map((category) => (
                                <CategoryButton
                                    isSelected={categoryId === Number(category.id)}
                                    onClick={() => setCategoryId(Number(category.id))}
                                    name={category.name}
                                    key={category.id}
                                    value={category.id}>
                                    {category.label}
                                </CategoryButton>
                            ))}
                            <CategoryButton>
                                <div className="text-4xl size-10">+</div>
                            </CategoryButton>
                        </div>
                        <Title><Trans>Subcategories</Trans></Title>
                        <div className="flex flex-wrap gap-2 h-fit">
                            {Categories.map((category) => {
                                return category.subCategories.map((subcategory) => {
                                    return (
                                        <CategoryButton
                                            isEditable
                                            // isSelected={categoryId === Number(subcategory.id)}
                                            // onClick={() => setCategoryId(Number(subcategory.id))}
                                            name={subcategory.name}
                                            key={subcategory.id}
                                            value={subcategory.id}>
                                            {subcategory.label}
                                        </CategoryButton>
                                    );
                                });
                            })}
                            <CategoryButton isAdd>
                                <div className="text-4xl size-10">+</div>
                            </CategoryButton>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white flex flex-col text-xs">
                        <div className="flex gap-4 flex-wrap">
                            {monthsAndYearsOptions.slice(-6).map(({value, label}) => (
                                <Checkbox
                                    key={value}
                                    label={label}
                                    isChecked={selectedMonths.includes(value)}
                                    onChange={() => {
                                        if (selectedMonths.includes(value)) {
                                            setSelectedMonths(selectedMonths.filter((month) => month !== value));
                                        } else {
                                            setSelectedMonths([...selectedMonths, value]);
                                        }
                                    }}/>
                            ))}
                        </div>
                        <div className="flex gap-4 p-4 pl-0">
                            <Button onClick={previousMonth}>
                                Previous
                            </Button>
                            <Button onClick={nextMonth}>
                                Next
                            </Button>
                            <Button onClick={selectAllMonths}>
                                Select All
                            </Button>
                            <Button onClick={selectCurrentMonth}>
                                Current Month
                            </Button>
                        </div>
                        <div className="h-full overflow-y-auto">
                            <Title type="h3">Total amount for {category.name} in {selectedMonths.length} months</Title>
                            <Title>{totalAmountInCategory}</Title>
                            {category.subCategories.map((subcategory) => (
                                <Subcategory
                                    key={subcategory.id}
                                    subcategory={subcategory}
                                    expenses={expenses}
                                    expensesInMonths={expensesInCategoryThisMonth}
                                    selectedMonths={selectedMonths}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
;

export default CategoryView;
