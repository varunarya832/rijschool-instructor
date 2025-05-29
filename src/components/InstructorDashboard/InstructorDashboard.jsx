
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import StudentSelect from '../StudentSelect/StudentSelect';
import Header from '../Header/Header';
import LessonsPanel from './LessonsPanel/LessonsPanel';
import LessonDetail from './LessonDetail/LessonDetail';
import VideoList from './VideoList/VideoList';
import VideoUploadModal from './VideoUploadModal/VideoUploadModal';
import VideoModal from '../VideoPanel/VideoModal'; // NEW IMPORT

import {
  getStudents,
  getActiveLessons,
  getCompletedLessons,
  getUnlinkedVideos,
  getLessonDetails, // NEW IMPORT
  startLesson,
  stopLesson,
  linkVideoToLesson,
  uploadVideoToLesson,
  uploadUnlinkedVideo
} from '../../service/instructorService';

import styles from './InstructorDashboard.module.css';

export default function InstructorDashboard() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeLessons, setActiveLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [unlinkedVideos, setUnlinkedVideos] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [selectedCompletedLesson, setSelectedCompletedLesson] = useState(null); // NEW STATE
  const [showUpload, setShowUpload] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false); // NEW STATE
  const [selectedVideo, setSelectedVideo] = useState(null); // NEW STATE

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getStudents(),
      getActiveLessons(),
      getUnlinkedVideos(),
    ])
      .then(([stuList, actLessons, vids]) => {
        setStudents(stuList);
        setActiveLessons(actLessons);
        if (actLessons.length) setActiveLesson(actLessons[0]);
        setUnlinkedVideos(vids);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedStudent) {
      setCompletedLessons([]);
      return;
    }
    getCompletedLessons(selectedStudent.id)
      .then(lessonList => {
        setCompletedLessons(lessonList);
      })
      .catch(console.error);
  }, [selectedStudent]);

  const handleStart = () => {
    if (!selectedStudent) return;
    startLesson(selectedStudent.id, selectedStudent.name)
      .then(les => {
        setActiveLessons([les]);
        setActiveLesson(les);
        setSelectedCompletedLesson(null); // Clear completed lesson selection
      })
      .catch(console.error);
  };

  const handleStop = () => {
    if (!activeLesson) return;
    stopLesson(activeLesson.id)
      .then(finished => {
        setCompletedLessons(prev => [
          {
            ...finished,
            studentName: activeLesson.studentName,
            linkedVideosCount: activeLesson.linkedVideos.length
          },
          ...prev
        ]);
        setActiveLessons([]);
        setActiveLesson(null);
      })
      .catch(console.error);
  };

  // NEW FUNCTION: Handle completed lesson selection
  const handleCompletedLessonSelect = async (lesson) => {
    try {
      const lessonDetails = await getLessonDetails(lesson.id);
      
      // Debug: Log the API response to understand the structure
      console.log('API Response:', lessonDetails);
      
      // Handle different possible API response structures
      let lessonData;
      if (lessonDetails && lessonDetails.lesson) {
        lessonData = lessonDetails.lesson;
      } else if (lessonDetails && lessonDetails.data && lessonDetails.data.lesson) {
        lessonData = lessonDetails.data.lesson;
      } else if (lessonDetails) {
        lessonData = lessonDetails; // Direct lesson data
      } else {
        throw new Error('Invalid API response structure');
      }
      
      // Create a lesson object compatible with LessonDetail component
      const detailedLesson = {
        id: lesson.id,
        studentId: lesson.studentId,
        studentName: lesson.studentName,
        date: lessonData.date || lesson.date, // Fallback to original lesson date
        startTime: lessonData.start_time || lessonData.startTime || lesson.startTime,
        endTime: lessonData.end_time || lessonData.endTime || lesson.endTime,
        linkedVideos: (lessonData.videos || []).map((video, index) => {
          console.log(video);
          
          // Handle different video formats: [video_name, video_url] or {name, url}
          if (Array.isArray(video) && video.length >= 2) {
            return {
              id: `video_${index}`,
              name: video[0], // video_name
              url: video.video_url,  // video_url
              timestamp: new Date().toISOString()
            };
          } else if (typeof video === 'object' && video.name && video.url) {
            return {
              id: `video_${index}`,
              name: video.name,
              url: video.video_url,
              timestamp: new Date().toISOString()
            };
          } else if (typeof video === 'string') {
            return {
              id: `video_${index}`,
              name: video,
              url: video.video_url, // No URL available
              timestamp: new Date().toISOString()
            };
          } else {
            return {
              id: `video_${index}`,
              name: `Video ${index + 1}`,
              url: video.video_url,
              timestamp: new Date().toISOString()
            };
          }
        }),
        isCompleted: true // Flag to identify completed lessons
      };
      
      setSelectedCompletedLesson(detailedLesson);
      setActiveLesson(null); // Clear active lesson selection
    } catch (error) {
      console.error('Error fetching lesson details:', error);
      
      // Fallback: Use the original lesson data if API fails
      const fallbackLesson = {
        id: lesson.id,
        studentId: lesson.studentId,
        studentName: lesson.studentName,
        date: lesson.date,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        linkedVideos: [], // Empty since we couldn't fetch details
        isCompleted: true
      };
      
      setSelectedCompletedLesson(fallbackLesson);
      setActiveLesson(null);
    }
  };

  const handleLink = videoId => {
    if (!activeLesson) return;
    const vid = unlinkedVideos.find(v => v.id === videoId);
    if (!vid) return;
    linkVideoToLesson(activeLesson.id, vid)
      .then(v => {
        setUnlinkedVideos(us => us.filter(x => x.id !== v.id));
        setActiveLesson(al => ({
          ...al,
          linkedVideos: [...(al.linkedVideos || []), v]
        }));
      })
      .catch(console.error);
  };

  // NEW FUNCTION: Handle video viewing
  const handleVideoView = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const handleUpload = file => {
    const fn = activeLesson
      ? () => uploadVideoToLesson(activeLesson.id, file)
      : () => uploadUnlinkedVideo(file);

    fn()
      .then(v => {
        if (activeLesson) {
          setActiveLesson(al => ({
            ...al,
            linkedVideos: [...(al.linkedVideos || []), v]
          }));
        } else {
          setUnlinkedVideos(us => [v, ...us]);
        }
      })
      .catch(console.error)
      .finally(() => setShowUpload(false));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Determine which lesson to show in detail
  const lessonToShow = activeLesson || selectedCompletedLesson;

  return (
    <div className={styles.page}>
      <Header title="Instructor Dashboard" onLogout={handleLogout} />

      <div className={styles.container}>
        <aside className={styles.sidebar}>
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

          <LessonsPanel
            activeLessons={activeLessons}
            completedLessons={completedLessons}
            selectedLesson={lessonToShow}
            onSelectLesson={(lesson) => {
              if (activeLessons.some(al => al.id === lesson.id)) {
                // It's an active lesson
                setActiveLesson(lesson);
                setSelectedCompletedLesson(null);
              } else {
                // It's a completed lesson
                handleCompletedLessonSelect(lesson);
              }
            }}
          />
        </aside>

        <main className={styles.main}>
          {lessonToShow ? (
            <LessonDetail
              lesson={lessonToShow}
              onStop={lessonToShow.isCompleted ? null : handleStop} // Only show stop for active lessons
              onUpload={lessonToShow.isCompleted ? null : () => setShowUpload(true)} // Only show upload for active lessons
              onVideoView={handleVideoView} // NEW PROP
            />
          ) : (
            <div className={styles.emptyState}>
              Selecteer een les of start een nieuwe les
            </div>
          )}

          <section className={styles.videoSection}>
            <div className={styles.videoHeader}>
              <h3>Ongekoppelde Video's</h3>
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

      {showVideoModal && (
        <VideoModal
          video={selectedVideo}
          onClose={() => {
            setShowVideoModal(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </div>
  );
}
