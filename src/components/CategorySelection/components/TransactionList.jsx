import Transaction from "./Transaction";
import { noop } from "lodash";

const TransactionList = ({
    transactions = [],
    onSelect = noop,
}) => {
    return (
        <div>
            {transactions.map((expense) => (
                <Transaction transaction={expense} onSelect={onSelect}/>
            ))}
        </div>
    );
};

export default TransactionList;
