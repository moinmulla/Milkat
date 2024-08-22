import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { FaBath } from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import { GiSofa } from "react-icons/gi";
import { FaLink } from "react-icons/fa6";
import styles from "./property.module.scss";

const Property = () => {
  const { pid } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumSignificantDigits: 20,
  });

  useEffect(() => {
    const fetch_data = async () => {
      await axios
        .get(`/property/${pid}`)
        .then((res) => {
          console.log(res.data.property);
          setData(res.data.property[0]);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    };

    fetch_data();
  }, []);

  return (
    <>
      {loading ? (
        <div className={styles.loading}>Loading..</div>
      ) : (
        <div className={styles.container}>
          <div className={styles.images}>
            <Carousel
              data-bs-theme="light"
              className={styles.carousel}
              interval={null}
            >
              {data.image_paths &&
                data.image_paths.map((image, index) => (
                  <Carousel.Item>
                    <img
                      className={`d-block w-100 ${styles.img}`}
                      src={image}
                      alt="First slide"
                      height="800px"
                      key={index}
                    />
                    <Carousel.Caption>
                      <div className={styles.caption}>
                        {` ${index + 1} / ${data.image_paths.length}`}
                      </div>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
            </Carousel>
          </div>

          <div className={styles.content}>
            <div className={styles.price}>
              {data.sale ? (
                <span className={styles.offer}>
                  Offers over
                  <br />
                </span>
              ) : null}

              <span className={styles.amount}>
                {formatter.format(data.price)} {!data.sale && "pcm"}
              </span>
              {!data.sale && (
                <span className={styles.month}>
                  {formatter.format(data.price / 4)} pcw
                </span>
              )}
            </div>
            <div className={styles.headline}>{data.headline}</div>
            <div className={styles.address}>
              {data.address_line1} {data.town} {data.postcode.split(" ")[0]}
            </div>
            <div className={styles.details}>
              <div className={styles.ind_details} title="Reception">
                <GiSofa size={30} />
                {data.reception} Reception
              </div>
              <div className={styles.ind_details} title="Bedroom">
                <IoBed size={30} />
                {data.bedroom} Bedrooms
              </div>
              <div className={styles.ind_details} title="Bathroom">
                <FaBath size={30} />
                {data.bathroom} Bathrooms
              </div>
            </div>
            <hr />
            <div className={styles.description}>
              <span className={styles.desc_title}>Description</span>
              <span className={styles.desc}>{data.description}</span>
            </div>
          </div>

          <hr />
        </div>
      )}
    </>
  );
};

export default Property;
