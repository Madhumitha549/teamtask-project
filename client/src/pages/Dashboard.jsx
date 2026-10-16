import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
    api.get('/tasks')
      .then((res) => setTasks(res.data))
      .catch(() => setError('Could not load tasks'));
  }, [navigate]);

  const addTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/tasks', { title });
      setTasks([res.data, ...tasks]);
      setTitle('');
    } catch {
      setError('Could not add task');
    }
  };

  const toggleTask = async (id) => {
    const res = await api.patch(`/tasks/${id}`);
    setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
  };

  const removeTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="box wide">
      <h2>Welcome, {user.name}!</h2>
      <p>{user.email}</p>

      <form onSubmit={addTask} className="row">
        <input
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit" className="small">Add</button>
      </form>
      {error && <p className="error">{error}</p>}

      <ul className="tasks">
        {tasks.length === 0 && <li>No tasks yet.</li>}
        {tasks.map((t) => (
          <li key={t.id}>
            <span
              className={t.status === 'done' ? 'done' : ''}
              onClick={() => toggleTask(t.id)}
            >
              {t.title}
            </span>
            <button className="small" onClick={() => removeTask(t.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={logout}>Logout</button>
    </div>
  );
}