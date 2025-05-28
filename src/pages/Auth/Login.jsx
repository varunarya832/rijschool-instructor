import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/dashboard', { replace: true });
    } catch (e) {
      console.log(e);
      
      setError('Ongeldige gebruikersnaam of wachtwoord.');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 style={{"fontWeight":"700px"}}><strong>Inloggen bij EduCapture </strong> 
        </h2>
        {error && <div className={styles.error}>{error}</div>}
        <label>
          E-mailadres
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Wachtwoord
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Bezig…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}