import { formatCurrency } from "../../../utils";
import { MaskHappy, MaskSad, Smiley, SmileySad } from "@phosphor-icons/react";
import { BUTTON_SIZE } from "../../../constants";

const realityVsExpectationMessage = (diff) => {
  switch (true) {
    case diff < -100:
    default:
      return 'which is good, but I should understand why my budget is off.';
    
    case diff < 0:
      return `my budget is spot on!`;
    
    case diff < 200:
      return `but it's negligible!`;
    
    case diff < 500:
      return `perhaps a one-off, but I should understand why if this keeps going.`;
    
    case diff < 1000:
      return `my budget is nowhere NEAR reality.`;
    
    case diff > 10000:
      return `Jesus fucking christ man.`;
    
    case diff > 5000:
      return `I'm in BIG trouble.`;
    
    case diff > 1000:
      return `I'm in trouble.`;
  }
}

const NegativeAmount = ({ children }) => {
  return <span className="bg-red-500 text-white p-2 font-black text-3xl">{children}</span>
};

const PositiveAmount = ({ children }) => {
  return <span className="bg-green-500 text-white p-2 font-black text-3xl">{children}</span>
};

const ActualDiffMessage = ({ diff }) => {
  const currency = formatCurrency(diff);
  
  if (diff > 0) {
    return (
      <div className="flex gap-2">
        {/*<Smiley size={BUTTON_SIZE}/>*/}
        <PositiveAmount>{currency}</PositiveAmount>
        Saved this month!
      </div>
    )
  }
  return (
    <div className="flex gap-2">
      {/*<SmileySad/>*/}
      <NegativeAmount>{currency}</NegativeAmount>
      Lost this month...
    </div>
  )
}

export const BalanceDiffMessage = ({ incomeBudget, expensesBudget, totalIncomeThisMonth, totalExpensesThisMonth }) => {
  const budgetDiff = Math.round((incomeBudget - expensesBudget) - (totalIncomeThisMonth - totalExpensesThisMonth));
  const budgetDiffCurrency = formatCurrency(budgetDiff);
  const diffMessage = realityVsExpectationMessage(budgetDiff);
  // if (!incomeBudget || !expensesBudget || !totalIncomeThisMonth || !totalExpensesThisMonth) {
  //   return null;
  // }
  
  const actualDiff = totalIncomeThisMonth - totalExpensesThisMonth;
  console.log({ actualDiff });
  
  return (
    <p className="md:w-1/3 font-serif text-xl italic md:p-4 my-4">
      <ActualDiffMessage diff={actualDiff}/>
      {(!incomeBudget || !expensesBudget) ? "No budget set this month." : <div className="flex gap-2 items-start">
        <NegativeAmount>{budgetDiffCurrency}</NegativeAmount>
        {budgetDiff > 0 ? "over my budget" : "less than my budget"} - {diffMessage}
        {/*<MaskSad size={BUTTON_SIZE}/>*/}
      </div>}
    </p>
  );
}