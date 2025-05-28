// src/components/InstructorDashboard/VideoUploadModal/VideoUploadModal.jsx
import React, { useState } from 'react';
import styles from './VideoUploadModal.module.css';

export default function VideoUploadModal({ lesson, onClose, onUpload }) {
  const [file, setFile] = useState(null);

  function submit(e) {
    e.preventDefault();
    if (file) onUpload(file);
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h3>
          {lesson
            ? `Video toevoegen aan les: ${lesson.studentName}`
            : 'Nieuwe Video Uploaden'}
        </h3>
        <form onSubmit={submit}>
          <input
            type="file"
            accept="video/*"
            onChange={e => setFile(e.target.files[0] || null)}
          />
          <div className={styles.actions}>
            <button type="button" onClick={onClose}>Annuleren</button>
            <button type="submit" disabled={!file}>Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
}
