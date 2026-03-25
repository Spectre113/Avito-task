import { useState, type ChangeEvent } from 'react';
import type { Category } from '../../api/items';
import './CategortFilter.css';

export interface CategoryFilterProps {
  value: Category[];
  onChange: (categories: Category[]) => void;
}

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'auto', label: 'Авто' },
  { value: 'electronics', label: 'Электроника' },
  { value: 'real_estate', label: 'Недвижимость' },
];

export const CategoryFilter = ({ value, onChange }: CategoryFilterProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange =
    (category: Category) => (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        onChange(value.includes(category) ? value : [...value, category]);
        return;
      }

      onChange(value.filter((item) => item !== category));
    };

  return (
    <div className="category-filter">
      <button
        type="button"
        className="btn-reset flex category-filter__header"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <h4 className="category-filter__title">Категория</h4>
        <svg
          className={`category-filter__arrow ${
            isOpen ? 'category-filter__arrow--open' : ''
          }`}
          width="13px"
          height="13px"
          viewBox="0 0 11 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.106807 6.85715H1.11127C1.17957 6.85715 1.24386 6.82366 1.28404 6.76875L5.08895 1.52411L8.89386 6.76875C8.93404 6.82366 8.99833 6.85715 9.06663 6.85715H10.0711C10.1581 6.85715 10.209 6.75804 10.1581 6.68706L5.43583 0.17679C5.2644 -0.0589246 4.9135 -0.0589246 4.74341 0.17679L0.0210925 6.68706C-0.0311397 6.75804 0.0197535 6.85715 0.106807 6.85715V6.85715Z"
            fill="black"
          />
        </svg>
      </button>

      <div
        className={`category-filter__content ${
          !isOpen ? 'category-filter__content--hidden' : ''
        }`}
      >
        <div className="flex category-filter__list">
          {CATEGORY_OPTIONS.map((option) => (
            <label key={option.value} className="flex category-filter__item">
              <input
                type="checkbox"
                className="category-filter__checkbox"
                checked={value.includes(option.value)}
                onChange={handleChange(option.value)}
              />
              <span className="category-filter__label">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
