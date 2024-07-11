import React from "react";
import styles from "./navbar.module.scss";
import { useState, useEffect } from "react";
import "../../fonts/Honk.ttf";

function Navbar() {
  const [show, handleShow] = useState(false);
  const [open, setOpen] = useState(false);

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

  return (
    <div className={`${styles.container} ${show ? styles.navbar_scroll : ""}`}>
      <nav className={styles.navbar}>
        <span className={styles.logo}>
          <a href="/">Milkat</a>
        </span>
        <div className={styles.links}>
          <a href="/listup">List Up</a>
          <a href="/prediction">Price Prediction</a>
          <a href="/contact">Contact</a>
          <a href="/about">About</a>
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
            <a href="/listup" onClick={() => setOpen(false)}>
              List Up
            </a>
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
