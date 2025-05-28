import React, { useState, useEffect } from 'react';
import styles from './VideoPanel.module.css';
import VideoModal from './VideoModal';
import { getLessonDetails } from '../../service/lesson.service';

export default function VideoPanel({ selectedLesson }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVideo, setModalVideo] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (selectedLesson?.id) {
      setLoading(true);
      setError(null);
      getLessonDetails(selectedLesson.id)
        .then(list => {
          if (!cancelled) setVideos(list);
        })
        .catch(() => {
          if (!cancelled) setError('Video’s laden mislukt');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    } else {
      setVideos([]);
    }
    return () => { cancelled = true };
  }, [selectedLesson]);

  if (!selectedLesson) {
    return (
      <div className={styles.placeholder}>
        <p>Selecteer een les om video's te bekijken</p>
      </div>
    );
  }

  const date = new Date(selectedLesson.date);
  const start = new Date(selectedLesson.start);
  const end = new Date(selectedLesson.end);

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
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>Lesdetails</h2>
        <span className={styles.lessonDate}>{dateStr}</span>
      </div>

      <div className={styles.times}>
        <div className={styles.timeBox}>
          <label>Starttijd</label>
          <div className={styles.timeValue}>{startStr}</div>
        </div>
        <div className={styles.timeBox}>
          <label>Eindtijd</label>
          <div className={styles.timeValue}>{endStr}</div>
        </div>
      </div>

      <div className={styles.videosSection}>
        <label className={styles.videosLabel}>
          Video’s van deze les ({videos.length})
        </label>

        {loading && <p>Video’s laden…</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && videos.length === 0 && (
          <div className={styles.noVideos}>
            Geen video's beschikbaar voor deze les.
          </div>
        )}

        {!loading && !error && videos.map(v => (
          <div key={v.id} className={styles.videoCard}>
            <span className={styles.videoName}>{v.name}</span>
            <button
              className={styles.viewBtn}
              onClick={() => setModalVideo(v)}
            >
              Bekijken
            </button>
          </div>
        ))}
      </div>

      {modalVideo && (
        <VideoModal video={modalVideo} onClose={() => setModalVideo(null)} />
      )}
    </div>
  );
}
