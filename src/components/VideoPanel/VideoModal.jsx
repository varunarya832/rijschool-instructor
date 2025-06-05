import React from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoModal.module.css';
import UniversalVideo from './UniversalVideo';

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  const videoData = video.url; // e.g. "https://…/myclip.mp4"

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <div className={styles.header}>
          <span className={styles.timestamp}>{video.timestamp}</span>
          <span className={styles.analysisLabel}>AI Analyse</span>
        </div>

        <div className={styles.body}>
          <div className={styles.videoContainer}>
            {videoData ? (
              <UniversalVideo
                src={video.url}          // signed MP4 (or M3U8 later)
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
            {/* AI analysis content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
