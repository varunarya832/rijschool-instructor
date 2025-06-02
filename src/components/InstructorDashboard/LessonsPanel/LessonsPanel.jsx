
import React, { useState } from 'react';
import { FiChevronRight, FiVideo } from 'react-icons/fi';
import styles from './LessonsPanel.module.css';

export default function LessonsPanel({
  activeLessons,
  completedLessons,
  selectedLesson,
  onSelectLesson
}) {
  const [tab, setTab] = useState('active');
  const list = tab === 'active' ? activeLessons : completedLessons;

  const formatEntry = (lesson) => {
    const { date, startTime, endTime } = lesson;
    
    // Handle date formatting - check if it's already a string or needs parsing
    let dateStr;
    if (typeof date === 'string') {
      // If date is a string like "2025-05-26", format it
      const d = new Date(date);
      dateStr = d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });
    } else {
      // If date is already formatted or a Date object
      dateStr = date;
    }

    // Format times - handle both "HH:MM" string format and full datetime strings
    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      
      // If it's just "HH:MM" format
      if (timeStr.match(/^\d{2}:\d{2}$/)) {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
      }
      
      // If it's a full datetime string, extract time
      try {
        const d = new Date(timeStr);
        return d.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        });
      } catch (e) {
        return timeStr; // Return as-is if parsing fails
      }
    };

    const startStr = formatTime(startTime);
    if (!endTime) {
      return `${dateStr} – ${startStr}`;
    }
    const endStr = formatTime(endTime);
    return `${dateStr} – ${startStr} tot ${endStr}`;
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
        {list.length === 0 ? (
          <p>Geen {tab === 'active' ? 'actieve' : 'voltooide'} lessen</p>
        ) : (
          <ul className={styles.list}>
            {list.map(les => (
              <li
                key={les.id}
                className={`${styles.item} ${
                  selectedLesson?.id === les.id ? styles.selected : ''
                }`}
                onClick={() => onSelectLesson(les)}
              >
                <div>
                  {tab === 'completed' && (
                    <>
                      {/* <strong>{les.studentName}</strong> */}
                      <br />
                    </>
                  )}
                  {formatEntry(les)}
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
