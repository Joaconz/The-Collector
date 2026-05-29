import React from 'react';

const Button = ({
  variant = 'primary', // 'primary' | 'outline' | 'danger'
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center transition-[transform,background-color,border-color,color] duration-200 ease-out font-label-caps py-3.5 px-6 focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97]';
  
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-[#ebd5be] active:bg-[#cdaf8f] border-0',
    outline: 'border border-outline text-on-surface hover:bg-on-surface hover:text-background active:bg-outline',
    danger: 'bg-error-container text-error hover:bg-[#ab1d1d] hover:text-white active:bg-[#850005] border-0'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
