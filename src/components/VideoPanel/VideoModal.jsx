import React from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoModal.module.css';

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  const videoData = "https://videocdn.cdnpk.net/videos/571b35e8-4beb-456b-bac3-7231962d0405/horizontal/previews/clear/large.mp4?token=exp=1749139796~hmac=4d56854a5aeafdce2a878e3b08cea728ab62c7b50f0ad4f1354d2dac99e17b45";
  // const videoData = video.url || null; // Use video.videoUrl if available

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
                playsinline={true}                  // ReactPlayer prop
                config={{
                  file: {
                    attributes: {
                      playsInline: true,            // for modern iOS
                      webkitPlaysInline: 'true',    // for older iOS
                    }
                  }
                }}
              />
            ) : (
              <p>not</p>
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
