import { useEffect } from 'react';
import { Spinner } from '../Spinner/Spinner';
import './AiSuggestionModal.css';

export type AiSuggestionModalProps = {
  title: string;
  text: string;
  isLoading?: boolean;
  error?: string | null;
  onApply: () => void;
  onClose: () => void;
};

export const AiSuggestionModal = ({
  title,
  text,
  isLoading = false,
  error,
  onApply,
  onClose,
}: AiSuggestionModalProps) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="ai-modal" role="dialog" aria-modal="true">
      <div className="ai-modal__backdrop" onClick={onClose} />
      <div className="ai-modal__content">
        <div className="ai-modal__header">{title}</div>

        <div className="ai-modal__body">
          {isLoading ? (
            <div className="ai-modal__loader">
              <Spinner />
            </div>
          ) : error ? (
            <div className="ai-modal__error">{error}</div>
          ) : (
            <pre className="ai-modal__text">{text}</pre>
          )}
        </div>

        <div className="ai-modal__actions">
          <button
            type="button"
            className="btn-reset ai-modal__button ai-modal__button--primary"
            onClick={onApply}
            disabled={isLoading || Boolean(error) || !text.trim()}
          >
            Применить
          </button>
          <button
            type="button"
            className="btn-reset ai-modal__button ai-modal__button--secondary"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

