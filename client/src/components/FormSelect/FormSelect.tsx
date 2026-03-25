import { forwardRef, type SelectHTMLAttributes } from 'react';
import './FormSelect.css';

type Option = {
  value: string;
  label: string;
};

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly Option[];
  placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className={`form-select ${className}`.trim()}>
        <select ref={ref} className="form-select__control" {...props}>
          {placeholder && <option value="">{placeholder}</option>}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="flex form-select__arrow" aria-hidden="true">
          <svg
            width="11"
            height="7"
            viewBox="0 0 11 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.11105 0C1.17936 0 1.24373 0.0339565 1.28391 0.0888672L5.08859 5.33301L8.89426 0.0888672C8.93444 0.0339625 8.99881 0 9.06711 0H10.071C10.1579 0 10.2088 0.0989614 10.157 0.169922L5.4343 6.68066C5.26416 6.91622 4.9133 6.91633 4.74191 6.68066L0.0202332 0.169922C-0.0305628 0.0989454 0.0201268 0 0.107147 0H1.11105Z"
              fill="black"
              fillOpacity="0.25"
            />
          </svg>
        </span>
      </div>
    );
  },
);

FormSelect.displayName = 'FormSelect';
