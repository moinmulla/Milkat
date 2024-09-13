import { useContext } from "react";
import Cookies from "js-cookie";
import Carousel from "../../components/carousel/Carousel";
import SearchBar from "../../components/searchbar/SearchBar";
import Chart1 from "../../components/charts/Chart1";
import Reviews from "../../components/reviews/Reviews";
import { LoginContext } from "../../hooks/LoginContext";
import styles from "./home.module.scss";
import "../../fonts/Relieve.ttf";

function Home() {
  const { clearData } = useContext(LoginContext);

  if (Cookies.get("token") == undefined) {
    clearData();
  }

  const reviewsContent = [
    {
      rating: "⭐⭐⭐⭐⭐",
      caption: "Adam Patel",
      review:
        "I’ve been using this property search website for a few months now, and it has been an absolute game-changer! The interface is user-friendly, and I love the advanced filters that let me narrow down options by price, location, and number of rooms. This has made house hunting so much easier! Highly recommended for anyone looking for their next home.",
    },
    {
      rating: "⭐⭐⭐",
      caption: "Smith Johnson",
      review:
        "The website is good overall, but there are some areas for improvement. While the design is clean and the listings are generally accurate, I’ve noticed that the loading times for certain pages can be quite slow, especially when viewing multiple photos. Despite this issue, it’s still one of the better property search tools available, and I will continue using it.",
    },
    {
      rating: "⭐⭐⭐⭐",
      caption: "Jane Doe",
      review:
        "I found my dream apartment using this property search app, and I couldn’t be happier! The variety of listings is impressive, and I love how frequently the database is updated with new properties. If you’re in the market for a new home, this site is a must-use!",
    },
    {
      rating: "⭐⭐⭐⭐",
      caption: "John Smith",
      review:
        "I’ve tried several property search websites, but this one stands out for its ease of use and detailed search features. The ability to filter by so many criteria—like pet-friendly, parking spaces, and proximity to public transport—made my search fast and efficient. The images are clear and provide a great sense of what the property looks like. Definitely a go-to tool for anyone searching for properties!",
    },
  ];

  return (
    <div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <div className={styles.heading}>
              <span className={styles.headingText}>
                Welcome to <span className={styles.highlight}>Milkat</span>,
                <br />
              </span>
            </div>
            <div className={styles.subheading}>
              A best place to find your dream home. A property search made easy.
              Making home search hassle-free. Find the best house for you.
            </div>
          </div>
          <div className={styles.carousel}>{<Carousel />}</div>
        </div>
        <div className={styles.search}>
          <SearchBar />
        </div>
        <div className={styles.chart}>
          <p>House Price Trend</p>
          <Chart1 />
        </div>
        <div className={styles.reviews}>
          <p>Reviews</p>
          <div className={styles.eachReviews}>
            {reviewsContent.map((each, index) => (
              <Reviews key={index} {...each} />
            ))}
            {/* <Reviews />
            <Reviews />
            <Reviews />
            <Reviews /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
