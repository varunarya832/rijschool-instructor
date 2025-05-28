// src/components/InstructorDashboard/LessonsPanel/LessonsPanel.jsx
import React, { useState } from 'react';
import { FiChevronRight, FiVideo } from 'react-icons/fi';
import styles from './LessonsPanel.module.css';

export default function LessonsPanel({
  activeLessons,
  completedLessons,
  selectedLesson,
  onSelectLesson
}) {
  const [tab, setTab] = useState('active'); // 'active' or 'completed'
  const list = tab === 'active' ? activeLessons : completedLessons;

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        <button
          className={tab === 'active' ? styles.active : ''}
          onClick={() => setTab('active')}
        >
          Actieve Lessen
        </button>
        <button
          className={tab === 'completed' ? styles.active : ''}
          onClick={() => setTab('completed')}
        >
          Voltooide Lessen
        </button>
      </div>

      <div className={styles.content}>
        {list.length === 0 ? (
          <p>Geen {tab === 'active' ? 'actieve' : 'voltooide'} lessen</p>
        ) : (
          <ul className={styles.list}>
            {list.map(les => (
              <li
                key={les.id}
                className={`${styles.item} ${
                  selectedLesson && selectedLesson.id === les.id
                    ? styles.selected
                    : ''
                }`}
                onClick={() => onSelectLesson(les)}
              >
                <div>
                  {les.studentName}
                  <br />
                  {new Date(`${les.date}T${les.startTime}`).toLocaleString()}
                  {tab === 'completed' && les.endTime && ` tot ${les.endTime}`}
                </div>

                <div className={styles.meta}>
                  <span
                    className={
                      tab === 'active'
                        ? styles.badgeActive
                        : styles.badgeDone
                    }
                  >
                    {tab === 'active' ? 'Actief' : 'Voltooid'}
                  </span>

                  {tab === 'completed' && (
                    <span className={styles.count}>
                      <FiVideo className={styles.videoIcon} />
                      {les.linkedVideosCount || 0}
                    </span>
                  )}

                  {/* right‐arrow indicator */}
                  <FiChevronRight className={styles.arrow} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
