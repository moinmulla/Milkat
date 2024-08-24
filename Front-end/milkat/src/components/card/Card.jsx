import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import { FaBath } from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import { GiSofa } from "react-icons/gi";
import { FaLink } from "react-icons/fa6";
import styles from "./card.module.scss";

const Cards = ({ data }) => {
  const navigate = useNavigate();

  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumSignificantDigits: 20,
  });

  const handleClick = (pid) => {
    navigate(`/property/${pid}`);
  };

  // console.log("data"  , data);
  return (
    <div className={styles.container}>
      {data.map((item) => (
        <Card className={styles.card}>
          {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
          <div className={styles.carousel}>
            <Carousel data-bs-theme="light" className={styles.carousel}>
              {item.image_paths ? (
                item.image_paths.map(
                  (image, index) =>
                    index < 3 && (
                      <Carousel.Item>
                        <img
                          className={`d-block w-100 ${styles.img}`}
                          src={image}
                          alt="Image not available"
                          height="300px"
                          key={index}
                        />
                      </Carousel.Item>
                    )
                )
              ) : (
                <Card.Img
                  variant="top"
                  src="holder.js/100px180"
                  alt="No image"
                />
              )}
            </Carousel>
          </div>
          <Card.Body onClick={() => handleClick(item.pid)}>
            <div className={styles.top_title}>
              <Card.Title>
                {formatter.format(item.price)}
                {!item.sale && " pcm"}
              </Card.Title>
              <div className={styles.sale_rent}>
                {item.sale ? "Sale" : "Rent"}
              </div>
            </div>
            {/* <Card.Title>
              {formatter.format(item.price)}
              {!item.sale && " pcm"}
            </Card.Title> */}
            <Card.Subtitle className="mb-2 text-muted">
              {!item.sale && formatter.format(item.price / 4) + " pcw"}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">
              <div className={styles.subtitle}>
                <div className={styles.divider}>
                  <div className={styles.headline}>{item.headline}</div>

                  <div className={styles.link}>
                    <FaLink size={25} />
                  </div>
                </div>
                <div className={styles.property_type}>{item.property_type}</div>
                <div className={styles.details}>
                  <div className={styles.ind_details} title="Reception">
                    <GiSofa size={20} />
                    {item.reception}
                  </div>
                  <div className={styles.ind_details} title="Bedroom">
                    <IoBed size={20} />
                    {item.bedroom}
                  </div>
                  <div className={styles.ind_details} title="Bathroom">
                    <FaBath size={20} />
                    {item.bathroom}
                  </div>
                </div>
              </div>
            </Card.Subtitle>
            <Card.Text className={styles.address}>
              {item.address_line1}, {item.town} {item.postcode.split(" ")[0]}
            </Card.Text>
            {/* <Card.Text>{item.address_line1}</Card.Text> */}
            <Card.Text className={styles.decription}>
              {item.description && item.description.length < 200
                ? item.description
                : item.description
                ? item.description.substring(0, 200) + "..."
                : "No description available."}
            </Card.Text>
            {/* <Card.Link variant="primary">Go somewhere</Card.Link> */}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Cards;
