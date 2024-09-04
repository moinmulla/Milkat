import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import axios from "../../utils/axios";
import Googlemaps from "../../components/googlemaps/Googlemaps";
import Nearby from "../../components/nearby/Nearby";
import Timeslot from "../../components/timeslot/Timeslot";
import { FaBath, FaRegStar } from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import { GiSofa } from "react-icons/gi";
import { CiCircleInfo } from "react-icons/ci";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import { LoginContext } from "../../hooks/LoginContext";
import styles from "./property.module.scss";

const Property = () => {
  const { pid } = useParams();

  //get the role of the user from the global context(i.e. loginContext)
  const { role } = useContext(LoginContext);

  //used to confirm if the user has confirmed their booking for a time slot and update the state which helps to update the whole data of property(i.e. selected time slot will no longer appear in the list of time slots)
  const [isConfirmed, setIsConfirmed] = useState(false);

  //used to store the selected time slot
  const [selectedSlot, setSelectedSlot] = useState(null);

  //stores list of time slots selected by the admin of the property
  const [timeSlots, setTimeSlots] = useState([]);

  //used to know whether the user has bookmarked the property or not
  const [saved, setSaved] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [ratings, setRatings] = useState(0);

  // Format price into GBP
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

  // Handle selecting and unselecting a time slot
  const handleSelect = (slot) => {
    if (selectedSlot === slot) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  // Handle confirming the selection
  const handleConfirm = () => {
    if (selectedSlot) {
      //check whether the user is logged in or not
      if (Cookies.get("token") === undefined) {
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
            timeslots: data.time_slots.filter(
              (slot) => slot.tid === selectedSlot.tid
            ),
          })
          .then((res) => {
            setIsConfirmed(false);
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
    } else {
      alert("Please select a time slot first.");
    }
  };

  // Handle bookmarking the property
  const handleSave = () => {
    //check whether the user is logged in or not
    if (Cookies.get("token") === undefined) {
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

  //Handle unbookmarking of the property
  const handleUnsave = () => {
    //check whether the user is logged in or not
    if (Cookies.get("token") === undefined) {
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
    //check whether the user is logged in or not
    if (Cookies.get("token") !== undefined) {
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

  const handleRating = (num) => {
    //check whether the user is logged in or not
    if (Cookies.get("token") !== undefined) {
      setRatings(1);
      axios
        .get("/rating", { params: { pid: pid, rating: num } })
        .then((res) => {
          setRatings(0);
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
    //fetch property details
    const fetchData = async () => {
      await axios
        .get(`/property/${pid}`)
        .then((res) => {
          setData(res.data.property[0]);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    };

    //check whether the property is bookmarked or not
    const fetchSavedProperties = async () => {
      await axios
        .post("/saved", { pid: pid })
        .then((res) => {
          setSaved(res.data.message);
        })
        .catch((err) => {
          setSaved(false);
        });
    };

    fetchData();

    //fetch the data to check whether the property is bookmarked or not, until the user is logged in
    if (Cookies.get("token") !== undefined) {
      fetchSavedProperties();
    }
  }, [ratings, isConfirmed]);

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

              <div className={styles.amountContainer}>
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
              <div className={styles.indDetails} title="Reception">
                <GiSofa size={30} className={styles.icon} />
                <div className={styles.detailsText}>
                  {data.reception} Reception
                </div>
              </div>
              <div className={styles.indDetails} title="Bedroom">
                <IoBed size={30} className={styles.icon} />
                <div className={styles.detailsText}>
                  {data.bedroom} Bedrooms
                </div>
              </div>
              <div className={styles.indDetails} title="Bathroom">
                <FaBath size={30} className={styles.icon} />
                <div className={styles.detailsText}>
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
              {data.time_slots && data.time_slots[0].anytime ? (
                <div className={styles.anytimeDetails}>
                  <div className={styles.anytime}>
                    Email address of the owner is given below, please contact
                    personally
                  </div>
                  <span className={styles.email}>
                    <a href={`mailto:${data.email}`}>{data.email}</a>
                  </span>
                </div>
              ) : (
                <div className={styles.timeSlotsContainer}>
                  <div className={styles.timeSlotsTitle}>
                    <CiCircleInfo className={styles.infoIcon} />
                    Select time slot for veiwing the property
                  </div>
                  <div className={styles.timeSlots}>
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
                      <div className={styles.noSlots}>
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
                  <div className={styles.adminTimeSlots}>
                    <Timeslot
                      timeSlots={timeSlots}
                      setTimeSlots={setTimeSlots}
                      className={styles.adminTimeslot}
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
                <div className={styles.subTitle}>
                  <CiCircleInfo className={styles.infoIcon} />
                  This information might not be up-to-date
                </div>
              </div>
              <Nearby location={data.location} />
            </div>

            <hr />
            <div className={styles.ratings}>
              <div>
                <span className={styles.title}>Ratings</span>
              </div>
              <div className={styles.ratingDetails}>
                <span className={styles.rating}>
                  Current ratings: {data.rating}
                </span>
              </div>
              <div className={styles.stars}>
                <FaRegStar
                  size={30}
                  className={styles.star}
                  onClick={() => handleRating(5)}
                />
                <FaRegStar
                  size={30}
                  className={styles.star}
                  onClick={() => handleRating(4)}
                />
                <FaRegStar
                  size={30}
                  className={styles.star}
                  onClick={() => handleRating(3)}
                />
                <FaRegStar
                  size={30}
                  className={styles.star}
                  onClick={() => handleRating(2)}
                />
                <FaRegStar
                  size={30}
                  className={styles.star}
                  onClick={() => handleRating(1)}
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
