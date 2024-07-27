import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import styles from "./signUp.module.scss";
import { useNavigate } from "react-router-dom";

function SignUp({ signIn, setSignIn }) {
  const formikRef = useRef();

  const initialValues = {
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string()
      .required("Required")
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email address"),
    role: Yup.string().required("Required"),
    password: Yup.string()
      .required("Required")
      .min(8, "Must be at least 8 characters")
      .max(20, "Must be 20 characters or less")
      .matches(
        /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirmPassword: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form data:", values);

    axios
      .post("/register", values)
      .then((res) => {
        toast.success("Registered successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setSignIn(true);
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

  return (
    <div className={styles.container}>
      <div className={styles.signUp}>
        <h2>Register an account</h2>
        <p className={styles.description}>Enter your email and new password</p>

        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="form">
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Full name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                />
                <ErrorMessage
                  name="name"
                  className={styles.error}
                  component="div"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="role" className={styles.label}>
                  Select your role
                </label>
                <Field
                  as="select"
                  id="role"
                  name="role"
                  placeholder="Enter your full name"
                >
                  <option
                    value=""
                    disabled
                    selected
                    className="disabled_option"
                  >
                    Select your role
                  </option>
                  <option value="0">Tenant/Buyer</option>
                  <option value="1">Property Owner</option>
                </Field>
                <ErrorMessage
                  name="role"
                  className={styles.error}
                  component="div"
                />
              </div>
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
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm Password
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                />
                <ErrorMessage
                  name="confirmPassword"
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
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <p className={styles.anotherAcc} onClick={() => setSignIn(true)}>
          Already have an account? Sign in Now
        </p>
      </div>
    </div>
  );
}

export default SignUp;
