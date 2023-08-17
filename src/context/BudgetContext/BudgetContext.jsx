import { useState, useEffect, createContext } from "react";
import { getBudget, addBudget } from "../../utils";

export const BudgetContext = createContext({
	budget: [],
	setBudget: () => {},
});

export const BudgetContextProvider = ({ children }) => {
	const [budget, setBudget] = useState({});

	useEffect(() => {
		(async () => {
			const budget = await getBudget();
			setBudget(budget);
		})();
	}, []);

	return (
		<BudgetContext.Provider
			value={{
				budget,
				setBudget: (value, categoryId, timestamp) => {
					console.debug("setBudget", value, categoryId, timestamp);
					// TODO: util or date controller
					const dateKey = new Date(timestamp).toLocaleString("he-IL", {
						month: "numeric",
						year: "numeric",
					});

					// TODO: model
					addBudget({
						dateKey,
						categoryId,
						amount: value,
					});
					setBudget({
						...budget,
						[dateKey]: {
							...budget[dateKey],
							[categoryId]: value,
						},
					});
				},
			}}
		>
			{children}
		</BudgetContext.Provider>
	);
};
