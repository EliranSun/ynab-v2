import { v4 as uuidv4 } from "uuid";

class Category {
  constructor({ name, subcategoriesIds = [], expensesIdsInCategory = [] }) {
    this.id = uuidv4();
    this.name = name;
    this.subcategoriesIds = subcategoriesIds;
    this.expensesIdsInCategory = expensesIdsInCategory;
  }

  addExpenseId(id) {
    this.expensesIdsInCategory.push(id);
  }

  addSubcategoryId(id) {
    this.subcategoriesIds.push(id);
  }

  removeExpenseId(id) {
    this.expensesIdsInCategory = this.expensesIdsInCategory.filter(
      (expenseId) => expenseId !== id
    );
  }

  removeSubcategoryId(id) {
    this.subcategoriesIds = this.subcategoriesIds.filter(
      (subcategoryId) => subcategoryId !== id
    );
  }
}

export default Category;
