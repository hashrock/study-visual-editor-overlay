import type { ReactNode, HTMLAttributes } from "react";

type CardVariant = "default" | "outlined" | "highlighted";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
  hover?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-gray-50",
  outlined: "bg-white border-2 border-gray-200",
  highlighted: "bg-blue-600 border-2 border-blue-600 transform scale-105 shadow-xl",
};

const hoverStyles: Record<CardVariant, string> = {
  default: "hover:shadow-lg",
  outlined: "hover:border-blue-500",
  highlighted: "",
};

export function Card({
  variant = "default",
  hover = true,
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        ${variantStyles[variant]}
        ${hover ? hoverStyles[variant] : ""}
        p-8 rounded-xl transition-all
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
