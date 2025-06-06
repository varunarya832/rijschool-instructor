import React from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoModal.module.css';

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  // For demo purposes, we're using a fixed sample video.
  // In production you would use `video.url`.
  // const videoData = video.url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4";
const videoData = video.url
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <div className={styles.header}>
          <span className={styles.timestamp}>{video.timestamp}</span>
          <span className={styles.analysisLabel}>AI Analyse</span>
        </div>

        <div className={styles.body}>
          <div className={styles.videoContainer}>
            {videoData ? (
              <ReactPlayer
                url={videoData}
                controls
                width="100%"
                height="100%"
                playsinline={true}
                config={{
                  file: {
                    attributes: {
                      playsInline: true,
                      webkitplaysinline: 'true',
                    }
                  }
                }}
                className={styles.reactPlayer}
              />
            ) : (
              <p>Video niet beschikbaar</p>
            )}
          </div>

          <div className={styles.analysisContainer}>
            {/* Placeholder for AI-analyse of de video */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
