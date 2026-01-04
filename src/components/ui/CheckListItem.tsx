import type { ReactNode } from "react";

type CheckListItemVariant = "default" | "light";

interface CheckListItemProps {
  children: ReactNode;
  variant?: CheckListItemVariant;
  iconSize?: "sm" | "md";
}

const variantStyles: Record<CheckListItemVariant, { icon: string; text: string }> = {
  default: {
    icon: "text-green-600",
    text: "text-gray-700",
  },
  light: {
    icon: "text-white",
    text: "text-white",
  },
};

const iconSizes = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
};

export function CheckListItem({
  children,
  variant = "default",
  iconSize = "md",
}: CheckListItemProps) {
  const styles = variantStyles[variant];

  return (
    <li className="flex items-start">
      <svg
        className={`${iconSizes[iconSize]} ${styles.icon} mr-3 flex-shrink-0 mt-0.5`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span className={styles.text}>{children}</span>
    </li>
  );
}
