import React from "react";
import styles from "./footer.module.scss";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaDribbble,
  FaLinkedin,
} from "react-icons/fa";

function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.footerTop}>
        <div className={styles.footerTopLeft}>
          <img className={styles.logo} src="/images/house.png" alt="logo" />
          <span className={styles.logoText}>Milkat</span>
        </div>
        <div className={styles.footerTopRight}>
          <div className={styles.features}>
            <p>Features</p>
            <ul>
              <a href="/listup">
                <li>List Up</li>
              </a>
              {/* <a href="/prediction">
                <li>House Price Prediction</li>
              </a> */}
              <a href="/chat">
                <li>Open Chat System</li>
              </a>
              <a href="#">
                <li>Saved Properties</li>
              </a>
            </ul>
          </div>
          <div className={styles.links}>
            <p>Quick Links</p>
            <ul>
              <a href="/about">
                <li>About Us</li>
              </a>
              <a href="/contact">
                <li>Contact Us</li>
              </a>
              <a href="#">
                <li>Privacy Policy</li>
              </a>
              <a href="#">
                <li>Terms & Conditions</li>
              </a>
            </ul>
          </div>
        </div>
      </div>
      <hr />
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomLeft}>
          <p>© {new Date().getFullYear()} Milkat. All rights reserved.</p>
        </div>
        <div className={styles.footer_bottom_right}>
          <FaFacebook size={25} className={styles.facebook} />
          <FaInstagram size={25} className={styles.instagram} />
          <FaTwitter size={25} className={styles.twitter} />
          <FaDribbble size={25} className={styles.dribbble} />
          <FaLinkedin size={25} className={styles.linkedin} />
        </div>
      </div>
    </div>
  );
}

export default Footer;
