import React from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoModal.module.css';

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  console.log(video);
  
  const videoData = video.url;

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
                className={styles.reactPlayer}
              />
            ) : (
              <img
                src={video.imageUrl}
                alt="snapshot"
                className={styles.videoImage}
              />
            )}
          </div>

          <div className={styles.analysisContainer}>
            {/* your AI analysis content will go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
