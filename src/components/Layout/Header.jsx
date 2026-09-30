import {Container} from 'react-bootstrap';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.siteHeader}>
      <Container fluid className={styles.headerContainer}>
        <a className={styles.brand} href="/">
          El<span>.</span>Anzuelo
        </a>
        <p>Casa de pesca</p>
      </Container>
    </header>
  );
}

export default Header;
