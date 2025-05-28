import { BASE_URL } from "../constants";
import { fetchAPI } from "./api";
import { handleResponse } from "./handleResponse";
const axios = require('axios');

export async function getAllLessons() {


  const options = {
    method: "GET",
    redirect: "follow",
  };

  try {
    const response = await fetchAPI(`${BASE_URL}/api/lessons`, options);
    const result = await handleResponse(response);

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch lessons");
    }

    const lessonsArray = result.data?.data;
    console.log(lessonsArray);
    
    if (!Array.isArray(lessonsArray) || lessonsArray.length === 0) {
      throw new Error("No lessons found");
    }

    return lessonsArray.map((lesson) => ({
      id: lesson.id,
      videos: lesson.videos,
      date: new Date(lesson.date),
      start: new Date(lesson.start_time),
      end: new Date(lesson.end_time),
    }));
  } catch (error) {
    console.error("Error fetching lessons:", error.message);
    throw error;
  }
}

export async function getLessonDetails(id) {
  const options = {
    method: "GET",
    // redirect: "follow",
  };

  const response = await fetchAPI(
    `${BASE_URL}/api/lessons_details?id=${encodeURIComponent(id)}`,
    options
  );
  const result = await handleResponse(response);
  if (!result.success) {
    throw new Error(result.message || "Failed to fetch lesson details");
  }
  
  const lesson = result.data?.data.lesson;
  console.log(result);
  
  if (!lesson || !Array.isArray(lesson.videos)) {
    return [];
  }

  return lesson.videos.map(v => ({
    id: v.video_name,
    name: v.video_name,
    url: v.video_url
  }));
}