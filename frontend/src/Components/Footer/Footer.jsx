import styles from "./Footer.module.css"

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.logoContainer}>
        <img src="src\assets\images\logo.png" alt="Aurora Motors logo" className={styles.logo} />
        <span className={styles.slogan}>©2025 Aurora Motors</span>
      </div>
    </div>
  )
}
