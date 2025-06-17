import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentSelect from './StudentSelect/StudentSelect';
import Header from '../Header/Header';
import LessonsPanel from './LessonsPanel/LessonsPanel';
import LessonDetail from './LessonDetail/LessonDetail';
import VideoList from './VideoList/VideoList';
import VideoUploadModal from './VideoUploadModal/VideoUploadModal';
import VideoModal from '../VideoPanel/VideoModal';
import Sidebar from '../Header/Sidebar';

import {
  getStudents,
  getActiveLessons,
  getCompletedLessons,
  getUnlinkedVideos,
  getLessonDetails,
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
  const [selectedCompletedLesson, setSelectedCompletedLesson] = useState(null);

  const [showUpload, setShowUpload] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingActiveLessons, setIsLoadingActiveLessons] = useState(false);
  const [isLoadingUnlinkedVideos, setIsLoadingUnlinkedVideos] = useState(false);
  const [isLoadingCompletedLessons, setIsLoadingCompletedLessons] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoadingStudents(true);
    setIsLoadingActiveLessons(true);
    setIsLoadingUnlinkedVideos(true);

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
      .catch(error => {
        console.error(error);
        toast.error('Fout bij laden van initiële gegevens');
      })
      .finally(() => {
        setIsLoadingStudents(false);
        setIsLoadingActiveLessons(false);
        setIsLoadingUnlinkedVideos(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedStudent) {
      setCompletedLessons([]);
      return;
    }
    setIsLoadingCompletedLessons(true);
    getCompletedLessons(selectedStudent.id)
      .then(lessonList => {
        setCompletedLessons(lessonList);
      })
      .catch(error => {
        console.error(error);
        toast.error('Fout bij laden van voltooide lessen');
      })
      .finally(() => {
        setIsLoadingCompletedLessons(false);
      });
  }, [selectedStudent]);

  const handleStart = () => {
    if (!selectedStudent) return;
    setIsStarting(true);
    startLesson(selectedStudent.id, selectedStudent.name)
      .then(les => {
        setActiveLessons([les]);
        setActiveLesson(les);
        setSelectedCompletedLesson(null);
        toast.success('Les gestart!');
      })
      .catch(error => {
        console.error(error);
        toast.error('Fout bij starten van de les');
      })
      .finally(() => setIsStarting(false));
  };

  const handleStop = () => {
    if (!activeLesson) return;
    setIsStopping(true);
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
        toast.success('Les gestopt!');
      })
      .catch(error => {
        console.error(error);
        toast.error('Fout bij stoppen van de les');
      })
      .finally(() => setIsStopping(false));
  };


  const handleCompletedLessonSelect = async (lesson) => {
    setIsFetchingDetails(true);
    try {
      const lessonDetails = await getLessonDetails(lesson.id);
      console.log('Fetching details for completed lesson:', lessonDetails);

      console.log('API Response:', lessonDetails);

      let lessonData;
      if (lessonDetails && lessonDetails.lesson) {
        lessonData = lessonDetails.lesson;
      } else if (lessonDetails && lessonDetails.data && lessonDetails.data.lesson) {
        lessonData = lessonDetails.data.lesson;
      } else if (lessonDetails) {
        lessonData = lessonDetails;
      } else {
        throw new Error('Invalid API response structure');
      }

      const detailedLesson = {
        id: lesson.id,
        studentId: lesson.studentId,
        studentName: lesson.studentName,
        date: lessonData.date || lesson.date,
        startTime: lessonData.start_time || lessonData.startTime || lesson.startTime,
        endTime: lessonData.end_time || lessonData.endTime || lesson.endTime,
        linkedVideos: (lessonData.videos || []).map((video, index) => {
          console.log("--",video);
          if (Array.isArray(video) && video.length >= 2) {
            return {
              id: `video_${index}`,
              name: video[0],
              url: video[1],
              timestamp: new Date().toISOString()
            };
          } else if (typeof video === 'object' && video.name && (video.url || video.video_url)) {
            return {
              id: `video_${index}`,
              name: video.video_name,
              url: video.url || video.video_url,
              timestamp: new Date().toISOString()
            };
          } else if (typeof video === 'string') {
            return {
              id: `video_${index}`,
              name: video.video_name,
              url: null,
              timestamp: new Date().toISOString()
            };
          } else {
            return {
              id: `video_${index}`,
              name: video.video_name,
              url: video.video_url || null,
              timestamp: new Date().toISOString()
            };
          }
        }),
        isCompleted: true
      };

      setSelectedCompletedLesson(detailedLesson);
      setActiveLesson(null);
    } catch (error) {
      console.error('Error fetching lesson details:', error);
      toast.error('Fout bij laden van lesdetails');

      // Fallback if the API fails
      const fallbackLesson = {
        id: lesson.id,
        studentId: lesson.studentId,
        studentName: lesson.studentName,
        date: lesson.date,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        linkedVideos: [],
        isCompleted: true
      };
      setSelectedCompletedLesson(fallbackLesson);
      setActiveLesson(null);
    } finally {
      setIsFetchingDetails(false);
    }
  };


  // Link an unlinked video to the active lesson
  const handleLink = videoId => {
    if (!activeLesson) return;
    setIsLinking(true);
    const vid = unlinkedVideos.find(v => v.id === videoId);
    if (!vid) {
      setIsLinking(false);
      return;
    }
    linkVideoToLesson(activeLesson.id, vid)
      .then(v => {
        setUnlinkedVideos(us => us.filter(x => x.id !== v.id));
        setActiveLesson(al => ({
          ...al,
          linkedVideos: [...(al.linkedVideos || []), v]
        }));
        toast.success('Video gekoppeld aan les');
      })
      .catch(error => {
        console.error(error);
        toast.error('Fout bij koppelen van video');
      })
      .finally(() => setIsLinking(false));
  };

  // View a completed lesson's video in a modal
  const handleVideoView = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  // Upload a video (either unlinked or directly into the active lesson)
  const handleUpload = file => {
    setIsUploading(true);
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
          toast.success('Video geüpload en gekoppeld aan les');
        } else {
          setUnlinkedVideos(us => [v, ...us]);
          toast.success('Video geüpload');
        }
      })
      .catch(error => {
        console.error(error);
        toast.error('Fout bij uploaden van video');
      })
      .finally(() => {
        setIsUploading(false);
        setShowUpload(false);
      });
  };

  // Logout and redirect
  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(true); // Opens the sidebar
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false); // Closes the sidebar
  };


  const lessonToShow = activeLesson || selectedCompletedLesson;

  return (
    <div className={styles.page}>
      <Header title="Instructor Dashboard" onLogout={handleLogout} />
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose} // This closes the sidebar
        onLogout={handleLogout}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      {/* <h1>Instructor Dashboard</h1> */}

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <h2>Nieuwe Les Starten</h2>
          <StudentSelect
            students={students}
            value={selectedStudent}
            onChange={setSelectedStudent}
            loading={isLoadingStudents}
          />
          <button
            className={styles.startBtn}
            onClick={handleStart}
            disabled={!selectedStudent || isStarting || isLoadingStudents}
          >
            {isStarting ? 'Bezig met starten...' : 'Les Nu Starten'}
          </button>

          <LessonsPanel
            activeLessons={activeLessons}
            completedLessons={completedLessons}
            selectedLesson={lessonToShow}
            onSelectLesson={(lesson) => {
              if (activeLessons.some(al => al.id === lesson.id)) {
                setActiveLesson(lesson);
                setSelectedCompletedLesson(null);
              } else {
                handleCompletedLessonSelect(lesson);
              }
            }}
            loading={isLoadingActiveLessons || isLoadingCompletedLessons}
            showStudentName={selectedStudent?.id === 'all'}
          />
        </aside>

        <main className={styles.main}>
          {isFetchingDetails ? (
            <div className={styles.loaderCenter}>
              <div className={styles.loader}></div>
            </div>
          ) : lessonToShow ? (
            <LessonDetail
              lesson={lessonToShow}
              onStop={lessonToShow.isCompleted ? null : handleStop}
              onUpload={lessonToShow.isCompleted ? null : () => setShowUpload(true)}
              onVideoView={handleVideoView}
              isStopping={isStopping}
              isUploading={isUploading}
              selectedStudentName={selectedStudent ? selectedStudent.name : ''}
            />
          ) : (
            <div className={styles.emptyState}>
              Selecteer een les of start een nieuwe les
            </div>
          )}

          {/* <section className={styles.videoSection}>
            <div className={styles.videoHeader}>
              <h3>Ongekoppelde Video's</h3>
              <button
                className={styles.newVideoBtn}
                onClick={() => setShowUpload(true)}
                disabled={isUploading}
              >
                {isUploading ? 'Bezig met uploaden...' : 'Nieuwe Video'}
              </button>
            </div>
            <VideoList
              videos={unlinkedVideos}
              onView={id => alert(`Bekijk video ${id}`)}
              onLink={handleLink}
              isLinking={isLinking}
            />
          </section> */}
        </main>
      </div>

      {showUpload && (
        <VideoUploadModal
          lesson={activeLesson}
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
          isUploading={isUploading}
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
