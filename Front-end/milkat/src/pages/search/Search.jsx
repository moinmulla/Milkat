import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../../components/searchbar/SearchBar";
import Select from "../../components/select/Select";
import Card from "../../components/card/Card";
import axios from "../../utils/axios";
import styles from "./search.module.scss";

function Search() {
  const searchParams = useSearchParams();
  const postcode_temp = searchParams[0].get("q").toUpperCase();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch_data = async () => {
      await axios
        .get("/properties", { params: { postcode: postcode_temp } })
        .then((res) => {
          // console.log(res.data.properties);
          const fetchedData = res.data.properties;
          if (JSON.stringify(fetchedData) !== JSON.stringify(data)) {
            setData(fetchedData);
          }
        })
        .catch((error) => {
          // console.log(error);
          setData([]);
        });
    };
    fetch_data();
  }, [postcode_temp]);

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <span className={styles.fancy}>Search</span>
      </div>
      <div className={styles.content}>
        <div className={styles.search}>
          <SearchBar />
        </div>
        {data.length === 0 ? (
          <span className={styles.noResults}>
            No results found for area{" "}
            <span className={styles.highlight}>{postcode_temp}</span>
          </span>
        ) : (
          <>
            <div>
              <Select />
            </div>
            <div className={styles.filterSort}>
              <div className={styles.filter}>Filter</div>
              <div className={styles.sort}>Sort</div>
            </div>
            <div className={styles.results}>
              <Card data={data} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Search;
