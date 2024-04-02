import useBasicChart from "./useBasicChart";

const ExpensesChart = ({data = []}) => {
    const canvasRef = useBasicChart(data);

    return (
        <div className="relative h-60 w-full">
            <canvas id="myChart" ref={canvasRef}/>
        </div>

    );
};

export default ExpensesChart;