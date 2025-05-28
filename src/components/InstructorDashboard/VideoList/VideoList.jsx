import React from 'react';
import styles from './VideoList.module.css';

export default function VideoList({ videos, onView, onLink }) {
  if (videos.length === 0) {
    return <p>Geen ongekoppelde video's</p>;
  }

  const formatDutchDate = dateStr => {
    const date = new Date(dateStr);
    const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    const formattedDate = date.toLocaleDateString('nl-NL', optionsDate);
    const formattedTime = date.toLocaleTimeString('nl-NL', optionsTime);
    return `${formattedDate} om ${formattedTime}`;
  };

  return (
    <ul className={styles.list}>
      {videos.map(v => (
        <li key={v.id} className={styles.item}>
          <span>{formatDutchDate(v.date)}</span>
          <div className={styles.buttons}>
            <button
              className={styles.viewBtn}
              onClick={() => onView(v.id)}
            >
              Bekijken
            </button>
            <button
              className={styles.linkBtn}
              onClick={() => onLink(v.id)}
            >
              Koppelen aan huidige les
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
