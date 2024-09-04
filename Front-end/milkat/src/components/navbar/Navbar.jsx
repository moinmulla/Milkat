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

  //Store the name of the user in the Login context
  const { login } = useContext(LoginContext);

  //Add and remove background color on scroll to the navbar
  const scrollHandler = () => {
    if (window.scrollY > 40) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  //Call the function on scroll
  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const handleClick = () => {
    setModal(!modal);
  };

  //Get to dashboard if user is logged in
  const handleUser = () => {
    navigate("/dashboard");
  };

  return (
    <div className={`${styles.container} ${show && styles.navbarScroll}`}>
      <nav className={styles.navbar}>
        <span className={styles.logo}>
          <Link to="/">Milkat</Link>
        </span>
        <div className={styles.links}>
          <a href="/chat">Open-Chat</a>
          <a href="/contact">Contact</a>
          <a href="/about">About</a>

          {/* Show Login button if user is not logged in and if user is logged in, show user button with name */}
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

          {/* Show modal if modal is true */}
          {modal && <Modal modal={modal} setModal={setModal} />}
        </div>

        {/* Mobile menu button */}
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
            {/* Show Login button if user is not logged in and if user is logged in, show user button with name */}
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

            <a href="/chat" onClick={() => setOpen(false)}>
              Open Chat System
            </a>
            <a href="/contact" onClick={() => setOpen(false)}>
              Contact
            </a>
            <a href="/about" onClick={() => setOpen(false)}>
              About
            </a>

            {/* Show modal if modal is true for mobile */}
            {modal && <Modal modal={modal} setModal={setModal} />}
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
