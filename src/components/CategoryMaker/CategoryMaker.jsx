import { useState, useContext } from "react";
import { CategoryContext } from "../../contexts";

// TBD, unsued
const CreateCategory = () => {
  return (
    <div>
      <input type="text" placeholder="Category name" />
      <input type="text" placeholder="Subcategory name" />
      <button
        onClick={() => {
          // setCategories(tempCategories.concat([{}]));
        }}>
        Add Subcategory
      </button>
      <button>Save Category</button>
    </div>
  );
};

const CategoryMaker = () => {
  const { categories, setCategories } = useContext(CategoryContext);
  const [tempCategories, setTempCategories] = useState(categories);

  return (
    <div>
      <h1>Category Maker</h1>
      {tempCategories.map((category) => (
        <CreateCategory {...category} />
      ))}
      <button
        onClick={() => {
          setCategories(tempCategories.concat([{}]));
        }}>
        Add Category
      </button>
    </div>
  );
};

export default CategoryMaker;
