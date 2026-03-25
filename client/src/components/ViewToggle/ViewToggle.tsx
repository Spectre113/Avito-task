import { GridIcon, ListIcon } from './ViewToggleSvg';
import './ViewToggle.css';

export type ViewMode = 'grid' | 'list';

export interface ViewToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

export const ViewToggle = ({ value, onChange }: ViewToggleProps) => {
  return (
    <div
      className="view-toggle"
      role="group"
      aria-label="Режим отображения объявлений"
    >
      <button
        type="button"
        className={`flex btn-reset flex view-toggle__button ${
          value === 'grid' ? 'view-toggle__button--active' : ''
        }`}
        onClick={() => onChange('grid')}
        aria-pressed={value === 'grid'}
        aria-label="Показать сеткой"
      >
        <GridIcon />
      </button>

      <span className="view-toggle__divider" aria-hidden="true" />

      <button
        type="button"
        className={`flex btn-reset view-toggle__button ${
          value === 'list' ? 'view-toggle__button--active' : ''
        }`}
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
        aria-label="Показать списком"
      >
        <ListIcon />
      </button>
    </div>
  );
};
