import Carousel from 'react-bootstrap/Carousel';
import styles from "./carousel.module.scss";

function DarkVariantExample() {
  return (
    <Carousel data-bs-theme="light" className={styles.carousel}>
      <Carousel.Item>
        <img
          className={`d-block w-100 ${styles.img}`}
          src="https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?cs=tinysrgb&w=600"
          alt="First slide"
          height="300px"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className={`d-block w-100 ${styles.img}`}
          src="https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?cs=tinysrgb&w=600"
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className={`d-block w-100 ${styles.img} `}
          src="https://images.pexels.com/photos/277667/pexels-photo-277667.jpeg?cs=tinysrgb&w=600"
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default DarkVariantExample;