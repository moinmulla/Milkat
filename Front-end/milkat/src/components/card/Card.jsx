import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import Pagination from "@mui/material/Pagination";
import axios from "../../utils/axios";
import { FaBath, FaTrashAlt, FaRegStar } from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import { GiSofa } from "react-icons/gi";
import { FaLink } from "react-icons/fa6";
import { toast } from "react-toastify";
import styles from "./card.module.scss";

const Cards = ({ data, setBookmark, setPage, count = 1, page }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumSignificantDigits: 20,
  });

  //Get the property data from the backend for the corresponding property id(i.e. pid)
  const handleClick = (pid) => {
    navigate(`/property/${pid}`);
  };

  //Copy the link to the clipboard for the corresponding property id(i.e. pid)
  const handleCopy = async (e, value) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(
      `${window.location.origin}/property/${value}`
    );
    toast.info("Link copied", {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  //Delete the property for the corresponding property id(i.e. pid)
  const handleDelete = async (e, value) => {
    e.stopPropagation();
    if (
      window.confirm("Are you sure you want to delete this property?") === true
    ) {
      axios
        .get("/deleteProperty", { params: { pid: value } })
        .then((res) => {
          toast.success(res.data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setBookmark((prev) => prev + 1);
        })
        .catch((err) => {
          toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        });
    }
  };

  //Set the page number on pagination and set it in the url
  const handlePage = (event, value) => {
    searchParams.set("page", value);
    setSearchParams(searchParams);
    setPage(value);
  };

  return (
    <div className={styles.box}>
      <div className={styles.container}>
        {data.length ? (
          data.map((item) => (
            <Card className={styles.card}>
              <div className={styles.carouselBox}>
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
                <Card.Subtitle className="mb-2 text-muted">
                  {!item.sale && formatter.format(item.price / 4) + " pcw"}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  <div className={styles.subtitle}>
                    <div className={styles.divider}>
                      <div className={styles.headline}>{item.headline}</div>

                      <div className={styles.link}>
                        <FaLink
                          size={25}
                          onClick={(e) => handleCopy(e, item.pid)}
                        />
                      </div>
                    </div>
                    {data.listedProperties ? (
                      <div className={styles.divider}>
                        <div className={styles.property_type}>
                          {item.property_type}
                        </div>
                        <div className={styles.delink}>
                          <FaTrashAlt
                            size={25}
                            onClick={(e) => handleDelete(e, item.pid)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className={styles.property_type}>
                        {item.property_type}
                      </div>
                    )}
                    <div className={styles.divider}>
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
                      <div className={styles.details}>
                        <div className={styles.ind_details}>
                          <FaRegStar size={20} className={styles.star} />
                          {item.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Subtitle>
                <Card.Text className={styles.address}>
                  {item.address_line1}, {item.town}{" "}
                  {item.postcode.split(" ")[0]}
                </Card.Text>
                <Card.Text className={styles.decription}>
                  {item.description && item.description.length < 200
                    ? item.description
                    : item.description
                    ? item.description.substring(0, 200) + "..."
                    : "No description available."}
                </Card.Text>
              </Card.Body>
            </Card>
          ))
        ) : (
          <>
            <div></div>
            <div className={styles.noProperty}>
              No properties found for applied filter on current page
            </div>
          </>
        )}
      </div>
      <div className={styles.pagination}>
        <Pagination
          //count is the total number of pages
          count={count}
          color="primary"
          onChange={handlePage}
          page={page}
        />
      </div>
    </div>
  );
};

export default Cards;
