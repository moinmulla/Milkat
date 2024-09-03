import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import SearchBar from "../../components/searchbar/SearchBar";
import { BsSortDown, BsSortDownAlt } from "react-icons/bs";
import Card from "../../components/card/Card";
import axios from "../../utils/axios";
import styles from "./search.module.scss";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const postcode_temp = searchParams.get("q")?.toUpperCase() || ""; // Ensure safe access using optional chaining (?.)
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [newData, setNewData] = useState([]);

  const [sale, setSale] = useState(searchParams.get("sale") || "all");
  const [propertyType, setPropertyType] = useState(
    searchParams.get("propertyType") || "all"
  );

  const [bedrooms, setBedrooms] = useState(
    searchParams.get("bedrooms") || "None"
  );
  const [bathrooms, setBathrooms] = useState(
    searchParams.get("bathrooms") || "None"
  );
  const [receptions, setReceptions] = useState(
    searchParams.get("receptions") || "None"
  );

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
    { value: "all", label: <div>All</div> },
    { value: "Bungalow", label: <div>Bungalow</div> },
    { value: "Detached", label: <div>Detached</div> },
    { value: "Semi-detached", label: <div>Semi-detached</div> },
    { value: "Terraced", label: <div>Terraced</div> },
    { value: "Flats", label: <div>Flats</div> },
    { value: "Farms/land", label: <div>Farms/land</div> },
  ];

  const options_sale = [
    { value: "all", label: <div>All</div> },
    { value: "sale", label: <div>Sale</div> },
    { value: "rent", label: <div>Rent</div> },
  ];

  const options_number = [
    { value: "None", label: <div>None</div> },
    { value: "1", label: <div>{"<"}1</div> },
    { value: "2", label: <div>{"<"}2</div> },
    { value: "3", label: <div>{"<"}3</div> },
    { value: "4", label: <div>{"<"}4</div> },
    { value: "5", label: <div>{"<"}5</div> },
    { value: "6", label: <div>{"<"}6</div> },
    { value: "7", label: <div>{"<"}7</div> },
    { value: "8", label: <div>{"<"}8</div> },
    { value: "9", label: <div>{"<"}9</div> },
    { value: "10", label: <div>{"<"}10</div> },
  ];

  const handleSort = (value) => {
    if (value === "ascending") {
      setNewData([...newData].sort((a, b) => a.price - b.price));
    } else if (value === "descending") {
      setNewData([...newData].sort((a, b) => b.price - a.price));
    } else {
      setNewData(newData);
    }
  };

  const handleFilter = (value) => {
    setPropertyType(value);
    searchParams.set("propertyType", value);
    updateSearchParams({ propertyType: value });
  };

  const handleSale = (value) => {
    setSale(value);
    updateSearchParams({ sale: value });
  };

  const handleBedrooms = (value) => {
    setBedrooms(value);
    updateSearchParams({ bedrooms: value });
  };

  const handleBathrooms = (value) => {
    setBathrooms(value);
    updateSearchParams({ bathrooms: value });
  };

  const handleReceptions = (value) => {
    setReceptions(value);
    updateSearchParams({ receptions: value });
  };

  const applyFilters = (dataToFilter) => {
    let filteredData = dataToFilter;

    if (propertyType !== "all") {
      filteredData = filteredData.filter(
        (d) => d.property_type === propertyType
      );
    }

    if (sale !== "all") {
      if (sale == "sale") {
        filteredData = filteredData.filter((d) => d.sale === 1);
      } else if (sale == "rent") {
        filteredData = filteredData.filter((d) => d.sale === 0);
      }
    }

    if (bedrooms !== "None") {
      filteredData = filteredData.filter(
        (d) => d.bedroom <= parseInt(bedrooms)
      );
    }

    if (bathrooms !== "None") {
      filteredData = filteredData.filter(
        (d) => d.bathroom <= parseInt(bathrooms)
      );
    }

    if (receptions !== "None") {
      filteredData = filteredData.filter(
        (d) => d.reception <= parseInt(receptions)
      );
    }

    console.log(filteredData);
    setNewData(filteredData);
  };

  const updateSearchParams = (newParams) => {
    const updatedParams = new URLSearchParams(searchParams);

    for (const key in newParams) {
      if (newParams[key] !== undefined) {
        updatedParams.set(key, newParams[key]);
      }
    }

    navigate({ search: updatedParams.toString() }, { replace: true }); // Use replace to avoid history entry
  };

  useEffect(() => {
    const fetch_data = async () => {
      await axios
        .get("/properties", {
          params: { postcode: postcode_temp },
        })
        .then((res) => {
          const fetchedData = res.data.properties;

          if (JSON.stringify(fetchedData) !== JSON.stringify(data)) {
            setData(fetchedData);
            setNewData(fetchedData);
            applyFilters(fetchedData);
          }
        })
        .catch((error) => {
          setData([]);
          setNewData([]);
        });
    };

    if (postcode_temp) {
      fetch_data();
    }
  }, [postcode_temp]);

  useEffect(() => {
    applyFilters(data);
  }, [postcode_temp, propertyType, sale, bedrooms, bathrooms, receptions]);

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
            <div className={styles.filterProperty}>
              <Select
                placeholder="Select property type"
                options={options_filter}
                className={styles.select}
                value={options_filter.find(
                  (option) => option.value === propertyType
                )}
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
                  value={options_sale.find(
                    (option) =>
                      option.value ===
                      (sale === 1 ? "sale" : sale === 0 ? "rent" : "all")
                  )}
                  onChange={(value) => {
                    handleSale(value.value);
                  }}
                />
              </div>
              <div className={styles.sort}>
                <Select
                  placeholder="Bedrooms"
                  options={options_number}
                  className={styles.select}
                  onChange={(value) => {
                    handleBedrooms(value.value);
                  }}
                />
              </div>
              <div className={styles.sort}>
                <Select
                  placeholder="Bathrooms"
                  options={options_number}
                  className={styles.select}
                  onChange={(value) => {
                    handleBathrooms(value.value);
                  }}
                />
              </div>
              <div className={styles.sort}>
                <Select
                  placeholder="Receptions"
                  options={options_number}
                  className={styles.select}
                  onChange={(value) => {
                    handleReceptions(value.value);
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
