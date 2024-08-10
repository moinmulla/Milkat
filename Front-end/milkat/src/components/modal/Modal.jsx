import React, { useRef, useEffect, useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SignUp from "../signUp/SignUp";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { IoCloseOutline } from "react-icons/io5";
import styles from "./modal.module.scss";
import "react-toastify/dist/ReactToastify.css";

function Modal({ modal, setModal }) {
  const [signIn, setSignIn] = useState(true);
  const toggleModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    if (modal) {
      document.body.style.overflowY = "hidden";
    }

    return () => {
      document.body.style.overflowY = "";
    };
  }, [modal]);

  const formikRef = useRef();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Required")
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email address"),
    password: Yup.string()
      .required("Required")
      .min(8, "Must be at least 8 characters")
      .max(20, "Must be 20 characters or less")
      .matches(
        /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/,
        "Must Contain One Uppercase, One Lowercase, One Number and one special case Character"
      ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form data:", values);

    axios
      .post("/login", values)
      .then((res) => {
        toast.success("Logged in successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setModal(false);
      })
      .catch((error) => {
        let message = error.response
          ? error.response.data.message
          : "Something went wrong";
        toast.error(message, {
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

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div onClick={toggleModal} className={styles.overlay}></div>
        <div className={styles.modalContent}>
          {signIn ? (
            <div className={styles.signIn}>
              <h2>Sign in</h2>
              <p className={styles.description}>
                Enter your email and password
              </p>

              <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="form">
                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.label}>
                        Email Address
                      </label>
                      <Field
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Enter your email address"
                      />
                      <ErrorMessage
                        name="email"
                        className={styles.error}
                        component="div"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="password" className={styles.label}>
                        Password
                      </label>
                      <Field
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                      />
                      <ErrorMessage
                        name="password"
                        className={styles.error}
                        component="div"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={styles.button}
                      >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              <p className={styles.anotherAcc} onClick={() => setSignIn(false)}>
                Don't have an account? Register Now
              </p>
            </div>
          ) : (
            <SignUp signIn={signIn} setSignIn={setSignIn} />
          )}
          <hr />
          <div className={styles.google}>
            <button type="button" className={styles.loginWithGoogleBtn}>
              Sign in with Google
            </button>
          </div>
          <button className={styles.closeModal} onClick={toggleModal}>
            <IoCloseOutline />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
