
import React from 'react';
import styles from './Tabs.module.css';

const Tabs = ({ tabs, activeTab, onChange }) => (
  <nav className={styles.tabs}>
    {tabs.map(tab => (
      <button
        key={tab.key}
        className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
        onClick={() => onChange(tab.key)}
      >
        {tab.label}
      </button>
    ))}
  </nav>
);

export default Tabs;