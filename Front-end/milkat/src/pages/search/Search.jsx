import React from "react";
import SearchBar from "../../components/searchbar/SearchBar";
import styles from "./search.module.scss";

function Search() {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <span className={styles.fancy}>Search</span>
      </div>
      <div className={styles.content}>
        <div className={styles.search}>
          <SearchBar />
        </div>
        <div className={styles.filterSort}>
          <div className={styles.filter}>Filter</div>
          <div className={styles.sort}>Sort</div>
        </div>
        <div className={styles.results}>Results</div>
      </div>
    </div>
  );
}

export default Search;
