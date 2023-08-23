import { noop } from "lodash";
import { Categories } from "../../../constants";
import { useState } from "react";

export const CategoriesDropdownMenu = ({ defaultValueId = null, onCategoryChange = noop }) => {
  const [value, setValue] = useState(String(defaultValueId));
  
  return (
    <select
      className="border border-black"
      value={value}
      onChange={event => {
        onCategoryChange(event.target.value);
        setValue(event.target.value);
      }}>
      <option value={null}>Select Category</option>
      {Categories.map((category) => (
        category.subCategories.map((subCategory) => {
          return (
            <option
              key={subCategory.id}
              value={subCategory.id}>
              {category.name} > {subCategory.name}
            </option>
          );
        })
      ))}
    </select>
  );
};