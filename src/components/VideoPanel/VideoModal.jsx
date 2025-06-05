import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoModal.module.css';

const VideoModal = ({ video, onClose }) => {
  const [useNativePlayer, setUseNativePlayer] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Detect iOS devices more comprehensively
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);
    
    // Start with native player on iOS for better compatibility
    if (iOS) {
      setUseNativePlayer(true);
    }
  }, []);

  if (!video) return null;
  
  const videoData = video.url;

  const handlePlayerError = (error) => {
    console.error('ReactPlayer error:', error);
    setPlayerError(true);
    setUseNativePlayer(true);
  };

  const handleVideoError = (e) => {
    console.error('Native video error:', e);
    // You might want to show an error message to user here
  };

  const renderVideoPlayer = () => {
    if (!videoData) {
      return (
        <img
          src={video.imageUrl}
          alt="snapshot"
          className={styles.videoImage}
        />
      );
    }

    // Option 1: Enhanced ReactPlayer with iOS-specific config
    if (!useNativePlayer && !playerError) {
      return (
        <ReactPlayer
          ref={videoRef}
          url={videoData}
          controls
          width="100%"
          height="100%"
          className={styles.reactPlayer}
          onError={handlePlayerError}
          // iOS specific configurations
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                playsInline: true, // Crucial for iOS
                preload: 'metadata',
                'webkit-playsinline': true, // Legacy iOS support
                // crossOrigin: 'anonymous', // If videos are cross-origin
              }
            }
          }}
          // Force reload on iOS if needed
          key={isIOS ? `ios-${videoData}` : videoData}
          playsinline={true} // ReactPlayer prop for iOS
        />
      );
    }

    // Option 2: Native HTML5 video element as fallback
    return (
      <video
        ref={videoRef}
        src={videoData}
        controls
        className={styles.nativeVideo}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        playsInline
        webkit-playsinline="true"
        preload="metadata"
        controlsList="nodownload"
        onError={handleVideoError}
        crossOrigin="anonymous"
      >
        <source src={videoData} type="video/mp4" />
        <source src={videoData} type="video/webm" />
        <source src={videoData} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    );
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
          {isIOS && (
            <button 
              className={styles.togglePlayer}
              onClick={() => setUseNativePlayer(!useNativePlayer)}
              style={{ 
                fontSize: '12px', 
                padding: '4px 8px', 
                marginLeft: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              {useNativePlayer ? 'Try ReactPlayer' : 'Use Native Player'}
            </button>
          )}
        </div>
        <div className={styles.body}>
          <div className={styles.videoContainer}>
            {renderVideoPlayer()}
          </div>
          <div className={styles.analysisContainer}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;




















// import React from 'react';
// import ReactPlayer from 'react-player';
// import styles from './VideoModal.module.css';
// import UniversalVideo from './UniversalVideo';

// const VideoModal = ({ video, onClose }) => {
//   if (!video) return null;

//   const videoData = video.url; // e.g. "https://…/myclip.mp4"

//   return (
//     <div className={styles.overlay}>
//       <div className={styles.modal}>
//         <button className={styles.closeBtn} onClick={onClose}>×</button>

//         <div className={styles.header}>
//           <span className={styles.timestamp}>{video.timestamp}</span>
//           <span className={styles.analysisLabel}>AI Analyse</span>
//         </div>

//         <div className={styles.body}>
//           <div className={styles.videoContainer}>
//             {videoData ? (
//               <UniversalVideo
//                 src={video.url}          // signed MP4 (or M3U8 later)
//               />

//             ) : (
//               <img
//                 src={video.imageUrl}
//                 alt="snapshot"
//                 className={styles.videoImage}
//               />
//             )}
//           </div>
//           <div className={styles.analysisContainer}>
//             {/* AI analysis content */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoModal;
