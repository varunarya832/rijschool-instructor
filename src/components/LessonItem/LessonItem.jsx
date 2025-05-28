import React from 'react'
import { FiChevronRight, FiVideo } from 'react-icons/fi'
import styles from './LessonItem.module.css'

const LessonItem = ({ lesson, isActive, onClick }) => {
  console.log(lesson);
  const date = new Date(lesson.date);
  const start = new Date(lesson.start);
  const end = new Date(lesson.end);

  const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${String(date.getFullYear()).slice(-2)}`;
  const startStr = start.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Europe/Paris' // CEST

  });
  const endStr = end.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Europe/Paris' // CEST

  });

  return (
    <div
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <div className={styles.info}>
        <div className={styles.date}>Les van {dateStr}</div>
        <div className={styles.time}>{startStr} – {endStr}</div>
      </div>

      <div className={styles.meta}>
        <div className={styles.videos}>
          <FiVideo size={16} className={styles.videoIcon} />
          <span>{lesson.videos}</span>
        </div>
        <FiChevronRight size={20} className={styles.arrow} />
      </div>
    </div>
  )
}

export default LessonItem
