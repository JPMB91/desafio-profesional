import Proptypes from "prop-types";
import styles from "./ImageGallery.module.css";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const VehicleImageGallery = ({ images, close, showModal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const modalRef = useRef(null);

  const handleNextSlide = () => {
    setCurrentIndex((previndex) => (previndex + 1) % images.length);
  };

  const handlePrevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      close();
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, close]);

  useEffect(() => {
    if (showModal) {
      const timeInterval = setInterval(handleNextSlide, 3000);

      return () => clearInterval(timeInterval);
    }
  }, [showModal, handleNextSlide]);

  return showModal ? (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <button className={styles.closeButton} onClick={close}>
          ✖️
        </button>
        <button className={styles.prevButton} onClick={handlePrevSlide}>
          <ChevronLeft />
        </button>
        <div className={styles.modalGallery}>
          <img
            src={`http://localhost:8080/api/vehicles/uploads/${images[currentIndex].filename}`}
            alt={`Vehiculo ${currentIndex + 1}`}
          />
        </div>
        <button className={styles.nextButton} onClick={handleNextSlide}>
          <ChevronRight />
        </button>

        <div className={styles.dots}>
          {images.map((image, index) => (
            <span
              key={image.id}
              className={
                currentIndex === index ? styles.dot.active : styles.dot
              }
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  ) : null;
};

VehicleImageGallery.propTypes = {
  images: Proptypes.array.isRequired,
  close: Proptypes.func.isRequired,
  showModal: Proptypes.bool.isRequired,
};
