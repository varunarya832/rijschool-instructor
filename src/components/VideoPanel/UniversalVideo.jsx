// UniversalVideo.jsx
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function UniversalVideo({
  src,            // your signed URL
  poster,         // optional JPEG placeholder
  autoPlay = false,
  onEnded,
}) {

    console.log(src);
    
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attach hls.js *only* when the source is HLS
    if (src.endsWith('.m3u8') &&
        Hls.isSupported() &&
        !video.canPlayType('application/vnd.apple.mpegurl')) {

      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, [src]);

  // iOS can play only one <video> at a time – pause any others
  useEffect(() => {
    const pauseOthers = () => {
      document.querySelectorAll('video').forEach(v => {
        if (v !== videoRef.current) v.pause();
      });
    };
    videoRef.current?.addEventListener('play', pauseOthers);
    return () => videoRef.current?.removeEventListener('play', pauseOthers);
  }, []);

  return (
    <video
      ref={videoRef}
      src={src.endsWith('.m3u8') ? undefined : src} // HLS will be loaded by hls.js
      poster={poster}
      controls
      playsInline
      webkit-playsinline="true"
    //   crossOrigin="anonymous"
      muted={autoPlay}
      autoPlay={autoPlay}
      onEnded={onEnded}
      style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
    />
  );
}
