import React from "react";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

function chart1() {
  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "black",
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 25,
        title: {
          display: true,
          text: "House Price",
          color: "black",
          font: {
            size: 14,
          },
        },
        ticks: {
          color: "black",
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (value, context) => value,
        color: "black",
        display: "auto",
        font: {
          size: 13,
        },
      },
    },
  };

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const data = {
    labels,
    datasets: [
      {
        label: "Price is £",
        data: [12, 19, 3, 5, 2, 3, 15, 5, 2, 3,10,8],
        backgroundColor: "lightblue",
        borderColor: "blue",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Line
        data={data}
        height={500}
        options={options}
        plugins={[ChartDataLabels]}
      />
    </div>
  );
}

export default chart1;
