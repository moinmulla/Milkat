import React from "react";
import Carousel from "../../components/carousel/Carousel";
import SearchBar from "../../components/searchbar/SearchBar";
import Chart1 from "../../components/charts/Chart1";
import Reviews from "../../components/reviews/Reviews";
import styles from "./home.module.scss";
import "../../fonts/Relieve.ttf";

function Home() {
  return (
    <div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <div className={styles.heading}>
              <span className={styles.headingText}>
                Welcome to <span className={styles.highlight}>Milkat</span>,
                <br />
              </span>
            </div>
            <div className={styles.subheading}>
              A best place to find your dream home. A property search made easy.
              Making home search hassle-free. Find the best house for you.
            </div>
          </div>
          <div className={styles.carousel}>
            <Carousel />
          </div>
        </div>
        <div className={styles.search}>
          <SearchBar />
        </div>
        <div className={styles.chart}>
          <p>House Price Trend</p>
          <Chart1 />
        </div>
        <div className={styles.reviews}>
          <p>Reviews</p>
          <div className={styles.eachReviews}>
            <Reviews />
            <Reviews />
            <Reviews />
            <Reviews />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
