import React from 'react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  helperText = '',
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${label ? label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col w-full text-left ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="font-label-caps text-on-surface-variant mb-2 text-[11px] tracking-wider"
        >
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full bg-transparent border-b border-outline-variant py-2.5 px-0 text-on-surface font-body-md
          focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#dec2a3] transition-[border-color,box-shadow] duration-150 ease-out placeholder-outline/40
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-error/80 focus:border-error focus:shadow-[0_1px_0_0_#ffb4ab]' : ''}
        `}
        {...props}
      />
      
      {error && (
        <span className="text-error text-xs mt-1.5 font-body-sm block">
          {error}
        </span>
      )}
      
      {!error && helperText && (
        <span className="text-on-surface-variant/60 text-xs mt-1.5 font-body-sm block">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;
