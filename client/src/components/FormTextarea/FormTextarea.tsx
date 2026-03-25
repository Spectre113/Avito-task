import { forwardRef, type TextareaHTMLAttributes } from 'react';
import './FormTextarea.css';

type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  maxLength?: number;
  currentLength?: number;
};

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ maxLength = 1000, currentLength = 0, ...props }, ref) => {
    return (
      <div className="form-textarea-wrapper">
        <textarea
          ref={ref}
          className="form-textarea"
          maxLength={maxLength}
          {...props}
        />
        <div className="form-textarea__counter">
          {currentLength} / {maxLength}
        </div>
      </div>
    );
  },
);

FormTextarea.displayName = 'FormTextarea';
