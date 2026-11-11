import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUser } from '../api/userApi.js';
import { useAuth } from '../auth/useAuth.js';

export default function DashboardPage() {
  const { user: sessionUser, token, logout } = useAuth();
  const navigate = useNavigate();
  const userId = sessionUser?.id;

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load the user's record from the protected endpoint using the stored token.
  useEffect(() => {
    let ignore = false; // avoids setting state if the page is left before the request finishes

    async function loadProfile() {
      setLoading(true);
      setError(null);
      try {
        const { user } = await getUser(userId, token);
        if (!ignore) setProfile(user);
      } catch (err) {
        if (ignore) return;
        if (err.status === 401) {
          // Token expired or invalid: end the session and ask the user to log in again.
          logout();
          navigate('/login', { replace: true, state: { sessionExpired: true } });
          return;
        }
        setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      ignore = true;
    };
  }, [userId, token, logout, navigate]);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button type="button" className="button-secondary" onClick={handleLogout}>
          Log out
        </button>
      </header>

      {loading && <p role="status">Loading your profile…</p>}

      {error && (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      )}

      {profile && !loading && (
        <section className="card">
          <h2>Welcome, {profile.username}!</h2>
          <dl className="profile">
            <dt>Email</dt>
            <dd>{profile.email}</dd>
            <dt>Address</dt>
            <dd>{profile.address}</dd>
          </dl>
        </section>
      )}
    </main>
  );
}
