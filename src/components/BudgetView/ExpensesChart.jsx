import useBasicChart from "./useBasicChart";

const ExpensesChart = ({ data = [] }) => {
    const canvasRef = useBasicChart(data);
    
    return (
        <div className="relative h-40 w-60">
            <canvas id="myChart" ref={canvasRef}/>
        </div>
    
    );
};

export default ExpensesChart;