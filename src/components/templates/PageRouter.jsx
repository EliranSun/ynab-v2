import {useParams} from "react-router-dom";
import FuturePredictionPage from "../pages/FuturePredictionPage/FuturePredictionPage";
import {BalanceView, CategoryView, ExpenseView, ParseExpensesList, SeeingDoublePage} from "..";

export const PageRouter = () => {
    const {page} = useParams();

    const pages = {
        parse: <ParseExpensesList/>,
        balance: <BalanceView/>,
        expenses: <ExpenseView/>,
        categories: <CategoryView/>,
        projection: <FuturePredictionPage/>,
        resolver: <SeeingDoublePage/>,
    };

    return pages[page] || <div>Not found</div>;
};