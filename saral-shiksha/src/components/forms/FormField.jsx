// src/components/forms/FormField.jsx
// Reusable accessible form field: label + input + error message.
// Ties the error to the input via aria-describedby for screen readers.
// Used by SignupPage, LoginPage, TeacherLoginPage, and future form pages.

/**
 * @param {object}  props
 * @param {string}  props.id          - Unique id linking <label>, <input>, and error
 * @param {string}  props.label       - Visible label text
 * @param {string}  props.type        - Input type ("text"|"email"|"password")
 * @param {string}  props.value       - Controlled value
 * @param {Function} props.onChange   - Change handler
 * @param {string}  [props.autoComplete] - HTML autocomplete hint
 * @param {string}  [props.placeholder]
 * @param {string}  [props.error]     - Validation error string (empty = no error)
 * @param {boolean} [props.required]
 */
export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  placeholder,
  error,
  required = false,
}) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <label
        htmlFor={id}
        className="text-sm font-semibold text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
        )}
      </label>

      {/* Input */}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? "true" : "false"}
        className={`
          w-full rounded-xl border px-4 py-3 text-sm text-gray-900
          bg-white placeholder-gray-400
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
          ${error
            ? "border-red-400 focus:ring-red-400 bg-red-50"
            : "border-gray-300 hover:border-indigo-400"
          }
        `}
      />

      {/* Error message — linked via aria-describedby */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-0.5"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}
