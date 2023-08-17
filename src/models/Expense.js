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
