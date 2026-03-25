import './FormField.css';
import type { ReactNode } from 'react';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  onClear?: () => void;
  characteristic?: boolean;
  warning?: boolean;
  actions?: ReactNode;
}

export const FormField = ({
  label,
  required,
  error,
  children,
  onClear,
  characteristic = false,
  warning = false,
  actions,
}: FormFieldProps) => {
  return (
    <div data-name={label} data-required={required} className="form-field">
      <div className="form-field__label-row">
        <label
          data-characteristic={characteristic}
          className="form-field__label"
        >
          {required && <span className="form-field__required">*</span>}
          {label}
        </label>
        {actions && <div className="form-field__actions">{actions}</div>}
      </div>

      <div
        data-name={label}
        className={`form-field__control ${
          error ? 'form-field__control--error' : ''
        } ${warning ? 'form-field__control--warning' : ''}`}
      >
        {children}

        {onClear && (
          <button
            type="button"
            className="btn-reset form-field__clear"
            onClick={onClear}
          >
            <svg width="13" height="13" viewBox="0 0 13 13">
              <path
                d="M6.125 0C2.74258 0 0 2.74258 0 6.125C0 9.50742 2.74258 12.25 6.125 12.25C9.50742 12.25 12.25 9.50742 12.25 6.125C12.25 2.74258 9.50742 0 6.125 0ZM8.38633 8.45195L7.48398 8.44785L6.125 6.82773L4.76738 8.44648L3.86367 8.45059C3.80352 8.45059 3.7543 8.40273 3.7543 8.34121C3.7543 8.31523 3.76387 8.29063 3.78027 8.27012L5.55898 6.15098L3.78027 4.0332C3.76375 4.01317 3.75459 3.98808 3.7543 3.96211C3.7543 3.90195 3.80352 3.85273 3.86367 3.85273L4.76738 3.85684L6.125 5.47695L7.48262 3.8582L8.38496 3.8541C8.44512 3.8541 8.49434 3.90195 8.49434 3.96348C8.49434 3.98945 8.48477 4.01406 8.46836 4.03457L6.69238 6.15234L8.46973 8.27148C8.48613 8.29199 8.4957 8.3166 8.4957 8.34258C8.4957 8.40273 8.44648 8.45195 8.38633 8.45195Z"
                fill="currentColor"
                fillOpacity="0.25"
              />
            </svg>
          </button>
        )}
      </div>

      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
};
