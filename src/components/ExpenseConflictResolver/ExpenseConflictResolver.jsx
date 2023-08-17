import { useMemo } from "react";

const ExpenseConflictResolver = ({ prevExpenses = [], newExpenses = [] }) => {
	console.debug({
		prevExpenses,
		newExpenses,
	});
	const duplicates = useMemo(() => {
		return newExpenses.filter((newExpense) => {
			return prevExpenses.find((prevExpense) => {
				return (
					prevExpense.name === newExpense.name &&
					prevExpense.timestamp === newExpense.timestamp &&
					newExpense.amount === prevExpense.amount
				);
			});
		});
	}, [prevExpenses, newExpenses]);

	return (
		<div>
			<h1>Expense Conflict Resolver</h1>
			<p>
				The following expenses were detected having the same name, amount and
				date.
			</p>
			<p>
				For each, mark if is indeed duplicate or need to be kept. If everything
				is OK, press the destroy duplicates button
			</p>
			<button color="tomato">Destroy Duplicates</button>
			{duplicates.map((duplicate) => (
				<div>
					<p>{duplicate.name}</p>
					<p>{duplicate.amount}</p>
					<p>{duplicate.timestamp}</p>
				</div>
			))}
		</div>
	);
};

export default ExpenseConflictResolver;
