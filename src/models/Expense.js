import { v4 as uuidv4 } from "uuid";
import { ThirdParties } from "../constants";

class Expense {
    constructor({
        name = "",
        note = "",
        amount = 0,
        timestamp,
        categoryId = null,
        transactionsCount = 0,
    }) {
        this.id = uuidv4();
        this.name = name;
        this.isThirdParty = ThirdParties.includes(name);
        this.amount = amount;
        this.note = note;
        this.timestamp = timestamp;
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
        this.transactionsCount = transactionsCount;
    }

    setCategoryId(id) {
        this.categoryId = id;
    }

    updateTransactionsCount() {
        this.transactionsCount++;
    }
}

export default Expense;
