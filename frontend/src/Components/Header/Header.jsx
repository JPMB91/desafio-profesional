import { Link } from "react-router-dom";
import styles from "./Header.module.css";


export const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoContainer}>
        <img className={styles.logo} src="/src/assets/images/logo.png" alt="Logo Aurora Motors"  />
        <span className={styles.slogan}>Muevete con Confianza</span>
      </Link>
      <nav className={styles.buttonsContainer}>
        <Link to={"/register"}>
        <button className={styles.button}>Crear Cuenta</button>
        </Link>
        <Link to={"/login"}>
        <button className={styles.button}>Iniciar sesión</button>
        </Link>
        
      </nav>
    </header>
  );
};
