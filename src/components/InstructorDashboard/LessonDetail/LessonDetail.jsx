
import React from 'react';
import styles from './LessonDetail.module.css';

export default function LessonDetail({ lesson, onStop, onUpload, onVideoView }) {
  console.log(lesson);
  
  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    if (typeof dateValue === 'string') {
      // If it's a string like "2025-05-26" or "26 May 2025"
      const d = new Date(dateValue);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return dateValue; // Return as-is if already formatted
  };

  const formatTime = (timeValue) => {
    if (!timeValue) return 'N/A';
    
    // If it's just "HH:MM" format
    if (timeValue.match && timeValue.match(/^\d{2}:\d{2}$/)) {
      const [hours, minutes] = timeValue.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    
    // If it's a full datetime string
    try {
      const d = new Date(timeValue);
      return d.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch (e) {
      return timeValue; // Return as-is if parsing fails
    }
  };

  const handleVideoClick = (video) => {
    console.log("vv",video);

    if (lesson.isCompleted && video.url && onVideoView) {

      
      // For completed lessons with video URLs, open the video modal
      onVideoView({
        url: video.url,
        name: video.name,
        timestamp: video.timestamp || new Date().toISOString()
      });
    } else {
      // Fallback alert for videos without URLs or active lessons
      alert(`Bekijk ${video.name || video.id}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{lesson.isCompleted ? 'Voltooide Les Details' : 'Geselecteerde Les'}</h2>
        {!lesson.isCompleted && (
          <div className={styles.buttons}>
            {onStop && (
              <button className={styles.stopBtn} onClick={onStop}>
                Les Stoppen
              </button>
            )}
            {onUpload && (
              <button className={styles.uploadBtn} onClick={onUpload}>
                Video Uploaden
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.grid}>
        <div  className={styles.lessonInfo}>
          <strong>Leerling</strong>
          <p>{lesson.studentName}</p>
        </div>
        <div className={styles.lessonInfo}>
          <strong>Datum</strong>
          <p>{formatDate(lesson.date)}</p>
        </div>
        <div className={styles.lessonInfo}>
          <strong>Starttijd</strong>
          <p>{formatTime(lesson.startTime)}</p>
        </div>
        <div className={styles.lessonInfo}>
          <strong>Eindtijd</strong>
          <p>{lesson.endTime ? formatTime(lesson.endTime) : 'Nog niet beëindigd'}</p>
        </div>
      </div>
      
      <div className={styles.linked}>
        <strong>Gekoppelde Video's</strong>
        {lesson.linkedVideos?.length > 0 ? (
          <ul>
            {lesson.linkedVideos.map((v, index) => (
              <li key={v.id || index} className={styles.videoItem}>
                {/* For completed lessons, show video name; for active lessons, show timestamp */}
                {lesson.isCompleted ? (
                  <span>{v.name || v.filename || `Video ${index + 1}`}</span>
                ) : (
                  <span>{new Date(v.date || v.timestamp).toLocaleString()}</span>
                )}
                <button 
                  className={styles.viewBtn} 
                  onClick={() => handleVideoClick(v)}
                >
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