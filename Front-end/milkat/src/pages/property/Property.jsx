import React, { useEffect, useState, useReducer } from "react";
import { Carousel } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "../../utils/axios";
import { FaBath } from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import { GiSofa } from "react-icons/gi";
import { CiCircleInfo } from "react-icons/ci";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import styles from "./property.module.scss";

const Property = () => {
  const { pid } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [value, setValue] = useState(0);

  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumSignificantDigits: 20,
  });
  const days = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  // Handle selecting a time slot
  const handleSelect = (slot) => {
    if (selectedSlot === slot) {
      setSelectedSlot(null);
      setIsConfirmed(false);
    } else {
      setSelectedSlot(slot);
      setIsConfirmed(false); // Reset confirmation on reselect
    }
  };

  function forceUpdate() {
    window.location.reload();
  }
  // Handle confirming the selection
  const handleConfirm = () => {
    if (selectedSlot) {
      if (!document.cookie) {
        // console.log(document.cookie);
        toast.error("Please login first", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        setIsConfirmed(true);
        axios
          .post("/booking", {
            tid: selectedSlot.tid,
            email: data.email,
            time_slots: data.time_slots.filter(
              (slot) => slot.tid === selectedSlot.tid
            ),
          })
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
            forceUpdate();
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
      console.log("Selected slot:", selectedSlot.tid);
    } else {
      alert("Please select a time slot first.");
    }
  };

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

              <div className={styles.amount_container}>
                <span className={styles.amount}>
                  {formatter.format(data.price)} {!data.sale && "pcm"}
                </span>
                {data.saved_properties ? (
                  <FaBookmark size={30} className={styles.bookmark} />
                ) : (
                  <FaRegBookmark size={30} className={styles.bookmark} />
                )}
              </div>
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
            <div className={styles.address}>{data.property_type}</div>
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
              <span className={styles.title}>Description</span>
              <span className={styles.desc}>{data.description}</span>
            </div>
            <hr />
            <div className={styles.schedule}>
              <span className={styles.title}>Schedule</span>
              {/* <div>{data.time_slots[0] && data.time_slots[0].start_time}</div> */}
              {data.time_slots[0].anytime ? (
                <div className={styles.anytime_details}>
                  <div className={styles.anytime}>
                    Email address of the owner is given below, please contact
                    personally
                  </div>
                  <span className={styles.email}>
                    <a href={`mailto:${data.email}`}>{data.email}</a>
                  </span>
                </div>
              ) : (
                <div className={styles.time_slots_container}>
                  <div className={styles.time_slots_title}>
                    <CiCircleInfo className={styles.info_icon} />
                    Select time slot for veiwing the property
                  </div>
                  <div className={styles.time_slots}>
                    {data.time_slots ? (
                      data.time_slots.map((time, index) => (
                        <div
                          key={index}
                          className={styles.time_slot}
                          onClick={() => handleSelect(time)}
                          style={{
                            backgroundColor:
                              selectedSlot === time ? "lightblue" : "",
                          }}
                        >
                          {new Date(time.start_time).toLocaleDateString()}
                          {", "}
                          {days[new Date(time.start_time).getDay()]}
                          {": "}
                          {new Date(time.start_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          -
                          {new Date(time.end_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      ))
                    ) : (
                      <div className={styles.no_slots}>
                        All time slots are booked for this property
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedSlot ? true : null}
                  >
                    Confirm Selection
                  </Button>
                </div>
              )}
            </div>
          </div>

          <hr />
        </div>
      )}
    </>
  );
};

export default Property;
