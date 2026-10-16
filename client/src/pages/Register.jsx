import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="box">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password (min 6)" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Create account</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}