// src/components/InstructorDashboard/InstructorDashboard.jsx
import React, { useEffect, useState } from 'react';
import styles from './InstructorDashboard.module.css';

import LessonsPanel      from './LessonsPanel/LessonsPanel';
import LessonDetail     from './LessonDetail/LessonDetail';
import VideoList        from './VideoList/VideoList';
import VideoUploadModal from './VideoUploadModal/VideoUploadModal';

import {
  getStudents,
  getActiveLessons,
  getCompletedLessons,
  getUnlinkedVideos,
  startLesson,
  stopLesson,
  linkVideoToLesson,
  uploadVideoToLesson,
  uploadUnlinkedVideo
} from '../../service/instructorService';

import StudentSelect from '../StudentSelect/StudentSelect';
import Header        from '../Header/Header';
import { useAuth }   from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function InstructorDashboard() {
  const [students,         setStudents]         = useState([]);
  const [selectedStudent,  setSelectedStudent]  = useState(null);
  const [activeLessons,    setActiveLessons]    = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [unlinkedVideos,   setUnlinkedVideos]   = useState([]);
  const [activeLesson,     setActiveLesson]     = useState(null);
  const [showUpload,       setShowUpload]       = useState(false);

  const { logout } = useAuth();
  const navigate   = useNavigate();

  useEffect(() => {
    Promise.all([
      getStudents(),
      getActiveLessons(),
      getCompletedLessons(),
      getUnlinkedVideos()
    ])
    .then(([stu, act, comp, unlk]) => {
      setStudents(stu);
      setActiveLessons(act);
      if (act.length) setActiveLesson(act[0]);
      setCompletedLessons(comp);
      setUnlinkedVideos(unlk);
    })
    .catch(console.error);
  }, []);

  const handleStart = () => {
    if (!selectedStudent) return;
    startLesson(selectedStudent.id, selectedStudent.name)
      .then(lesson => {
        setActiveLessons([lesson]);
        setActiveLesson(lesson);
      })
      .catch(console.error);
  };

  const handleStop = () => {
    if (!activeLesson) return;
    stopLesson(activeLesson.id)
      .then(lesson => {
        setCompletedLessons(prev => [
          {
            id:               lesson.id,
            studentId:        lesson.studentId,
            studentName:      lesson.studentName,
            date:             lesson.date,
            startTime:        lesson.startTime,
            endTime:          lesson.endTime,
            linkedVideosCount: lesson.linkedVideos.length
          },
          ...prev
        ]);
        setActiveLessons([]);
        setActiveLesson(null);
      })
      .catch(console.error);
  };

  const handleLink = videoId => {
    if (!activeLesson) return;
    const videoObj = unlinkedVideos.find(v => v.id === videoId);
    if (!videoObj) return;
    linkVideoToLesson(activeLesson.id, videoObj)
      .then(video => {
        setUnlinkedVideos(vs => vs.filter(v => v.id !== video.id));
        setActiveLesson(prev => ({
          ...prev,
          linkedVideos: [...(prev.linkedVideos||[]), video]
        }));
      })
      .catch(console.error);
  };

  const handleUpload = file => {
    const fn = activeLesson
      ? () => uploadVideoToLesson(activeLesson.id, file)
      : () => uploadUnlinkedVideo(file);

    fn()
      .then(video => {
        if (activeLesson) {
          setActiveLesson(prev => ({
            ...prev,
            linkedVideos: [...(prev.linkedVideos||[]), video]
          }));
        } else {
          setUnlinkedVideos(vs => [video, ...vs]);
        }
      })
      .catch(console.error);

    setShowUpload(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.page}>
      <Header title="Instructor Dashboard" onLogout={handleLogout} />

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.newLesson}>
            <h2>Nieuwe Les Starten</h2>
            <StudentSelect
              students={students}
              value={selectedStudent}
              onChange={setSelectedStudent}
            />
            <button
              className={styles.startBtn}
              onClick={handleStart}
              disabled={!selectedStudent}
            >
              Les Nu Starten
            </button>
          </div>
          <LessonsPanel
            activeLessons={activeLessons}
            completedLessons={completedLessons}
            selectedLesson={activeLesson}
            onSelectLesson={setActiveLesson}
          />
        </aside>

        <main className={styles.main}>
          {activeLesson ? (
            <LessonDetail
              lesson={activeLesson}
              onStop={handleStop}
              onUpload={() => setShowUpload(true)}
            />
          ) : (
            <div className={styles.emptyState}>
              Selecteer een les of start een nieuwe les
            </div>
          )}

          <section className={styles.videoSection}>
            <div className={styles.videoHeader}>
              <h3>Ongekoppelde Video’s</h3>
              <button
                className={styles.newVideoBtn}
                onClick={() => setShowUpload(true)}
              >
                Nieuwe Video
              </button>
            </div>
            <VideoList
              videos={unlinkedVideos}
              onView={id => alert(`Bekijk video ${id}`)}
              onLink={handleLink}
            />
          </section>
        </main>
      </div>

      {showUpload && (
        <VideoUploadModal
          lesson={activeLesson}
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}
