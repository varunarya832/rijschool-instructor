import React from 'react';
import styles from './LessonList.module.css';
import LessonItem from '../LessonItem/LessonItem';

const LessonList = ({ lessons, selectedId, onSelect }) => (
  <div className={styles.list}>
    {lessons.map(lesson => (
      <LessonItem
        key={lesson.id}
        lesson={lesson}
        isActive={lesson.id === selectedId}
        onClick={() => onSelect(lesson.id)}
      />
    ))}
  </div>
);

export default LessonList;
