import {useEffect, useRef} from "react";
import {Chart, registerables} from "chart.js";

let singleton = null;

export const ChartType = {
    LINE: "line",
    BAR: "bar",
}

const useBasicChart = ({
    data = [],
    incomeData = [],
    budgetData = [],
    isZeroBaseline = true,
    type = ChartType.LINE
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || data.length === 0) {
            return;
        }

        if (singleton) {
            return;
        }

        Chart.register(...registerables);

        const ctx = document.getElementById("myChart").getContext("2d");
        let myChart = new Chart(ctx, {
            type,
            data: {
                labels: data.map(item => item.x),
                datasets: [
                    {
                        label: "Expenses",
                        data: data,
                        backgroundColor: ["rgba(235,54,54,0.2)",],
                        borderColor: ["rgb(235,54,54)",],
                        spanGaps: true,
                    },
                    {
                        label: "Income",
                        data: incomeData,
                        backgroundColor: ["rgba(43,143,20,0.2)"],
                        borderColor: ["rgba(93,235,54,0.66)"],
                        spanGaps: true,
                    },
                    {
                        label: "Budget",
                        data: budgetData,
                        backgroundColor: ["rgba(54,54,235,0.2)"],
                        borderColor: ["rgba(54,54,235,0.66)"],
                        spanGaps: true,
                    }
                ]
            },
            options: {
                fill: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false
                },
                scales: {
                    y: {
                        beginAtZero: isZeroBaseline,
                    },
                },
            }
        });

        return () => {
            myChart && myChart.destroy();
            singleton = null;
        };
    }, [data]);

    return canvasRef;
};

export default useBasicChart;