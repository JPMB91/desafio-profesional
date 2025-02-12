import styles from "./ImageGallery.module.css";

export const ImageGallery = ({ images, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ✖️
        </button>
        <div className={styles.gallery}>
          {images.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:8080/api/vehicles/uploads/${img.filename}`}
              alt={`Vehiculo ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
