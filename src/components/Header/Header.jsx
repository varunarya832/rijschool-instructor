import React from 'react';
import styles from './Header.module.css';
import { FiLogOut } from 'react-icons/fi';

const Header = ({ title, onLogout }) => (
  <header className={styles.header}>
    <h1 className={styles.title}>{title}</h1>
    <button className={styles.logout} onClick={onLogout}>
      <FiLogOut size={18} style={{ marginRight: '8px' }} />
      Uitloggen
    </button>
  </header>
);

export default Header;
