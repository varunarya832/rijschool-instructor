import React from 'react';
import { FiLoader } from 'react-icons/fi';
import styles from './StudentSelect.module.css';

export default function StudentSelect({ students, value, onChange, loading }) {
  const handleChange = e => {
    if (loading) return;
    const selectedValue = e.target.value;

    if (selectedValue === 'all') {
      onChange({ id: 'all', name: 'Alle Lessen' });
    } else {
      const student = students.find(s => s.id === selectedValue);
      onChange(student || null);
    }
  };

  return (
    <div className={styles.wrapper}>
      <label htmlFor="student-select" className={styles.label}>
        Kies een leerling
      </label>
      <div className={styles.selectWrapper}>
        <select
          id="student-select"
          className={styles.select}
          value={value ? value.id : ''}
          onChange={handleChange}
          disabled={loading}
          aria-label="Student selectie"
        >
          {loading ? (
            <option value="">⏳ Laden...</option>
          ) : (
            <>
              <option value="" disabled>
                -- Selecteer een leerling --
              </option>
              <option value="all" className={styles.allOption}>
                -- Alle Lessen --
              </option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </>
          )}
        </select>
        {loading && (
          <FiLoader className={styles.spinner} />
        )}
      </div>
    </div>
  );
}
