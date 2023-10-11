import { v4 as uuidv4 } from "uuid";
import { Categories, ThirdParties } from "../constants";
import { IncomeSubcategoryIds } from "../constants/income";

class Expense {
  constructor({
    id = uuidv4(),
    name = "",
    note = "",
    amount = 0,
    timestamp,
    categoryId = null,
    isOriginal = false,
  }) {
    const locale = navigator.language;
    this.id = id;
    this.name = name;
    this.isThirdParty = ThirdParties.includes(name);
    this.amount = amount;
    this.note = note;
    this.timestamp = timestamp;
    this.isOriginal = isOriginal;
    this.date = new Date(timestamp).toLocaleString(locale, {
      month: "long",
      year: '2-digit',
      day: 'numeric',
    });
    this.amountCurrency = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);


    // TODO: refactor to subcategoryId
    this.categoryId = categoryId;
    this.subcategoryId = categoryId;
    this.mainCategoryId = null;
    this.isIncome = IncomeSubcategoryIds.includes(Number(this.subcategoryId));

    Categories.forEach((category) => {
      category.subCategories.forEach((sub) => {
        if (sub.id === this.categoryId) {
          this.subcategory = sub;
          this.mainCategoryId = category.id;
        }
      });
    });

    this.subcategoryLabel = this.subcategory
      ? `${this.subcategory.icon} ${this.subcategory.name}`
      : "";
  }
}

export default Expense;
