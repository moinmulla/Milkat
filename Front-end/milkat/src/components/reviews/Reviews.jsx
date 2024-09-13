import React from "react";
import { FaUser } from "react-icons/fa";
import styles from "./reviews.module.scss";

function Reviews({ rating, caption, review }) {
  return (
    <div className={styles.container}>
      <div className={styles.reviewsContent}>
        <div className={styles.logo}>
          <FaUser className={styles.icon} />
        </div>
        <div className={styles.rating}>{rating}</div>
      </div>
      <div className={styles.caption}>{caption}</div>
      <div className={styles.review}>
        <span>{review}</span>
      </div>
    </div>
  );
}

export default Reviews;
