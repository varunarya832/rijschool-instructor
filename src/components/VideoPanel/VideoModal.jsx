import React from 'react';
import MuxPlayer from '@mux/mux-player-react';
import styles from './VideoModal.module.css';

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  // video.playbackId comes from Mux after you upload via their API
  // const { playbackId, timestamp } = video;
  const playbackId = video.playbackId || 'dRWZ02P9MyKTfTTIoH8Ek4HxL3ZzlXMzkWYKRzhnhegU';  
  // const playbackId = video.url;

  const timestamp = video.timestamp || new Date().toLocaleString();
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <div className={styles.header}>
          <span className={styles.timestamp}>{timestamp}</span>
          <span className={styles.analysisLabel}>AI Analyse</span>
        </div>

        <div className={styles.body}>
          <div className={styles.videoContainer}>
            {playbackId ? (
              <MuxPlayer
                className="mux-player"
                playbackId={playbackId}
                streamType="on-demand"
                primaryColor="#fff"
                metadata={{
                  video_id: video.id,
                  video_title: video.title || 'Untitled Video',
                }}
                controls
                playsInline
                style={{ width: '100%', height: '100%', background: '#000' }}
              />
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
