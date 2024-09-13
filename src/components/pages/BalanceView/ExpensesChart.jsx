import useBasicChart, { ChartType } from "./useBasicChart";

const ExpensesChart = ({
    data = [],
    incomeData = [],
    budgetData = [],
    type = ChartType.LINE,
    isZeroBaseline = true,
    isLean,
}) => {
    const canvasRef = useBasicChart({
        data,
        incomeData,
        budgetData,
        type,
        isZeroBaseline,
        isLean
    });

    return (
        <div className="relative h-full w-full bg-white">
            <canvas id="myChart" ref={canvasRef} />
        </div>

    );
};

export default ExpensesChart;