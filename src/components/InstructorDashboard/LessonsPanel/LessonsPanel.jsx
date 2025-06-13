import React, { useState } from 'react';
import { FiChevronRight, FiVideo } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';

import styles from './LessonsPanel.module.css';

export default function LessonsPanel({
  activeLessons,
  completedLessons,
  selectedLesson,
  onSelectLesson,
  loading = false,
  showStudentName = false

}) {
  console.log(completedLessons);

  const [tab, setTab] = useState('active');
  const list = tab === 'active' ? activeLessons : completedLessons;

  const formatEntry = (lesson) => {
    const { date, startTime, endTime } = lesson;

    let dateStr = typeof date === 'string'
      ? new Date(date).toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
      : date;

    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      // If already "HH:MM" in 24h format, return as-is
      if (timeStr.match(/^\d{2}:\d{2}$/)) {
        return timeStr;
      }
      try {
        return new Date(timeStr).toLocaleTimeString('nl-NL', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      } catch {
        return timeStr;
      }
    };

    const startStr = formatTime(startTime);
    const endStr = endTime ? formatTime(endTime) : null;
    return `${dateStr} – ${startStr}${endStr ? ` to ${endStr}` : ''}`;
  };

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
        {loading ? (
          <div className={styles.loaderWrapper}>
            <ClipLoader color="#7B61FF" size={40} />
            <p className={styles.loadingText}>
              {tab === 'active' ? 'Actieve lessen laden...' : 'Voltooide lessen laden...'}
            </p>
          </div>
        ) : list.length === 0 ? (
          <p className={styles.noLessons}>
            Geen {tab === 'active' ? 'actieve' : 'voltooide'} lessen
          </p>
        ) : (
          <ul className={styles.list}>
            {list.map((les) => (
              <li
                key={les.id}
                className={`${styles.item} ${selectedLesson?.id === les.id ? styles.selected : ''
                  }`}
                onClick={() => onSelectLesson(les)}
              >
                {/* <div className={styles.lessonTitle} title={les.student_name}>
                  {les.student_name}
                </div> */}
                <div className={styles.lessonDetails}>
                  {showStudentName && (
                    <div
                      className={styles.lessonTitle}
                      title={les.studentName || les.student_name}
                    >
                      {les.studentName || les.student_name}
                    </div>
                  )}
                  <div className={styles.lessonInfo}>{formatEntry(les)}</div>
                </div>
                <div className={styles.meta}>
                  <span className={tab === 'active' ? styles.badgeActive : styles.badgeDone}>
                    {tab === 'active' ? 'Actief' : 'Voltooid'}
                  </span>

                  {tab === 'completed' && (
                    <span className={styles.count}>
                      <FiVideo className={styles.videoIcon} />
                      {les.linkedVideosCount}
                    </span>
                  )}
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
