import React from "react";
import SearchBar from "../../components/searchbar/SearchBar";
import Chart1 from "../../components/charts/Chart1";
import styles from "./prediction.module.scss";

function Prediction() {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <span className={styles.fancy}>House Price Prediction</span>
      </div>
      <div className={styles.content}>
        <div className={styles.chart}>
          <Chart1 />
        </div>
        <div className={styles.mortgage}>Mortagage Calculator</div>
      </div>
    </div>
  );
}

export default Prediction;
