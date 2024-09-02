import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { LoginContext } from "../../hooks/LoginContext";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Card from "../../components/card/Card";
import axios from "../../utils/axios";
import styles from "./adminDashboard.module.scss";

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [listedProperties, setListedProperties] = useState([]);
  const [count, setCount] = useState(0);

  const { clearData, role } = useContext(LoginContext);
  const navigate = useNavigate();

  const secret_key = `${process.env.REACT_APP_SECRET_KEY}` || "secret_key";
  const cookie_value = decodeURIComponent(document.cookie);

  const temp_token = cookie_value.match(new RegExp("token=([^;]+)"));

  const bytes = CryptoJS.AES.decrypt(temp_token[1], secret_key);

  const decrypted_token = bytes.toString(CryptoJS.enc.Utf8);

  const role1 = decrypted_token.match(new RegExp("role=([^;]+)"));
  const email1 = decrypted_token.match(new RegExp("email=([^;]+)"));
  const name1 = decrypted_token.match(new RegExp("name=([^;]+)"));
  const role2 = role1[1];
  const email = email1[1];
  const name = name1[1];

  if (role == "admin" && role2 == "user") {
    navigate("/");
  }

  useEffect(() => {
    axios
      .get("/userDashboard")
      .then((res) => {
        setData(res.data.properties);
      })
      .catch((err) => console.log(err));

    axios
      .get("/adminDashboard")
      .then((res) => {
        res.data.properties["listedProperties"] = true;
        setListedProperties(res.data.properties);
      })
      .catch((err) => console.log(err));
  }, [count]);

  const handleLogout = () => {
    axios
      .get("/logout")
      .then((res) => {
        localStorage.clear();
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        clearData();
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  return (
    <div>
      <div className={styles.container}>
        <div>
          <span className={styles.heading}>
            Name: <span className={styles.title}>{name}</span>
          </span>
        </div>
        <div>
          <span className={styles.heading}>
            Role:{" "}
            <span className={styles.title}>
              {role2[0].toUpperCase() + role2.slice(1)}
            </span>
          </span>
        </div>
        <div>
          <span className={styles.heading}>
            Email Address: <span className={styles.title}>{email}</span>
          </span>
        </div>
        <div className={styles.content}>
          <div className={styles.heading}>
            <span className={styles.bookmark_heading}>
              Your listed properties
            </span>
          </div>
          <div>
            {listedProperties.length ? (
              <Card data={listedProperties} setCount={setCount} />
            ) : (
              <div className={styles.no_properties}>No properties listed</div>
            )}
          </div>

          <hr />

          <div className={styles.heading}>
            <span className={styles.bookmark_heading}>
              Your bookmarked properties
            </span>
          </div>
          <div>
            {data.length ? (
              <Card data={data} />
            ) : (
              <div className={styles.no_properties}>
                No properties bookmarked
              </div>
            )}
          </div>
          <div className={styles.logout}>
            <Button onClick={handleLogout} variant="danger">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
