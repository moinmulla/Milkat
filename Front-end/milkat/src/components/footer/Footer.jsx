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
      <div className={styles.footer_top}>
        <div className={styles.footer_top_left}>
          <img className={styles.logo} src="/images/house.png" alt="logo" />
          <span className={styles.logo_text}>Milkat</span>
        </div>
        <div className={styles.footer_top_right}>
          <div className={styles.features}>
            <p>Features</p>
            <ul>
              <a href="#">
                <li>House Price Prediction</li>
              </a>
              <a href="#">
                <li>3D View of Property</li>
              </a>
              <a href="#">
                <li>Saved Properties</li>
              </a>
            </ul>
          </div>
          <div className={styles.links}>
            <p>Quick Links</p>
            <ul>
              <a href="#">
                <li>About Us</li>
              </a>
              <a href="#">
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
      <div className={styles.footer_bottom}>
        <div className={styles.footer_bottom_left}>
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
