import { formatCurrency } from "../../utils";

const realityVsExpectationMessage = (diff) => {
  switch (true) {
    case diff < 100:
      return `my budget is spot on!`;
    
    case diff < 500:
      return `perhaps a 1 off, but I should keep an eye on it`;
    
    case diff < 1000:
      return `my budget is nowhere NEAR reality.`;
    
    case diff > 1000:
      return `I'm in trouble.`;
    
    case diff < 0:
    default:
      return 'while good, I should keep an eye on it.';
  }
}

export const BalanceDiffMessage = ({ incomeBudget, expensesBudget, totalIncomeThisMonth, totalExpensesThisMonth }) => {
  const diff = Math.round((incomeBudget - expensesBudget) - (totalIncomeThisMonth - totalExpensesThisMonth));
  const diffCurrency = formatCurrency(diff);
  const diffMessage = realityVsExpectationMessage(diff);
  const diffAmountSpan = <span className="text-3xl font-black">{diffCurrency}</span>;
  
  if (diff > 0) {
    return (
      <p className="w-1/3 font-serif text-xl italic p-4 my-4">
        I've spent {diffAmountSpan} more than I planned...
        {diffMessage}
      </p>
    )
  }
  
  return (
    <p className="w-1/3 font-serif text-xl italic p-4 my-4">
      With a spare of {diffAmountSpan},
      {diffMessage}
    </p>
  )
}