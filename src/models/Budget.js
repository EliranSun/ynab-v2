import {InitBudget} from "../constants/init-budget";

class Budget {
    constructor(props) {
        this.budget = props.budget || InitBudget;
    }
}

export default Budget;