import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import SearchBar from "../../components/searchbar/SearchBar";
// import Select from "../../components/select/Select";
import { BsSortDown, BsSortDownAlt } from "react-icons/bs";
import Card from "../../components/card/Card";
import axios from "../../utils/axios";
import styles from "./search.module.scss";

function Search() {
  const searchParams = useSearchParams();
  const postcode_temp = searchParams[0].get("q").toUpperCase();
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [newData2, setNewData2] = useState([]);
  const [sale, setSale] = useState(-1);
  const [propertyType, setPropertyType] = useState("all");

  const options_sort = [
    {
      value: "original",
      label: <div>Original</div>,
    },
    {
      value: "ascending",
      label: (
        <div className={styles.sort_value}>
          <BsSortDownAlt className={styles.sort_icon} size={20} /> Ascending
        </div>
      ),
    },
    {
      value: "descending",
      label: (
        <div className={styles.sort_value}>
          <BsSortDown className={styles.sort_icon} size={20} /> Descending
        </div>
      ),
    },
  ];

  const options_filter = [
    {
      value: "all",
      label: <div>All</div>,
    },
    {
      value: "Bungalow",
      label: <div>Bungalow</div>,
    },
    {
      value: "Detached",
      label: <div>Detached</div>,
    },
    {
      value: "Semi-detached",
      label: <div>Semi-detached</div>,
    },
    {
      value: "Terraced",
      label: <div>Terraced</div>,
    },
    {
      value: "Flats",
      label: <div>Flats</div>,
    },
    {
      value: "Farms/land",
      label: <div>Farms/land</div>,
    },
  ];

  const options_sale = [
    {
      value: "all",
      label: <div>All</div>,
    },
    {
      value: "sale",
      label: <div>Sale</div>,
    },
    {
      value: "rent",
      label: <div>Rent</div>,
    },
  ];

  const handleSort = (value) => {
    if (value === "ascending") {
      setNewData([...newData].sort((a, b) => a.price - b.price));
    } else if (value === "descending") {
      setNewData([...newData].sort((a, b) => b.price - a.price));
    } else {
      setNewData(newData2);
      // console.log(newData2);
    }
  };

  const handleFilter = (value) => {
    let filteredData;
    setPropertyType(value);
    if (
      (value === "Bungalow" ||
        value === "Detached" ||
        value === "Semi-detached" ||
        value === "Terraced" ||
        value === "Flats" ||
        value === "Farms/land") &&
      sale !== -1
    ) {
      filteredData = [...data].filter(
        (d) => d.property_type === value && d.sale === sale
      );
    } else if (
      (value === "Bungalow" ||
        value === "Detached" ||
        value === "Semi-detached" ||
        value === "Terraced" ||
        value === "Flats" ||
        value === "Farms/land") &&
      sale == -1
    ) {
      filteredData = [...data].filter((d) => d.property_type === value);
    } else if (value === "all" && sale !== -1) {
      filteredData = [...data].filter((d) => d.sale === sale);
    } else {
      setNewData(data);
    }

    setNewData(filteredData);
    setNewData2(filteredData);
  };

  const handleSale = (value) => {
    let filteredData;

    if (value === "sale" && propertyType !== "all") {
      setSale(1);
      filteredData = [...data].filter(
        (d) => d.sale === 1 && d.property_type === propertyType
      );
    } else if (value === "rent" && propertyType !== "all") {
      setSale(0);
      filteredData = [...data].filter(
        (d) => d.sale === 0 && d.property_type === propertyType
      );
    } else if (value === "sale" && propertyType == "all") {
      setSale(1);
      filteredData = [...data].filter((d) => d.sale === 1);
    } else if (value === "rent" && propertyType == "all") {
      setSale(0);
      filteredData = [...data].filter((d) => d.sale === 0);
    } else if (value === "all" && propertyType !== "all") {
      filteredData = [...data].filter((d) => d.property_type === propertyType);
    } else {
      setSale(-1);
      filteredData = [...data];
    }

    setNewData(filteredData);
    setNewData2(filteredData);
  };

  useEffect(() => {
    const fetch_data = async () => {
      await axios
        .get("/properties", { params: { postcode: postcode_temp } })
        .then((res) => {
          // console.log(res.data.properties);
          const fetchedData = res.data.properties;
          if (JSON.stringify(fetchedData) !== JSON.stringify(data)) {
            setData(fetchedData);
            setNewData(fetchedData);
            setNewData2(fetchedData);
          }
        })
        .catch((error) => {
          // console.log(error);
          setData([]);
          setNewData([]);
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
          postcode_temp.length < 3 ? (
            <span className={styles.noResults}>
              Enter at least 3 characters to search
            </span>
          ) : (
            <span className={styles.noResults}>
              No results found for area{" "}
              <span className={styles.highlight}>{postcode_temp}</span>
            </span>
          )
        ) : (
          <>
            <div>
              <Select
                // isMulti
                placeholder="Select property type"
                options={options_filter}
                className={styles.select}
                onChange={(value) => {
                  handleFilter(value.value);
                }}
              />
            </div>
            <div className={styles.filterSort}>
              <div className={styles.filter}>
                <Select
                  placeholder="Filter"
                  options={options_sale}
                  className={styles.select}
                  onChange={(value) => {
                    handleSale(value.value);
                  }}
                />
              </div>
              <div className={styles.sort}>
                <Select
                  placeholder="Sort"
                  options={options_sort}
                  className={styles.select}
                  onChange={(value) => {
                    handleSort(value.value);
                  }}
                />
              </div>
            </div>
            <div className={styles.results}>
              <Card data={newData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Search;
