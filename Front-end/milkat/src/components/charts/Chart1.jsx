import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "../../utils/axios";
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

function Chart1() {
  const [newData, setNewData] = useState([]);
  const [newLabels, setNewLabels] = useState([]);

  //variable used to check if the data is loaded
  const [open, setOpen] = useState(false);

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
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
      y: {
        beginAtZero: true,
        max: Math.max(...newData) + 10000, // Dynamically adjust y-axis max
        title: {
          display: true,
          text: "House Price\n(Average house price in England in June)",
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

  const data = {
    labels: newLabels,
    datasets: [
      {
        label: "Price is £",
        data: newData,
        backgroundColor: "lightblue",
        borderColor: "blue",
        borderWidth: 1.5,
      },
    ],
  };

  useEffect(() => {
    axios
      .get("/propertiesPrice")
      .then((res) => {
        const prices = res.data.prices;
        const updatedData = prices.map((item) => item.price);
        const updatedLabels = prices.map((item) => item.year.toString());
        setNewData(updatedData);
        setNewLabels(updatedLabels);
        setOpen(true);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {open && newData.length > 0 ? (
        <Line
          data={data}
          height={500}
          options={options}
          plugins={[ChartDataLabels]}
        />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
}

export default Chart1;
