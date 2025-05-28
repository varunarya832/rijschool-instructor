import React from 'react';
import styles from './StudentSelect.module.css';

export default function StudentSelect({ students, value, onChange }) {
  return (
    <select
      className={styles.select}
      value={value ? value.id : ''}
      onChange={e => {
        const s = students.find(x => x.id === e.target.value);
        onChange(s || null);
      }}
    >
      <option value="">-- Selecteer een leerling --</option>
      {students.map(s => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  );
}
