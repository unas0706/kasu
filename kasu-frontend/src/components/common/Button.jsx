import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "btn inline-flex items-center justify-center transition-all";

  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    success: "btn-success",
    danger: "btn-danger",
    outline: "btn-outline",
  };

  const sizes = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
    icon: "btn-icon",
  };

  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    disabled || isLoading ? "opacity-50 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon className="mr-2" size={size === "sm" ? 14 : 16} />
          )}
          {children}
          {Icon && iconPosition === "right" && (
            <Icon className="ml-2" size={size === "sm" ? 14 : 16} />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
