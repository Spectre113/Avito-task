import type { ChangeEvent } from 'react';
import './SortSelect.css';

export type SortValue =
  | 'createdAt_desc'
  | 'createdAt_asc'
  | 'title_asc'
  | 'title_desc';

export interface SortSelectProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
}

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: 'createdAt_desc', label: 'По новизне (сначала новые)' },
  { value: 'createdAt_asc', label: 'По новизне (сначала старые)' },
  { value: 'title_asc', label: 'По названию (А-Я)' },
  { value: 'title_desc', label: 'По названию (Я-А)' },
];

export const SortSelect = ({ value, onChange }: SortSelectProps) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as SortValue);
  };

  return (
    <div className="sort-select">
      <select
        className="sort-select__control"
        value={value}
        onChange={handleChange}
        aria-label="Сортировка объявлений"
        name={value}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span className="sort-select__arrow" aria-hidden="true">
        <svg
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.106807 6.85715H1.11127C1.17957 6.85715 1.24386 6.82366 1.28404 6.76875L5.08895 1.52411L8.89386 6.76875C8.93404 6.82366 8.99833 6.85715 9.06663 6.85715H10.0711C10.1581 6.85715 10.209 6.75804 10.1581 6.68706L5.43583 0.17679C5.2644 -0.0589246 4.9135 -0.0589246 4.74341 0.17679L0.0210925 6.68706C-0.0311397 6.75804 0.0197535 6.85715 0.106807 6.85715V6.85715Z"
            fill="black"
          />
        </svg>
      </span>
    </div>
  );
};
