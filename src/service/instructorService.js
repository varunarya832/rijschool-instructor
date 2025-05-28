
import { BASE_URL } from "../constants";
import { fetchAPI } from "./api";
import { handleResponse } from "./handleResponse";

let activeLessons = [];
let completedLessons = [];
let videos = [
  { id: 'v1', timestamp: '2025-05-26T16:53:00' },
  { id: 'v2', timestamp: '2025-05-26T16:43:00' },
  { id: 'v3', timestamp: '2025-05-26T16:42:00' },
  { id: 'v4', timestamp: '2025-05-26T16:39:00' },
  { id: 'v5', timestamp: '2025-05-26T16:27:00' },
];

export async function getStudents() {
  const options = { method: "GET", redirect: "follow" };
  try {
    const response = await fetchAPI(`${BASE_URL}/api/instructor/students`, options);
    const result = await handleResponse(response);
    if (!result.success) throw new Error(result.message || "Failed to fetch students");
    const arr = result.data?.data;
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error("No students found");
    }
    return arr;
  } catch (err) {
    console.error("Error fetching students:", err.message);
    throw err;
  }
}

export async function getActiveLessons() {
  // shallow-copy so callers can’t mutate our internal array
  return [...activeLessons];
}

export async function getCompletedLessons() {
  return [...completedLessons];
}

export async function getUnlinkedVideos() {
  const options = { method: "GET", redirect: "follow" };
  try {
    const response = await fetchAPI(`${BASE_URL}/api/instructor/lessons`, options);
    const result = await handleResponse(response);
    if (!result.success) throw new Error(result.message || "Failed to fetch lessons");
    const lessonsArray = result.data?.data;
    if (!Array.isArray(lessonsArray) || lessonsArray.length === 0) {
      throw new Error("No lessons found");
    }
    return lessonsArray.map(lesson => ({
      id: lesson.id,
      videos: lesson.videos,
      date: new Date(lesson.date),
      start: new Date(lesson.start_time),
      end: new Date(lesson.end_time),
    }));
  } catch (err) {
    console.error("Error fetching lessons:", err.message);
    throw err;
  }
}

export async function startLesson(studentId, studentName) {
  const now = new Date();
  const lesson = {
    id:studentId ,
    studentId,
    studentName,
    date: now.toISOString().split('T')[0],
    startTime: now.toTimeString().slice(0, 5),
    endTime: null,
    linkedVideos: [],
  };
  activeLessons = [lesson];
  return lesson;
}

export async function stopLesson(lessonId) {
  const idx = activeLessons.findIndex(l => l.id === lessonId);
  if (idx === -1) throw new Error(`No active lesson found with id ${lessonId}`);

  const lesson = activeLessons[idx];
  const now = new Date();
  lesson.endTime = now.toTimeString().slice(0, 5);

  const formattedDate = now.toLocaleDateString("en-GB", {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const formattedStart = `${formattedDate} ${lesson.startTime}`;
  const formattedEnd = `${formattedDate} ${lesson.endTime}`;

  const body = {
    student_id: lesson.studentId,
    start_time: formattedStart,
    end_time: formattedEnd,
    date: formattedDate,
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    redirect: "follow",
  };

  try {
    const response = await fetchAPI(`${BASE_URL}/api/instructor/update_lesson`, options);
    const result = await handleResponse(response);
    if (!result.success) {
      throw new Error(result.message || "Failed to stop lesson");
    }

    completedLessons = [
      {
        id: lesson.id,
        studentId: lesson.studentId,
        studentName: lesson.studentName,
        date: lesson.date,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        linkedVideosCount: lesson.linkedVideos.length,
      },
      ...completedLessons,
    ];
    activeLessons = [];

    // return the local lesson object, so your component
    // can pick out id, studentId, studentName, date, startTime, endTime, and linkedVideos
    return lesson;
  } catch (err) {
    console.error("Error stopping lesson:", err.message);
    throw err;
  }
}

export async function linkVideoToLesson(lessonId, videoObj) {
  // no global mock array any more—
  // if you have a backend endpoint for linking, call it here.
  // otherwise just return the passed-through object so the UI can splice it in.
  return videoObj;
}

export async function uploadVideoToLesson(lessonId, file) {
  const lesson = activeLessons.find(l => l.id === lessonId);
  if (!lesson) throw new Error(`Active lesson not found: ${lessonId}`);

  const newVid = {
    id: 'v' + Date.now(),
    timestamp: new Date().toISOString(),
    filename: file.name,
  };
  lesson.linkedVideos.push(newVid);
  return newVid;
}

export async function uploadUnlinkedVideo(file) {
  const newVid = {
    id: 'v' + Date.now(),
    timestamp: new Date().toISOString(),
    filename: file.name,
  };
  videos.unshift(newVid);
  return newVid;
}
