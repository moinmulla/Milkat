import React, { useRef, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Timeslot from "../../components/timeslot/Timeslot";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaBath } from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import { GiSofa } from "react-icons/gi";
import { FaPoundSign } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";
import styles from "./listup.module.scss";

function ListUp() {
  const formikRef = useRef();

  const [timeSlots, setTimeSlots] = useState([]);
  const [anytimeBox, setAnytimeBox] = useState(true);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const [postcode, setPostcode] = useState("");
  const [data, setData] = useState(null);

  const initialValues = {
    headline: "",
    description: "",
    property_type: "",
    price: "",
    images: [],
    bathroom: "",
    bedroom: "",
    reception: "",
    postcode: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    town: "",
    // door_number: "",
    location: "",
  };

  const validationSchema = Yup.object().shape({
    headline: Yup.string()
      .required("Required")
      .min(10, "Must be at least 10 characters")
      .max(30, "Must be 30 characters or less"),
    description: Yup.string()
      .required("Required")
      .min(10, "Must be at least 10 characters")
      .max(200, "Must be 200 characters or less"),
    property_type: Yup.string().required("Required"),
    price: Yup.string().required("Required"),
    images: Yup.array()
      .required("Required")
      .min(1, "Must have at least 1 image"),
    bathroom: Yup.string().required("Required"),
    bedroom: Yup.string().required("Required"),
    reception: Yup.string().required("Required"),
    postcode: Yup.string()
      .required("Required")
      .matches(
        /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/,
        "Enter a valid postcode to get proper address"
      ),
    address_line1: Yup.string().required("Required"),
    town: Yup.string()
      .required("Required")
      .matches(
        /^[^\W\d_]+\.?(?:[-\s][^\W\d_]+\.?)*$/,
        "Must be a valid street name"
      ),
    // door_number: Yup.string().required("Required"),
    location: Yup.string().matches(
      /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/,
      "Must be a valid latitude and longitude"
    ),
  });

  const handleImage = (e) => {
    const files = Array.from(e.currentTarget.files);
    formikRef.current.setFieldValue("images", [
      ...formikRef.current.values.images,
      ...files,
    ]);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form data:", values);
    // console.log(timeSlots);

    // const time_slots_data = new

    let modified_values = {};
    if (timeSlots.length > 0) {
      modified_values = {
        ...values,
        time_slots: JSON.stringify(timeSlots),
      };
    } else {
      setAnytimeBox(false);
      modified_values = {
        ...values,
        time_slots: [],
      };
    }

    let images = values.images;

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    for (let key in modified_values) {
      formData.append(key, modified_values[key]);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    axios
      .post("/listup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        toast.success("Property listed successfully", {
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
      .catch((error) => {
        toast.error(error.response.data.message, {
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

    setSubmitting(false);
  };

  const handleSelect = async (e) => {
    setPostcode("");
    await console.log(e.target.value);
    axios
      .post("/postcode_address", { url: e.target.value })
      .then((res) => {
        console.log(res.data);
        const message = res.data.message;
        if (formikRef.current) {
          formikRef.current.setFieldValue("postcode", message.postcode);
          formikRef.current.setFieldValue("town", message.town_or_city);
          formikRef.current.setFieldValue("address_line1", message.line_1);
          formikRef.current.setFieldValue(
            "address_line2",
            message.line_2 || ""
          );
          formikRef.current.setFieldValue(
            "address_line3",
            message.line_3 || ""
          );
          formikRef.current.setFieldValue(
            "location",
            `${message.latitude},${message.longitude}`
          );

          // Trigger form validation
          // formikRef.validateForm();
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading state
      });
  };

  useEffect(() => {
    const loadData = async () => {
      await axios
        .post("/postcode", { postcode: debouncedSearch })
        .then((res) => {
          setLoading(true);
          setPostcode(res.data.message);
        })
        .catch((error) => {
          console.log(error);
          // setPostcode({ success: false, message: "Error fetching data" });
        });

      setLoading(false);
    };
    loadData();
  }, [debouncedSearch]);

  return (
    <div className={styles.container}>
      <div className={styles.heading_container}>
        <div className={styles.heading}>
          <span className={styles.fancy}>List up your property</span>
        </div>
        <div className={styles.content}>
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, handleChange }) => (
              <Form className="form">
                <div className={styles.formGroup}>
                  <label htmlFor="headline" className={styles.label}>
                    Headline*
                  </label>
                  <Field
                    type="text"
                    id="headline"
                    name="headline"
                    placeholder="Enter headline"
                  />
                  <ErrorMessage
                    name="headline"
                    className={styles.error}
                    component="div"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="description" className={styles.label}>
                    Description*
                  </label>
                  <Field
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Enter description"
                  />
                  <ErrorMessage
                    name="description"
                    className={styles.error}
                    component="div"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="images" className={styles.label}>
                    Images*
                  </label>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    placeholder="Select images or videos"
                    multiple
                    accept=".png, .jpg, .jpeg, .gif, .heic, .mp4, .mkv"
                    onChange={handleImage}
                  />
                  <ErrorMessage
                    name="images"
                    className={styles.error}
                    component="div"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="property_type" className={styles.label}>
                    Property Type*
                  </label>
                  <Field
                    component="select"
                    id="property_type"
                    name="property_type"
                    placeholder="Select property type"
                  >
                    <option value="" disabled selected>
                      Select property type
                    </option>
                    <option value="Bungalow">Bungalows</option>
                    <option value="Detached">Detached</option>
                    <option value="Semi-deteached">Semi-deteached</option>
                    <option value="Terraced">Terraced</option>
                    <option value="Flats">Flats</option>
                    <option value="Farms/land">Farms/land</option>
                  </Field>
                  <ErrorMessage
                    name="property_type"
                    className={styles.error}
                    component="div"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="price" className={styles.label}>
                    Price*
                  </label>
                  <div className={styles.inputGroup}>
                    <div className={styles.icon}>
                      <FaPoundSign size={20} />
                    </div>
                    <Field
                      type="number"
                      id="price"
                      name="price"
                      placeholder="Enter price"
                    />
                  </div>
                  <ErrorMessage
                    name="price"
                    className={styles.error}
                    component="div"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="bathroom" className={styles.label}>
                    Bathroom*
                  </label>
                  <div className={styles.inputGroup}>
                    <div className={styles.icon}>
                      <FaBath size={20} />
                    </div>
                    <Field
                      type="number"
                      id="bathroom"
                      name="bathroom"
                      placeholder="Enter number of bathroom"
                    />
                  </div>
                  <ErrorMessage
                    name="bathroom"
                    className={styles.error}
                    component="div"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="bedroom" className={styles.label}>
                    Bedroom*
                  </label>
                  <div className={styles.inputGroup}>
                    <div className={styles.icon}>
                      <IoBed size={20} />
                    </div>
                    <Field
                      type="number"
                      id="bedroom"
                      name="bedroom"
                      placeholder="Enter number of bedroom"
                    />
                  </div>
                  <ErrorMessage
                    name="bedroom"
                    className={styles.error}
                    component="div"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="reception" className={styles.label}>
                    Reception*
                  </label>
                  <div className={styles.inputGroup}>
                    <div className={styles.icon}>
                      <GiSofa size={20} />
                    </div>
                    <Field
                      type="number"
                      id="reception"
                      name="reception"
                      placeholder="Enter number of reception"
                    />
                  </div>
                  <ErrorMessage
                    name="reception"
                    className={styles.error}
                    component="div"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="postcode" className={styles.label}>
                    Postcode*
                  </label>
                  <Field
                    type="text"
                    id="postcode"
                    name="postcode"
                    placeholder="Enter postcode"
                    onChange={(e) => {
                      handleChange(e);
                      setSearch(e.target.value);
                    }}
                  />
                  <ErrorMessage
                    name="postcode"
                    className={styles.error}
                    component="div"
                  />

                  {loading && <div className={styles.loading}>Loading...</div>}
                  {postcode?.suggestions && (
                    <select
                      id="data"
                      className={styles.postcodes}
                      onChange={handleSelect}
                    >
                      {postcode?.suggestions?.map((item) => (
                        <option
                          className={styles.postcode}
                          key={item.id}
                          value={item.url}
                        >
                          {item.address}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="address_line1" className={styles.label}>
                    Address line 1*
                  </label>
                  <Field
                    type="text"
                    id="address_line1"
                    name="address_line1"
                    placeholder="Enter address line 1"
                  />
                  <ErrorMessage
                    name="address_line1"
                    className={styles.error}
                    component="div"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="address_line2" className={styles.label}>
                    Address line 2
                  </label>
                  <Field
                    type="text"
                    id="address_line2"
                    name="address_line2"
                    placeholder="Enter address line 2"
                  />
                  <ErrorMessage
                    name="address_line2"
                    className={styles.error}
                    component="div"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="address_line3" className={styles.label}>
                    Address line 3
                  </label>
                  <Field
                    type="text"
                    id="address_line3"
                    name="address_line3"
                    placeholder="Enter address line 3"
                  />
                  <ErrorMessage
                    name="address_line3"
                    className={styles.error}
                    component="div"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="town" className={styles.label}>
                    Town*
                  </label>
                  <Field
                    type="text"
                    id="town"
                    name="town"
                    placeholder="Enter street name"
                  />
                  <ErrorMessage
                    name="town"
                    className={styles.error}
                    component="div"
                  />
                </div>
                <div className={styles.formGroup} style={{ display: "none" }}>
                  <label htmlFor="location" className={styles.label}>
                    Location
                  </label>
                  <div className={styles.inputGroup}>
                    <div className={styles.icon}>
                      <MdLocationOn size={20} />
                    </div>
                    <Field
                      type="text"
                      id="location"
                      name="location"
                      placeholder="Enter latitude and longitude(e.g. 1.3521, 103.8198)"
                    />
                  </div>
                  <ErrorMessage
                    name="location"
                    className={styles.error}
                    component="div"
                  />
                </div>
                <div className={styles.timeslot}>
                  <label htmlFor="timeslot" className={styles.label}>
                    Time Slot
                  </label>
                  {anytimeBox ? (
                    <Timeslot
                      timeSlots={timeSlots}
                      setTimeSlots={setTimeSlots}
                    />
                  ) : (
                    <p className={styles.warning}>
                      **Your email address will be shared with the property so
                      that buyer/tenant can contact you
                    </p>
                  )}
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="error"
                          onChange={(e) => setAnytimeBox(!e.target.checked)}
                        />
                      }
                      label="Anytime"
                      className={styles.anytime_checkbox}
                    />
                  </FormGroup>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.button}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default ListUp;
