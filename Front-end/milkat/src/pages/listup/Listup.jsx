import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./listup.module.scss";

function ListUp() {
  const formikRef = useRef();

  const initialValues = {
    details: "",
    price: "",
    images: [],
    bathroom: "",
    bedroom: "",
    reception: "",
    location: "",
  };

  const validationSchema = Yup.object().shape({
    details: Yup.string()
      .required("Required")
      .min(10, "Must be at least 10 characters")
      .max(50, "Must be 50 characters or less"),
    price: Yup.string()
      .required("Required")
      .matches(/^\d+$/, "Must be a number"),
    images: Yup.array().required("Required").min(1, "Must have at least 1 image"),
    bathroom: Yup.string()
      .required("Required")
      .matches(/^\d+$/, "Must be a number"),
    bedroom: Yup.string()
      .required("Required")
      .matches(/^\d+$/, "Must be a number"),
    reception: Yup.string()
      .required("Required")
      .matches(/^\d+$/, "Must be a number"),
    location: Yup.string()
      .required("Required")
      .min(10, "Must be at least 10 characters")
      .max(50, "Must be 50 characters or less"),
  });

  const handleImage = (e) =>{
    const files = Array.from(e.currentTarget.files);
    formikRef.current.setFieldValue("images", [...formikRef.current.values.images, ...files]);
  }

  const handleSubmit = async (values, { setSubmitting }) => {
   

    // Simulate an API call
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form data:", values);

    // Don't forget to set submitting to false after the submission is done
    setSubmitting(false);
  };

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
            {({ isSubmitting }) => (
              <Form className="form">
                <div className={styles.formGroup}>
                  <label htmlFor="details" className={styles.label}>
                    Headline
                  </label>
                  <Field
                    type="text"
                    id="details"
                    name="details"
                    placeholder="Enter headline"
                  />
                  <ErrorMessage
                    name="details"
                    className="error"
                    component="div"
                    style={{ color: "red", fontSize: "1rem" }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="price" className={styles.label}>
                    Price
                  </label>
                  <Field
                    type="text"
                    id="price"
                    name="price"
                    placeholder="Enter price"
                  />
                  <ErrorMessage
                    name="price"
                    className="error"
                    component="div"
                    style={{ color: "red", fontSize: "1rem" }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="images" className={styles.label}>
                    Images
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
                    className="error"
                    component="div"
                    style={{ color: "red", fontSize: "1rem" }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="bathroom" className={styles.label}>
                    Bathroom
                  </label>
                  <Field
                    type="text"
                    id="bathroom"
                    name="bathroom"
                    placeholder="Enter number of bathroom"
                  />
                  <ErrorMessage
                    name="bathroom"
                    className="error"
                    component="div"
                    style={{ color: "red", fontSize: "1rem" }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="bedroom" className={styles.label}>
                    Bedroom
                  </label>
                  <Field
                    type="text"
                    id="bedroom"
                    name="bedroom"
                    placeholder="Enter number of bedroom"
                  />
                  <ErrorMessage
                    name="bedroom"
                    className="error"
                    component="div"
                    style={{ color: "red", fontSize: "1rem" }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="reception" className={styles.label}>
                    Reception
                  </label>
                  <Field
                    type="text"
                    id="reception"
                    name="reception"
                    placeholder="Enter number of reception"
                  />
                  <ErrorMessage
                    name="reception"
                    className="error"
                    component="div"
                    style={{ color: "red", fontSize: "1rem" }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="location" className={styles.label}>
                    Location
                  </label>
                  <Field
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Enter location"
                  />
                  <ErrorMessage
                    name="location"
                    className="error"
                    component="div"
                    style={{ color: "red", fontSize: "1rem" }}
                  />
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
