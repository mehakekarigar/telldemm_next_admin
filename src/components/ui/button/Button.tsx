// components/ui/button/Button.tsx
import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline" | "destructive" | "classic";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  title,
  type = "button",
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  const variantClasses: Record<string, string> = {
    primary: "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:bg-red-300",
    classic: "bg-gray-500 text-white shadow-sm hover:bg-gray-600 disabled:bg-gray-300",
  };

  return (
    <button
      type={type}
      title={title}
      aria-disabled={disabled}
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${sizeClasses[size]} ${
        variantClasses[variant]
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
