import useBasicChart, {ChartType} from "./useBasicChart";

const ExpensesChart = ({
                           data = [],
                           incomeData = [],
                           budgetData = [],
                           type = ChartType.LINE
                       }) => {
    const canvasRef = useBasicChart({
        data,
        incomeData,
        budgetData,
        type
    });

    return (
        <div className="relative h-60 w-full">
            <canvas id="myChart" ref={canvasRef}/>
        </div>

    );
};

export default ExpensesChart;