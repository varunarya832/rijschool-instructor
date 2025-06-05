import React from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoModal.module.css';

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
              <ReactPlayer
                url={videoData}
                controls
                // If you want it to start playing as soon as the modal opens:
                // playing
                // muted              // (autoplay without muted will be blocked on mobile)
                width="100%"
                height="100%"
                className={styles.reactPlayer}
                config={{
                  file: {
                    attributes: {
                      playsInline: true,
                      webkitPlaysInline: true,
                      // muted: true,      // if you uncomment `playing` above
                    }
                  }
                }}
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
