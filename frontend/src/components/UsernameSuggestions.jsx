import { useState } from 'react';
import { suggestUsernames } from '../api/aiApi.js';

const PRESET_INTERESTS = [
  'Music',
  'Gaming',
  'Travel',
  'Sports',
  'Art',
  'Coding',
  'Food',
  'Books',
  'Movies',
  'Fitness',
];

// Same limits as the AI service (ai-service/app/schemas.py).
const MAX_INTERESTS = 10;
const MAX_INTEREST_LENGTH = 50;

const sameInterest = (a) => (b) => a.toLowerCase() === b.toLowerCase();

// Lets the user pick interests (presets or their own) and get AI username ideas.
// Clicking a suggestion calls onSelect(username). Optional: registration works without it.
export default function UsernameSuggestions({ currentUsername, onSelect }) {
  const [interests, setInterests] = useState([]);
  const [customInterest, setCustomInterest] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isSelected = (interest) => interests.some(sameInterest(interest));
  const isFull = interests.length >= MAX_INTERESTS;

  // Presets first, then any custom interests the user added.
  const chips = [...PRESET_INTERESTS, ...interests.filter((i) => !PRESET_INTERESTS.some(sameInterest(i)))];

  function toggleInterest(interest) {
    setInterests((current) => {
      if (current.some(sameInterest(interest))) {
        return current.filter((i) => !sameInterest(interest)(i));
      }
      return current.length < MAX_INTERESTS ? [...current, interest] : current;
    });
  }

  function addCustomInterest() {
    const value = customInterest.trim();
    if (!value) return;
    // Typing a preset (e.g. "music") selects that chip rather than adding a duplicate.
    const preset = PRESET_INTERESTS.find(sameInterest(value));
    const interest = preset ?? value;
    if (!isSelected(interest) && !isFull) {
      setInterests((current) => [...current, interest]);
    }
    setCustomInterest('');
  }

  function handleCustomKeyDown(event) {
    // Enter adds the interest instead of submitting the registration form.
    // isComposing: ignore Enter used to confirm text in IME keyboards (e.g. Japanese).
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault();
      addCustomInterest();
    }
  }

  async function handleSuggest() {
    setLoading(true);
    setError(null);

    try {
      const data = await suggestUsernames(interests);
      setSuggestions(data.suggestions);
    } catch (err) {
      setSuggestions([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <fieldset className="suggestions">
      <legend>Need ideas? Pick a few interests</legend>

      <div className="chips">
        {chips.map((interest) => {
          const selected = isSelected(interest);
          return (
            <button
              key={interest}
              type="button"
              className="chip"
              aria-pressed={selected}
              disabled={!selected && isFull}
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </button>
          );
        })}
      </div>

      <div className="add-interest">
        <input
          type="text"
          value={customInterest}
          onChange={(event) => setCustomInterest(event.target.value)}
          onKeyDown={handleCustomKeyDown}
          placeholder="Add your own…"
          aria-label="Add your own interest"
          maxLength={MAX_INTEREST_LENGTH}
          disabled={isFull}
        />
        <button
          type="button"
          className="button-secondary"
          onClick={addCustomInterest}
          disabled={isFull || !customInterest.trim()}
        >
          Add
        </button>
      </div>

      <p className="hint">
        {interests.length}/{MAX_INTERESTS} selected
      </p>

      <button
        type="button"
        className="button-secondary"
        onClick={handleSuggest}
        disabled={loading || interests.length === 0}
      >
        {loading ? 'Suggesting…' : 'Suggest usernames'}
      </button>

      {/* aria-live: screen readers announce new suggestions or errors. */}
      <div aria-live="polite">
        {error && <p className="alert alert-error">{error}</p>}

        {suggestions.length > 0 && (
          <>
            <p className="hint">Click a suggestion to use it:</p>
            <div className="chips">
              {suggestions.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="chip chip-suggestion"
                  aria-pressed={name === currentUsername}
                  onClick={() => onSelect(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </fieldset>
  );
}
