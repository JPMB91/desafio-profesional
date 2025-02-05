import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoContainer}>
        <img className={styles.logo} src="/src/assets/images/logo_placeholder.png" alt="Company Logo"  />
        <span className={styles.slogan}>Lema de la empresa</span>
      </Link>
      <nav className={styles.buttonsContainer}>
        <button className={styles.button}>Crear Cuenta</button>
        <button className={styles.button}>Iniciar sesión</button>
      </nav>
    </header>
  );
};
