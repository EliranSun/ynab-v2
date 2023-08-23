import TransactionName from "./TransactionName";
import TransactionAmount from "./TransactionAmount";
import TransactionDate from "./TransactionDate";

const TransactionChildrenView = ({ transaction, isOpen }) => {
	return (
		isOpen &&
		transaction?.transactions?.map((transaction) => (
			<>
				<hr />
				<table>
					<TransactionName name={transaction.name} count={1} /> <br />
					<TransactionAmount amount={transaction.amount} />
					<br />
					<TransactionDate timestamp={transaction.timestamp} /> <br />
				</table>
			</>
		))
	);
};

export default TransactionChildrenView;
