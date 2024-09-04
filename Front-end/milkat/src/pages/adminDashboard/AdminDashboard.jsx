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
  //data stores the bookmarked properties
  const [data, setData] = useState([]);

  const [listedProperties, setListedProperties] = useState([]);
  const [bookmark, setBookmark] = useState(0);

  //page number and total number of pages for bookmarked properties
  const [page1, setPage1] = useState(1);
  const [count1, setCount1] = useState(1);

  //page number and total number of pages for listed properties
  const [page2, setPage2] = useState(1);
  const [count2, setCount2] = useState(1);

  const { clearData, role } = useContext(LoginContext);
  const navigate = useNavigate();

  const secretKey = `${process.env.REACT_APP_SECRET_KEY}` || "secret_key";
  const cookieValue = decodeURIComponent(document.cookie);

  const tempToken = cookieValue.match(new RegExp("token=([^;]+)"));
  if (tempToken == null) {
    clearData();
    navigate("/");
  }
  const bytes = CryptoJS.AES.decrypt(tempToken[1], secretKey);

  const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

  const role1 = decryptedToken.match(new RegExp("role=([^;]+)"));
  const email1 = decryptedToken.match(new RegExp("email=([^;]+)"));
  const name1 = decryptedToken.match(new RegExp("name=([^;]+)"));
  const role2 = role1[1];
  const email = email1[1];
  const name = name1[1];

  if (role == "admin" && role2 == "user") {
    navigate("/");
  }

  useEffect(() => {
    //get bookmarked properties
    axios
      .post("/userDashboard", { page: page1 })
      .then((res) => {
        setData(res.data.properties);
        setCount1(res.data.count);
      })
      .catch((err) => console.log(err));

    //get listed properties
    axios
      .post("/adminDashboard", { page: page2 })
      .then((res) => {
        //"listedProperties" is used to differentiate listed properties(for the logged in user) from other properties in Cards component
        res.data.properties["listedProperties"] = true;
        setListedProperties(res.data.properties);
        setCount2(res.data.count);
      })
      .catch((err) => console.log(err));
  }, [bookmark, page1, page2]);

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
        // console.log(err);
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
              <Card
                data={listedProperties}
                setBookmark={setBookmark}
                count={count2}
                setPage={setPage2}
                page={page2}
              />
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
              <Card
                data={data}
                count={count1}
                setPage={setPage1}
                page={page1}
              />
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
