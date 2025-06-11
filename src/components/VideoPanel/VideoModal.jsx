import React from 'react';
import styles from './VideoModal.module.css';

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  const src =
    video.url


  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <div className={styles.header}>
          <span className={styles.analysisLabel}>AI Analyse</span>
        </div>

        <div className={styles.body}>
          <div className={styles.videoContainer}>
            {src ? (
              <video
                className={styles.videoPlayer}
                src={src}
                controls
                playsInline
                style={{ width: '100%', height: '100%', background: '#000' }}
              >
                Je browser ondersteunt de video tag niet.
              </video>
            ) : (
              <p>Video niet beschikbaar</p>
            )}
          </div>

          <div className={styles.analysisContainer}>
            {/* AI-analyse van de video komt hier */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
