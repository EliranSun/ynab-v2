import { useContext, useEffect, useState } from "react";
import { ExpensesContext } from "../../../context";
import { Categories } from "../../../constants";
import { Button, Title } from "../../atoms";
import { Checkbox } from "../../index";
import Subcategory from "./Subcategory";
import useCategoryExpensesData from "./useCategoryExpensesData";

const CategoryView = () => {
    const [categoryId, setCategoryId] = useState(Categories[0].id);
    const { expensesArray: expenses = [] } = useContext(ExpensesContext);
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
        setSelectedMonths([monthsAndYearsOptions[selectedMonthIndex].value]);
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
      setSelectedMonths(monthsAndYearsOptions.map(({ value }) => value));
    };
    
    const selectCurrentMonth = () => {
      setSelectedMonths([monthsAndYearsOptions[monthsAndYearsOptions.length - 1].value]);
      setSelectedMonthIndex(monthsAndYearsOptions.length - 1);
    };
    
    return (
      <div className="overflow-y-auto h-[90vh] pb-96">
        <Title>Categories, </Title>
        <select onChange={event => {
          setCategoryId(Number(event.target.value));
        }} className="text-5xl mb-8 border border-black">
          {Categories.map((category) => (
            <option
              key={category.id}
              value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="sticky top-0 right-20 w-full bg-white flex flex-col text-xs">
          <div className="flex gap-4 flex-wrap">
            {monthsAndYearsOptions.slice(-6).map(({ value, label }) => (
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
        </div>
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
    );
  }
;

export default CategoryView;
