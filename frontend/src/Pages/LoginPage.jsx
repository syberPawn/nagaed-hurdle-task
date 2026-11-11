import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth.js';
import FormField from '../components/FormField.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Set by RegisterPage after registering, or by DashboardPage when the token has expired.
  const justRegistered = location.state?.registered === true;
  const sessionExpired = location.state?.sessionExpired === true;

  const [form, setForm] = useState({ email: location.state?.email ?? '', password: '' });
  const [error, setError] = useState(null); // { message, details }
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(form);
      // replace: pressing Back from the dashboard should not return to the login form.
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError({ message: err.message, details: err.details ?? {} });
    } finally {
      setLoading(false);
    }
  }

  const fieldErrors = error?.details ?? {};

  return (
    <main className="auth-page">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Log in</h1>

        {justRegistered && !error && (
          <p className="alert alert-success" role="status">
            Account created. Please log in.
          </p>
        )}
        {sessionExpired && !error && (
          <p className="alert alert-info" role="status">
            Your session has expired. Please log in again.
          </p>
        )}
        {error && (
          <p className="alert alert-error" role="alert">
            {error.message}
          </p>
        )}

        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          autoComplete="email"
          required
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="current-password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <p className="switch">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}
