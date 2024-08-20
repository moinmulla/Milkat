import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../../components/searchbar/SearchBar";
import Select from "../../components/select/Select";
import axios from "../../utils/axios";
import styles from "./search.module.scss";

function Search() {
  const searchParams = useSearchParams();
  const postcode_temp = searchParams[0].get("q");

  useEffect(() => {
    axios
      .get("/properties", { params: { postcode: postcode_temp } })
      .then((res) => {
        console.log(res.data.properties);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <span className={styles.fancy}>Search</span>
      </div>
      <div className={styles.content}>
        <div className={styles.search}>
          <SearchBar />
        </div>
        <div>
          <Select />
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
