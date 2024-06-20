import useBasicChart from "./useBasicChart";

const ExpensesChart = ({data = [], incomeData = []}) => {
    const canvasRef = useBasicChart(data, incomeData);

    return (
        <div className="relative h-60 w-full">
            <canvas id="myChart" ref={canvasRef}/>
        </div>

    );
};

export default ExpensesChart;