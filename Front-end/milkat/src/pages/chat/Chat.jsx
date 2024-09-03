import { useRef, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import styles from "./chat.module.scss";

function Chat() {
  const formikRef = useRef();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterPostcode, setFilterPostcode] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const initialValues = {
    postcode: "",
    comments: "",
  };

  const validationSchema = Yup.object().shape({
    postcode: Yup.string()
      .required("Required")
      .matches(
        /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/,
        "Enter a valid postcode"
      ),
    comments: Yup.string()
      .required("Required")
      .min(10, "Must be at least 10 characters")
      .max(500, "Must be 500 characters or less"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form data:", values);
    setOpen(true);
    axios
      .post("/chat", values)
      .then((res) => {
        setOpen(false);
        console.log(res);
        setSubmitting(false);
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
  };

  useEffect(() => {
    axios.get("/chat_lookup").then((res) => {
      console.log(res.data.message);
      setData(res.data.message);
      setFilteredData(res.data.message);
    });
  }, [open]);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterPostcode(value);

    const filtered = data.filter((item) =>
      item.postcode.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <span className={styles.fancy}>Open Chat System</span>
      </div>
      <div className={styles.content}>
        <Formik
          initialValues={initialValues}
          innerRef={formikRef}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className={styles.form_group}>
                <div className={styles.label_group}>
                  <label htmlfor="postcode" className={styles.label}>
                    Postcode:
                  </label>
                  <Field
                    id="postcode"
                    type="text"
                    name="postcode"
                    placeholder="Enter postcode"
                  />
                </div>
                <ErrorMessage
                  name="postcode"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.form_group}>
                <Field
                  id="comments"
                  type="text"
                  name="comments"
                  placeholder="Enter your comments here"
                  // value={formikRef.current.values.comments}
                />
                <ErrorMessage
                  name="comments"
                  component="div"
                  className={styles.error}
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
      <div className={styles.filter}>
        <label htmlfor="postcode" className={styles.label}>
          Filter by postcode:
        </label>
        <input
          type="text"
          placeholder="Filter by postcode"
          value={filterPostcode}
          onChange={handleFilterChange}
          className={styles.filterInput}
        />
      </div>
      <div className={styles.data}>
        {filteredData
          ? filteredData.map((item) => (
              <div key={item.id}>
                <div className={styles.chat}>
                  <p>Name: {item.name}</p>
                  <p>Postcode: {item.postcode}</p>
                  <p>Comment: {item.comment}</p>
                </div>
              </div>
            ))
          : "No data available"}
        {/* {data && <div>{data[0].name}</div>} */}
      </div>
    </div>
  );
}

export default Chat;
