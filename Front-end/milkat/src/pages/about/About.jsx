import React from "react";
import styles from "./about.module.scss";

function About() {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <span className={styles.fancy}>About Us</span>
      </div>
      <div className={styles.content}>
        <div className={styles.image}>
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="image"
          />
        </div>
        <div className={styles.text}>
          Milkat. Your Trusted Partner in Finding the Perfect Home.
          <br />
          <br /> Hello! Welcome to Milkat, your ultimate property search
          platform. We understand that you're not just seeking a place to live –
          you're searching for a home. With over a million listings, we offer
          you a vast selection of properties to explore. Our advanced tools
          allow you to filter and find properties in various smart ways.
          Accurate and trustworthy price estimates ensure you never overpay.
          <br />
          <br />
          We offer powerful search tools to filter through thousands of
          listings, but we know home is more than just a set of features. It's
          that feeling when you walk through the door and think, 'This is it.'
          It's envisioning your furniture in the living room, imagining
          breakfast conversations in the kitchen, and picturing lazy Sundays in
          the backyard.
          <br />
          <br />
          Our goal isn't just to help you find a property - it's to help you
          find your place in the world. A place where you can truly belong. So
          let's start this adventure together. Your future home is out there,
          waiting to be discovered.
        </div>
      </div>
    </div>
  );
}

export default About;
