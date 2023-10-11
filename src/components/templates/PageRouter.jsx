import { useParams } from "react-router-dom";
import FuturePredictionPage from "../pages/FuturePredictionPage/FuturePredictionPage";
import { BalanceView, CategoryView, ExpenseView, ParseExpensesList, SeeingDoublePage } from "..";

export const PageRouter = () => {
  const { page } = useParams();

  const pages = {
    parse: <ParseExpensesList/>,
    expenses: <ExpenseView/>,
    balance: <BalanceView/>,
    projection: <FuturePredictionPage/>,
    resolver: <SeeingDoublePage/>,
    categories: <CategoryView/>
  };

  return pages[page] || <div>Not found</div>;
};