import useBasicChart, {ChartType} from "./useBasicChart";

const ExpensesChart = ({
    data = [],
    incomeData = [],
    budgetData = [],
    type = ChartType.LINE,
    isZeroBaseline = true,
}) => {
    const canvasRef = useBasicChart({
        data,
        incomeData,
        budgetData,
        type,
        isZeroBaseline
    });

    return (
        <div className="relative h-full w-full bg-white">
            <canvas id="myChart" ref={canvasRef}/>
        </div>

    );
};

export default ExpensesChart;