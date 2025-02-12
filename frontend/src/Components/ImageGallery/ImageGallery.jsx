import styles from "./ImageGallery.module.css";

export const ImageGallery = ({ images, close, showModal }) => {

  return showModal ? (
    <div className={styles.overlay} onClick={() =>{
      close()
    }}>
      <div className={styles.modal} >
        <button className={styles.closeButton} onClick={close}>
          ✖️
        </button>
        <div className={styles.modalGallery}>
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
  ) : null
}
