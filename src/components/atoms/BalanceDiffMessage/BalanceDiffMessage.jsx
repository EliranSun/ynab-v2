import { formatCurrency } from "../../../utils";
import { Trans } from "@lingui/macro";

const realityVsExpectationMessage = (diff) => {
  switch (true) {
    case diff < -100:
    default:
      return <Trans>which is good, but I should understand why my budget is off.</Trans>;

    case diff < 0:
      return <Trans>my budget is spot on!</Trans>;

    case diff < 200:
      return <Trans>but it's negligible!</Trans>;

    case diff < 500:
      return <Trans>perhaps a one-off, but I should understand why if this keeps going.</Trans>;

    case diff < 1000:
      return <Trans>my budget is nowhere NEAR reality.</Trans>;

    case diff > 10000:
      return <Trans>Jesus fucking christ man.</Trans>;

    case diff > 5000:
      return <Trans>I'm in BIG trouble.</Trans>;

    case diff > 1000:
      return <Trans>I'm in trouble.</Trans>;
  }
}

const NegativeAmount = ({ children }) => {
  return <span className="bg-red-500 text-white font-black text-xl">{children}</span>
};

const PositiveAmount = ({ children }) => {
  return <span className="bg-green-500 text-white font-black text-xl">{children}</span>
};

const ActualDiffMessage = ({ diff }) => {
  const currency = formatCurrency(diff);

  if (diff > 0) {
    return (
      <div className="flex gap-2">
        {/*<Smiley size={BUTTON_SIZE}/>*/}
        <PositiveAmount>{currency}</PositiveAmount>
        <Trans>Saved this month!</Trans>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {/*<SmileySad/>*/}
      <NegativeAmount>{currency}</NegativeAmount>
      <Trans>Lost this month...</Trans>
    </div>
  )
}

export const BalanceDiffMessage = ({ incomeBudget, expensesBudget, totalIncomeThisMonth, totalExpensesThisMonth }) => {
  const budgetDiff = Math.round((incomeBudget - expensesBudget) - (totalIncomeThisMonth - totalExpensesThisMonth));
  const budgetDiffCurrency = formatCurrency(budgetDiff);
  const diffMessage = realityVsExpectationMessage(budgetDiff);
  const actualDiff = totalIncomeThisMonth - totalExpensesThisMonth;

  return (
    <div className=" my-4 font-serif text-xl italic md:w-full md:p-0 md:my-0">
      <ActualDiffMessage diff={actualDiff}/>
      {(!incomeBudget || !expensesBudget)
        ? <Trans>No budget set this month.</Trans>
        : <div className="flex gap-2 items-start">
          <NegativeAmount>{budgetDiffCurrency}</NegativeAmount>
          {budgetDiff > 0
            ? <Trans>over my budget</Trans>
            : <Trans>less than my budget</Trans>} - {diffMessage}
          {/*<MaskSad size={BUTTON_SIZE}/>*/}
        </div>}
    </div>
  );
}