import React, { useEffect, useState, useContext } from "react";
import { Carousel } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "../../utils/axios";
import Googlemaps from "../../components/googlemaps/Googlemaps";
import Nearby from "../../components/nearby/Nearby";
import { FaBath, FaRegStar } from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import { GiSofa } from "react-icons/gi";
import { CiCircleInfo } from "react-icons/ci";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import Timeslot from "../../components/timeslot/Timeslot";
import { LoginContext } from "../../hooks/LoginContext";
import styles from "./property.module.scss";

const Property = () => {
  const { pid } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [saved, setSaved] = useState(false);
  const [value, setValue] = useState(0);
  const { role } = useContext(LoginContext);
  const [admin, setAdmin] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  let maps_props;

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
        toast.info("Booking under process", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
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

  const handleSave = () => {
    if (!document.cookie) {
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
      axios
        .post("/save", { pid: pid })
        .then((res) => {
          setSaved(true);
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
          //   forceUpdate();
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

  const handleUnsave = () => {
    if (!document.cookie) {
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
      axios
        .post("/unsave", { pid: pid })
        .then((res) => {
          setSaved(false);
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
          //   forceUpdate();
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

  const handleTimeSlots = () => {
    if (timeSlots.length === 0) {
      toast.error("Please select atleast one time slot", {
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
      if (
        window.confirm(
          "Are you sure you want to add time slots to this property?"
        ) === true
      ) {
        axios
          .post("/timeslot", { timeslots: timeSlots, pid: pid })
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
            setTimeSlots([]);
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
    }
  };

  const handleReview = (num) => {
    if (document.cookie) {
      axios
        .get("/rating", { params: { pid: pid, rating: num } })
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
        })
        .catch((err) => {
          console.log(err);
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
    } else {
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
    }
  };

  useEffect(() => {
    const fetch_data = async () => {
      await axios
        .get(`/property/${pid}`)
        .then((res) => {
          maps_props = {
            location: res.data.property[0].location,
            address: res.data.property[0].address_line1,
          };
          setData(res.data.property[0]);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    };

    const fetch_saved_properties = async () => {
      await axios
        .post("/saved", { pid: pid })
        .then((res) => {
          console.log(res.data.message);
          setSaved(res.data.message);
          console.log(data);
          //   setSavedProperties(res.data.saved_properties);
        })
        .catch((err) => {
          setSaved(false);
        });
    };

    fetch_data();

    if (document.cookie) {
      fetch_saved_properties();
    }
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      if (role === "admin") {
        const secret_key = process.env.REACT_APP_SECRET_KEY || "secret_key";
        const cookie_value = decodeURIComponent(document.cookie);

        const temp_token = cookie_value.match(new RegExp("token=([^;]+)"));

        if (temp_token) {
          const bytes = CryptoJS.AES.decrypt(temp_token[1], secret_key);
          const decrypted_token = bytes.toString(CryptoJS.enc.Utf8);

          const role1 = decrypted_token.match(new RegExp("role=([^;]+)"));
          const email1 = decrypted_token.match(new RegExp("email=([^;]+)"));

          if (role1 && email1) {
            const role2 = role1[1];
            const email = email1[1];

            if (role2 === "admin" && email === data.email) {
              setAdmin(true);
            }
          }
        }
      }
    };

    checkAdmin();
  }, [role, data.email]);

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
                {saved ? (
                  <FaBookmark
                    size={30}
                    className={styles.bookmark}
                    onClick={handleUnsave}
                  />
                ) : (
                  <FaRegBookmark
                    size={30}
                    className={styles.bookmark}
                    onClick={handleSave}
                  />
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
                <GiSofa size={30} className={styles.icon} />
                <div className={styles.details_text}>
                  {data.reception} Reception
                </div>
              </div>
              <div className={styles.ind_details} title="Bedroom">
                <IoBed size={30} className={styles.icon} />
                <div className={styles.details_text}>
                  {/* {" "} */}
                  {data.bedroom} Bedrooms
                </div>
              </div>
              <div className={styles.ind_details} title="Bathroom">
                <FaBath size={30} className={styles.icon} />
                <div className={styles.details_text}>
                  {data.bathroom} Bathrooms
                </div>
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
              {data.time_slots && data.time_slots[0].anytime ? (
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
                      <>
                        <div className={styles.time_slots_list}>
                          {data.time_slots.map((time, index) => (
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
                              {new Date(time.start_time).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                              -
                              {new Date(time.end_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={handleConfirm}
                          disabled={!selectedSlot ? true : null}
                        >
                          Confirm Selection
                        </Button>
                      </>
                    ) : (
                      <div className={styles.no_slots}>
                        <i>
                          All time slots are either booked or expired for this
                          property
                        </i>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div>
                {admin ? (
                  <div className={styles.admin_time_slots}>
                    <Timeslot
                      timeSlots={timeSlots}
                      setTimeSlots={setTimeSlots}
                      className={styles.admin_timeslot}
                    />
                    <Button onClick={handleTimeSlots} className={styles.button}>
                      Confirm Selection
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>

            <hr />
            <div>
              <div className={styles.nearby}>
                <span className={styles.title}>
                  Nearby places within 1 mile of area
                </span>
                <div className={styles.sub_title}>
                  <CiCircleInfo className={styles.info_icon} />
                  This information might not be up-to-date
                </div>
              </div>
              <Nearby location={data.location} />
            </div>

            <hr />
            <div className={styles.reviews}>
              <div>
                <span className={styles.title}>Ratings</span>
              </div>
              <div className={styles.rating_details}>
                <span className={styles.rating}>
                  Current ratings: {data.rating}
                </span>
              </div>
              <div className={styles.stars}>
                <FaRegStar
                  size={30}
                  className={styles.star}
                  onClick={() => handleReview(5)}
                />
                <FaRegStar
                  size={30}
                  className={styles.star}
                  onClick={() => handleReview(4)}
                />
                <FaRegStar
                  size={30}
                  className={styles.star}
                  onClick={() => handleReview(3)}
                />
                <FaRegStar
                  size={30}
                  className={styles.star}
                  onClick={() => handleReview(2)}
                />
                <FaRegStar
                  size={30}
                  className={styles.star}
                  onClick={() => handleReview(1)}
                />
              </div>
            </div>

            <hr />
            <div>
              <Googlemaps
                props={{ address: data.address_line1, location: data.location }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Property;
