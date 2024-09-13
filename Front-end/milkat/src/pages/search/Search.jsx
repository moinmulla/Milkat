import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import SearchBar from "../../components/searchbar/SearchBar";
import GooglemapsCluster from "../../components/googlemapsCluster/GooglemapsCluster";
import { BsSortDown, BsSortDownAlt } from "react-icons/bs";
import Card from "../../components/card/Card";
import Pagination from "@mui/material/Pagination";
import axios from "../../utils/axios";
import styles from "./search.module.scss";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const postcodeTemp = searchParams.get("q")?.toUpperCase() || "";
  const navigate = useNavigate();

  //Page number and total number of pages
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [count, setCount] = useState(1);

  const [data, setData] = useState([]);
  //used to store the filtered data
  const [newData, setNewData] = useState([]);
  const [newData2, setNewData2] = useState([]);

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

  const optionsSort = [
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

  const optionsFilter = [
    { value: "all", label: <div>All</div> },
    { value: "Bungalow", label: <div>Bungalow</div> },
    { value: "Detached", label: <div>Detached</div> },
    { value: "Semi-detached", label: <div>Semi-detached</div> },
    { value: "Terraced", label: <div>Terraced</div> },
    { value: "Flats", label: <div>Flats</div> },
    { value: "Farms/land", label: <div>Farms/land</div> },
  ];

  const optionsSale = [
    { value: "all", label: <div>All</div> },
    { value: "sale", label: <div>Sale</div> },
    { value: "rent", label: <div>Rent</div> },
  ];

  const optionsNumber = [
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
      setNewData(newData2);
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

    setNewData(filteredData);
    setNewData2(filteredData);
  };

  const updateSearchParams = (newParams) => {
    const updatedParams = new URLSearchParams(searchParams);

    for (const key in newParams) {
      if (newParams[key] !== undefined) {
        updatedParams.set(key, newParams[key]);
      }
    }

    // Use of replace to avoid history entry
    navigate({ search: updatedParams.toString() }, { replace: true });
  };

  // Fetch list of properties when postcode or page changes
  useEffect(() => {
    // Fetch list of properties along with their details
    const fetchData = async () => {
      await axios
        .get("/properties", {
          params: { postcode: postcodeTemp, page: page },
        })
        .then((res) => {
          setCount(res.data.count);
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

    if (postcodeTemp) {
      fetchData();
    }
  }, [postcodeTemp, page]);

  // Sync page state with the URL
  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page")) || 1;
    if (currentPage !== page) {
      setPage(currentPage);
    }
  }, [searchParams]);

  // Apply filters when the variable mentioned changes
  useEffect(() => {
    applyFilters(data);
  }, [postcodeTemp, propertyType, sale, bedrooms, bathrooms, receptions]);

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
          postcodeTemp.length < 3 ? (
            <span className={styles.noResults}>
              Enter at least 3 characters to search
            </span>
          ) : (
            <span className={styles.noResults}>
              No results found for area{" "}
              <span className={styles.highlight}>{postcodeTemp}</span>
            </span>
          )
        ) : (
          <>
            <div className={styles.filterProperty}>
              <Select
                placeholder="Select property type"
                options={optionsFilter}
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
                  options={optionsSale}
                  className={styles.select}
                  onChange={(value) => {
                    handleSale(value.value);
                  }}
                />
              </div>
              <div className={styles.sort}>
                <Select
                  placeholder="Bedrooms"
                  options={optionsNumber}
                  className={styles.select}
                  onChange={(value) => {
                    handleBedrooms(value.value);
                  }}
                />
              </div>
              <div className={styles.sort}>
                <Select
                  placeholder="Bathrooms"
                  options={optionsNumber}
                  className={styles.select}
                  onChange={(value) => {
                    handleBathrooms(value.value);
                  }}
                />
              </div>
              <div className={styles.sort}>
                <Select
                  placeholder="Receptions"
                  options={optionsNumber}
                  className={styles.select}
                  onChange={(value) => {
                    handleReceptions(value.value);
                  }}
                />
              </div>
              <div className={styles.sort}>
                <Select
                  placeholder="Sort"
                  options={optionsSort}
                  className={styles.select}
                  onChange={(value) => {
                    handleSort(value.value);
                  }}
                />
              </div>
            </div>
            <div className={styles.results}>
              <Card
                data={newData}
                setPage={setPage}
                count={count}
                page={page}
              />
            </div>
          </>
        )}
      </div>
      <div>
        <GooglemapsCluster props={newData} />
      </div>
    </div>
  );
}

export default Search;
