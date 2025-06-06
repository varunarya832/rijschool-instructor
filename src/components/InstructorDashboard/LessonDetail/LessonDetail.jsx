import React from 'react';
import styles from './LessonDetail.module.css';

export default function LessonDetail({
  lesson,
  onStop,
  onUpload,
  onVideoView,
  isStopping,
  isUploading,
  selectedStudentName
}) {
  console.log('LessonDetail component rendered with lesson:', lesson);


  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    if (typeof dateValue === 'string') {
      const d = new Date(dateValue);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return dateValue;
  };

  const formatTime = (timeValue) => {
    if (!timeValue) return 'N/A';

    if (typeof timeValue === 'string' && timeValue.match(/^\d{2}:\d{2}$/)) {
      return timeValue;
    }

    try {
      const d = new Date(timeValue);
      return d.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (e) {
      return timeValue;
    }
  };

  const handleVideoClick = (video) => {
    if (lesson.isCompleted && video.url && onVideoView) {
      onVideoView({
        url: video.url,
        name: video.name,
        timestamp: video.timestamp || new Date().toISOString()
      });
    } else {
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
              <button
                className={styles.stopBtn}
                onClick={onStop}
                disabled={isStopping}
              >
                {isStopping ? 'Bezig...' : 'Les Stoppen'}
              </button>
            )}
            {onUpload && (
              <button
                className={styles.uploadBtn}
                onClick={onUpload}
                disabled={isUploading}
              >
                {isUploading ? 'Bezig met uploaden...' : 'Video Uploaden'}
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles.grid}>
        <div className={styles.lessonInfo}>
          <strong>Leerling</strong>
          <p>{selectedStudentName}</p>
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
                {lesson.isCompleted ? (
                  <span className={styles.videoName}>
                    {v.name || v.filename || `Video ${index + 1}`}
                  </span>
                ) : (
                  <span className={styles.videoTimestamp}>
                    {new Date(v.date || v.timestamp).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </span>
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
          <p className={styles.noVideos}>
            Geen video's gekoppeld aan deze les
          </p>
        )}
      </div>
    </div>
  );
}
