import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
  };

  // Ensure buttons have proper accessibility attributes
  const ariaProps = {
    role: "button",
    tabIndex: 0,
    ...props,
  };

  return (
    <button
      className={`${variantClasses[variant]} ${className}`}
      {...ariaProps}
    >
      {children}
    </button>
  );
};
