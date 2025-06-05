// import React from 'react';
// import ReactPlayer from 'react-player';
// import styles from './VideoModal.module.css';

// const VideoModal = ({ video, onClose }) => {
//   if (!video) return null;

//   console.log(video);
  
//   const videoData = video.url;
// //   const videoData = "https://www.pexels.com/video/laboratory-medical-medicine-virus-4114797/";
//   return (
//     <div className={styles.overlay}>
//       <div className={styles.modal}>
//         <button className={styles.closeBtn} onClick={onClose}>
//           ×
//         </button>

//         <div className={styles.header}>
//           <span className={styles.timestamp}>{video.timestamp}</span>
//           <span className={styles.analysisLabel}>AI Analyse</span>
//         </div>

//         <div className={styles.body}>
//           <div className={styles.videoContainer}>
//             {videoData ? (
//               <ReactPlayer
//                 url="https://videocdn.cdnpk.net/videos/f7d66bb4-4b0a-4897-996d-7c3510ae3c54/horizontal/previews/clear/large.mp4?token=exp=1749129067~hmac=96236b7c1dbe3a665b096b4056fc58b9ed8d9667d198a492e3744b9d9eacfb42"
//                 controls
//                 width="100%"
//                 height="100%"
//                 className={styles.reactPlayer}
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
//             {/* your AI analysis content will go here */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoModal;


import React from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoModal.module.css';

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  console.log(video);
  
  // const videoData = video.url;
  const videoData = "https://www.pexels.com/video/laboratory-medical-medicine-virus-4114797/";
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
              <video
                playsInline
                webkit-playsinline="true"
                controls
                width="100%"
                height="100%"
                className={styles.reactPlayer}
              >
                <source src={videoData} type="video/mp4" />
              </video>
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
