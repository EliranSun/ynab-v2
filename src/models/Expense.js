import {v4 as uuidv4} from "uuid";
import {Categories, ThirdParties} from "../constants";
import {IncomeSubcategoryIds} from "../constants/income";

class Expense {
    constructor({
                    id = uuidv4(),
                    name = "",
                    note = "",
                    amount = 0,
                    timestamp,
                    date,
                    categoryId = null,
                    subcategoryId = null,
                    subcategory_id = null,
                    isOriginal = false,
                    recurring = 0,
                }) {
        const locale = navigator.language;
        this.id = id;
        this.name = name;
        this.isThirdParty = ThirdParties.includes(name);
        this.amount = amount;
        this.note = note;
        this.timestamp = timestamp || new Date(date).getTime();
        this.isOriginal = isOriginal;
        this.recurring = recurring;
        this.date = new Date(timestamp || date).toLocaleString(locale, {
            month: "long",
            year: '2-digit',
            day: 'numeric',
        });
        this.amountCurrency = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'ILS'
        }).format(amount);


        // TODO: refactor to subcategoryId
        this.categoryId = categoryId || Categories.find((category) => {
            return category.subCategories.find((sub) => sub.id === subcategoryId || sub.id === subcategory_id);
        })?.id || null;
        this.mainCategoryId = null;
        this.subcategoryId = subcategoryId || subcategory_id || null;
        this.isIncome = IncomeSubcategoryIds.includes(Number(this.subcategoryId));

        Categories.forEach((category) => {
            category.subCategories.forEach((sub) => {
                if (sub.id === subcategoryId) {
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
