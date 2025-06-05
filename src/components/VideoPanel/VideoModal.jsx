import React, { useState, useEffect } from 'react';
import styles from './VideoModal.module.css';

const VideoModal = ({ video, onClose }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  if (!video) return null;

  const videoData = video.url;

  // Simple click handler to enable video on iOS
  const handlePlayClick = () => {
    setUserInteracted(true);
    setShowVideo(true);
  };

  // Open video in new tab/window for mobile
  const openVideoExternal = () => {
    // For mobile, open in new window which often works better
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Video Player</title>
          <style>
            body { margin: 0; padding: 0; background: #000; }
            video { width: 100vw; height: 100vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <video controls autoplay playsinline webkit-playsinline="true">
            <source src="${videoData}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

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
            {!showVideo ? (
              // Show thumbnail with play button
              <div className={styles.thumbnailContainer}>
                <img
                  src={video.imageUrl}
                  alt="Video thumbnail"
                  className={styles.thumbnail}
                />
                <div className={styles.playOverlay}>
                  <button 
                    className={styles.playButton}
                    onClick={handlePlayClick}
                  >
                    <div className={styles.playIcon}>▶</div>
                    <span>Play Video</span>
                  </button>
                  <button 
                    className={styles.externalButton}
                    onClick={openVideoExternal}
                  >
                    Open in New Tab
                  </button>
                </div>
              </div>
            ) : (
              // Show actual video player
              <div className={styles.videoPlayer}>
                <video
                  controls
                  autoPlay
                  playsInline
                  webkit-playsinline="true"
                  className={styles.video}
                  poster={video.imageUrl}
                >
                  <source src={videoData} type="video/mp4" />
                  <p>
                    Your browser doesn't support HTML5 video. 
                    <a href={videoData} target="_blank" rel="noopener noreferrer">
                      Click here to view the video
                    </a>
                  </p>
                </video>
                <div className={styles.videoControls}>
                  <button 
                    className={styles.backButton}
                    onClick={() => setShowVideo(false)}
                  >
                    ← Back to Thumbnail
                  </button>
                  <button 
                    className={styles.externalButton}
                    onClick={openVideoExternal}
                  >
                    Open Externally
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className={styles.analysisContainer}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;