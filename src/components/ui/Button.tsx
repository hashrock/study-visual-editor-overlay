import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "white";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600",
  outline:
    "border-2 border-gray-300 hover:border-gray-400 text-gray-700 bg-transparent",
  white:
    "bg-white text-blue-600 hover:bg-gray-100",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "px-8 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        rounded-lg font-semibold transition-colors
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
