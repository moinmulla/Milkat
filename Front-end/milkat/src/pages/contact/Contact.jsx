import React, { useEffect } from "react";
import styles from "./contact.module.scss";

function Contact() {
  useEffect(() => {
    const script = document.createElement("script");

    //external script link to show the contact page
    script.src = "https://static-bundles.visme.co/forms/vismeforms-embed.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div
        class="visme_d"
        data-title="Untitled Project"
        data-url="pvpznq4w-untitled-project"
        data-domain="forms"
        data-full-page="false"
        data-min-height="500px"
        data-form-id="81945"
      ></div>
    </div>
  );
}

export default Contact;
