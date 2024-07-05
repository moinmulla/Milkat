import React from "react";
import styles from "./navbar.module.scss";
import { useState, useEffect } from "react";

function Navbar() {
  const [show, handleShow] = useState(false);
  const [open, setOpen] = useState(false);

  const scrollHandler = () => {
    if (window.scrollY > 50) {
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

  return (
    <div className={`${styles.container} ${show ? styles.navbar_scroll : ""}`}>
      <nav className={styles.navbar}>
        <span className={styles.logo}>Milkat</span>
        <div className={styles.links}>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>

        {!open && (
          <img
            className={styles.menu_button}
            src="./images/menu.svg"
            alt="menu"
            width={30}
            height={30}
            onClick={() => setOpen(!open)}
          />
        )}
        {open && (
          <img
            className={styles.menuButton}
            src="./images/close.svg"
            alt="close"
            width={30}
            height={30}
            onClick={() => setOpen(!open)}
          />
        )}

        {open && (
          <div className={styles.mobile_links}>
            <a href="#" onClick={() => setOpen(false)}>
              Home
            </a>
            <a href="#" onClick={() => setOpen(false)}>
              About
            </a>
            <a href="#" onClick={() => setOpen(false)}>
              Contact
            </a>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
