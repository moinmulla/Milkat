import React from "react";
import { FaUser } from "react-icons/fa";
import styles from "./reviews.module.scss";

function Reviews() {
  return (
    <div className={styles.container}>
      <div className={styles.reviews_content}>
        <div className={styles.logo}>
          <FaUser className={styles.icon} />
        </div>
        <div className={styles.rating}>⭐⭐⭐⭐⭐</div>
      </div>
      <div className={styles.caption}>Review Caption</div>
      <div className={styles.review}>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia
        perferendis esse eligendi vero corporis non, dolorum iste?
        Necessitatibus doloremque ipsam ullam animi accusantium eligendi
        voluptatum in, distinctio laboriosam officia earum!
      </div>
    </div>
  );
}

export default Reviews;
