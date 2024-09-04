import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { FaSchool } from "react-icons/fa6";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { IoRestaurant } from "react-icons/io5";
import { FaBusAlt } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { SiNationalrail } from "react-icons/si";
import styles from "./nearby.module.scss";

const Nearby = ({ location }) => {
  const [data, setData] = useState({});
  const temp = location.split(",");
  const latitude = temp[0];
  const longitude = temp[1];

  //Get the nearby data from the backend for the corresponding property latitude and longitude
  useEffect(() => {
    axios
      .post("/nearby", { latitude, longitude })
      .then((res) => {
        setData(res.data.message);
      })
      .catch((error) => {
        console.log(error);
        setData({});
      });
  }, []);

  return (
    <div>
      {data ? (
        <div className={styles.container}>
          <div className={styles.detail}>
            <FaSchool className={styles.icon} size={30} />
            <span className={styles.heading}>
              {" "}
              {data.school} {data.school <= 1 ? "School" : "Schools"}
            </span>
          </div>
          <div>
            <FaShoppingCart className={styles.icon} size={30} />
            <span className={styles.heading}>
              {" "}
              {data.supermarket}{" "}
              {data.supermarket <= 1 ? "Supermarket" : "Supermarkets"}
            </span>
          </div>
          <div className={styles.detail}>
            <FaBusAlt className={styles.icon} size={30} />
            <sapn className={styles.heading}>
              {" "}
              {data.bus} {data.bus <= 1 ? "Bus stop" : "Bus stops"}
            </sapn>
          </div>
          <div className={styles.detail}>
            <BsFillFuelPumpFill className={styles.icon} size={30} />
            <span className={styles.heading}>
              {" "}
              {data.fuel} {data.fuel <= 1 ? "Fuel Station" : "Fuel Stations"}
            </span>
          </div>
          <div className={styles.detail}>
            <IoRestaurant className={styles.icon} size={30} />
            <span className={styles.heading}>
              {data.restaurant}{" "}
              {data.restaurant <= 1 ? "Restaurant" : "Restaurants"}
            </span>
          </div>
          <div className={styles.detail}>
            <SiNationalrail className={styles.icon} size={30} />
            <span className={styles.heading}>
              {data.train}{" "}
              {data.train <= 1 ? "Train Station" : "Train Stations"}
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.problem}>
          <i>Something went wrong</i>
        </div>
      )}
    </div>
  );
};

export default Nearby;
