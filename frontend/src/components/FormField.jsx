// A labelled input with an optional error message underneath.
// Extra props (required, minLength, autoComplete, ...) are passed through to <input>.
export default function FormField({ label, name, type = 'text', error, ...inputProps }) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p className="field-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
