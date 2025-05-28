// src/components/InstructorDashboard/LessonDetail/LessonDetail.jsx
import React from 'react';
import styles from './LessonDetail.module.css';

export default function LessonDetail({ lesson, onStop, onUpload }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Geselecteerde Les</h2>
        <div className={styles.buttons}>
          <button className={styles.stopBtn} onClick={onStop}>
            Les Stoppen
          </button>
          <button className={styles.uploadBtn} onClick={onUpload}>
            Video Uploaden
          </button>
        </div>
      </div>
      <div className={styles.grid}>
        <div><strong>Leerling</strong><p>{lesson.studentName}</p></div>
        <div><strong>Datum</strong><p>{lesson.date}</p></div>
        <div><strong>Starttijd</strong><p>{lesson.startTime}</p></div>
        <div><strong>Eindtijd</strong><p>{lesson.endTime || 'Nog niet beëindigd'}</p></div>
      </div>
      <div className={styles.linked}>
        <strong>Gekoppelde Video’s</strong>
        {lesson.linkedVideos?.length > 0 ? (
          <ul>
            {lesson.linkedVideos.map(v => (
              <li key={v.id} className={styles.videoItem}>
                {new Date(v.date || v.timestamp).toLocaleString()}
                <button className={styles.viewBtn} onClick={() => alert(`Bekijk ${v.id}`)}>
                  Bekijken
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Geen video's gekoppeld aan deze les</p>
        )}
      </div>
    </div>
  );
}
