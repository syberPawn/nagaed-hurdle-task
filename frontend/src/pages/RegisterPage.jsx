import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import * as authApi from '../api/authApi.js';
import FormField from '../components/FormField.jsx';
import UsernameSuggestions from '../components/UsernameSuggestions.jsx';

const EMPTY_FORM = { username: '', email: '', password: '', address: '' };

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState(null); // { message, details }
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSuggestionSelect(username) {
    setForm((current) => ({ ...current, username }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authApi.register(form);
      // Send the user to login with a success message and their email pre-filled.
      navigate('/login', { state: { registered: true, email: form.email } });
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
        <h1>Create an account</h1>

        {error && (
          <p className="alert alert-error" role="alert">
            {error.message}
          </p>
        )}

        <FormField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          error={fieldErrors.username}
          autoComplete="username"
          required
          minLength={3}
          maxLength={50}
        />
        <UsernameSuggestions currentUsername={form.username} onSelect={handleSuggestionSelect} />
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
          autoComplete="new-password"
          required
          minLength={8}
        />
        <FormField
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          error={fieldErrors.address}
          autoComplete="street-address"
          required
          maxLength={255}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Register'}
        </button>

        <p className="switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}
