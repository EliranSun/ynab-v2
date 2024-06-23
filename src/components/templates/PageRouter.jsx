import {useParams} from "react-router-dom";
import FuturePredictionPage from "../pages/FuturePredictionPage/FuturePredictionPage";
import {BalanceView, CategoryView, ExpenseView, ParseExpensesList, SeeingDoublePage} from "..";
import ExpensesSummary from "../../features/LastExpenses/components/ExpensesSummary";
import {ManageBudget} from "../../features/ManageBudget/ManageBudget";

export const PageRouter = () => {
    const {page} = useParams();

    const pages = {
        home: <ExpensesSummary/>,
        import: <ParseExpensesList/>,
        balance: <BalanceView/>,
        expenses: <ExpenseView/>,
        categories: <CategoryView/>,
        projection: <FuturePredictionPage/>,
        resolver: <SeeingDoublePage/>,
        budget: <ManageBudget/>
    };

    return pages[page] || <div>Not found</div>;
};