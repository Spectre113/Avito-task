import './FormInput.css';
import { forwardRef, type InputHTMLAttributes } from 'react';

export const FormInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = '', ...props }, ref) => {
  return <input ref={ref} className={`form-input ${className}`.trim()} {...props} />;
});

FormInput.displayName = 'FormInput';
