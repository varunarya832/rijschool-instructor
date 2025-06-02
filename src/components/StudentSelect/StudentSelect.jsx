import React from 'react';
import styles from './StudentSelect.module.css';

export default function StudentSelect({ students, value, onChange }) {
  return (
    <select
      className={styles.select}
      value={value ? value.id : ''}
      onChange={e => {
        if (e.target.value === 'all') {
          onChange({ id: 'all', name: 'Alle Lessen' });
        } else {
          const s = students.find(x => x.id === e.target.value);
          onChange(s || null);
        }
      }}
    >
      <option value="">-- Selecteer een leerling --</option>
      <option value="all">-- Alle Lessen --</option>

      {students.map(s => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  );
}
