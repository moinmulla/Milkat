import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { LoginContext } from "../../hooks/LoginContext";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Card from "../../components/card/Card";
import axios from "../../utils/axios";
import styles from "./userDashboard.module.scss";

const UserDashboard = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);

  const { clearData } = useContext(LoginContext);
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
  const role = role1[1];
  const email = email1[1];
  const name = name1[1];

  useEffect(() => {
    //fetch user dashboard data(i.e. bookmarked properties)
    axios
      .post("/userDashboard", {
        page: page,
      })
      .then((res) => {
        setCount(res.data.count);
        setData(res.data.properties);
      })
      .catch((err) => console.log(err));
  }, [page]);

  const handleLogout = () => {
    axios
      .get("/logout")
      .then((res) => {
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
            {role[0].toUpperCase() + role.slice(1)}
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
          <span className={styles.bookmarkHeading}>
            Your bookmarked properties
          </span>
        </div>
        <div>
          {data.length ? (
            <Card data={data} count={count} setPage={setPage} page={page} />
          ) : (
            <div className={styles.noProperties}>No properties bookmarked</div>
          )}
        </div>
        <div className={styles.logout}>
          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
