import { v4 as uuidv4 } from "uuid";
import { Categories, ThirdParties } from "../constants";

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
    this.id = id;
    this.name = name;
    this.isThirdParty = ThirdParties.includes(name);
    this.amount = amount;
    this.note = note;
    this.timestamp = timestamp;
    this.isOriginal = isOriginal;
    this.date = new Date(timestamp).toLocaleString('en-GB', {
      month: 'short',
      year: '2-digit',
      day: 'numeric',
    });
    this.amountCurrency = new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
    this.categoryId = categoryId;
    Categories.forEach((category) => {
      category.subCategories.forEach((sub) => {
        if (sub.id === this.categoryId) {
          this.subcategory = sub;
        }
      });
    });
    this.subcategoryLabel = this.subcategory
        ? `${this.subcategory.icon} ${this.subcategory.name}`
        : "";
  }
}

export default Expense;
