import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

let singleton = null;

const useBasicChart = (data) => {
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
      type: "line",
      data: {
        labels: data.map(item => item.x).reverse(),
        datasets: [
          {
            label: "Expenses",
            data: data.map(item => item.y),
            backgroundColor: ["rgba(54, 162, 235, 0.2)",],
            borderColor: ["rgba(54, 162, 235, 1)",],
            spanGaps: true,
          }
        ]
      },
      options: {
        fill: true,
        interaction: {
          intersect: false
        },
        radius: 0,
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