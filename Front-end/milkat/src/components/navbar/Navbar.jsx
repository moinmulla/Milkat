import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Modal from "../modal/Modal";
import { FaUser } from "react-icons/fa";
import { LoginContext } from "../../hooks/LoginContext";
import axios from "../../utils/axios";
import styles from "./navbar.module.scss";

function Navbar() {
  const navigate = useNavigate();
  const [show, handleShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  // const [loginText, setLogintext] = useState("Login");
  const { login } = useContext(LoginContext);

  const scrollHandler = () => {
    if (window.scrollY > 40) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  // useEffect(() => {
  //   setLogintext(login);
  // }, [login]);
  // console.log(login);

  const handleClick = () => {
    setModal(!modal);
  };

  const handleUser = () => {
    // setModal(!modal);
    console.log("Clicked");
    navigate("/dashboard");
  };

  return (
    <div className={`${styles.container} ${show && styles.navbar_scroll}`}>
      <nav className={styles.navbar}>
        <span className={styles.logo}>
          <Link to="/">Milkat</Link>
        </span>
        <div className={styles.links}>
          <a href="/prediction">Price-Prediction</a>
          <a href="/contact">Contact</a>
          <a href="/about">About</a>

          {/* <button onClick={handleClick} className={styles.userBtn}>
            <div className={styles.user}>
              <FaUser className={styles.icon} />
              <span className={styles.login}>{login}</span>
            </div>
          </button> */}

          {login == "Login" ? (
            <button onClick={handleClick} className={styles.userBtn}>
              <div className={styles.user}>
                <FaUser className={styles.icon} />
                <span className={styles.login}>Login</span>
              </div>
            </button>
          ) : (
            <button onClick={handleUser} className={styles.userBtn}>
              <div className={styles.user}>
                <FaUser className={styles.icon} />
                <span className={styles.login}>
                  {"Hi " + login.split(" ")[0]}
                </span>
              </div>
            </button>
          )}
          {modal && <Modal modal={modal} setModal={setModal} />}
        </div>

        {!open && (
          <img
            className={styles.menu_button}
            src="/images/menu.svg"
            alt="menu"
            width={30}
            height={30}
            onClick={() => setOpen(!open)}
          />
        )}
        {open && (
          <img
            className={styles.menuButton}
            src="/images/close.svg"
            alt="close"
            width={30}
            height={30}
            onClick={() => setOpen(!open)}
          />
        )}

        {open && (
          <div className={styles.mobile_links}>
            {/* <div className={styles.user}>
              <button onClick={handleClick}>
                <FaUser className={styles.icon} />
                <span className={styles.login}>Login</span>
              </button>
              <FaUser className={styles.icon} />
              <a href="/login" className={styles.login}>
                Login
              </a>
            </div> */}

            {login == "Login" ? (
              <button onClick={handleClick} className={styles.userBtn}>
                <div className={styles.user}>
                  <FaUser className={styles.icon} />
                  <span className={styles.login}>Login</span>
                </div>
              </button>
            ) : (
              <button onClick={handleUser} className={styles.userBtn}>
                <div className={styles.user}>
                  <FaUser className={styles.icon} />
                  <span className={styles.login}>
                    {"Hi " + login.split(" ")[0]}
                  </span>
                </div>
              </button>
            )}

            {/* <button onClick={handleClick} className={styles.userBtn}>
              <div className={styles.user}>
                <FaUser className={styles.icon} />
                <span className={styles.login}>
                  {login == "Login" ? "Login" : "Hi " + login}
                </span>
              </div>
            </button> */}
            {modal && <Modal modal={modal} setModal={setModal} />}
            <a href="/prediction" onClick={() => setOpen(false)}>
              Price Prediction
            </a>
            <a href="/contact" onClick={() => setOpen(false)}>
              Contact
            </a>
            <a href="/about" onClick={() => setOpen(false)}>
              About
            </a>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
