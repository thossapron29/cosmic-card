import type { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function PrimaryButton({
  children,
  leftIcon,
  rightIcon,
  className = "",
  type = "button",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-3 rounded-full bg-white px-5 py-3.5 text-[1rem] font-semibold text-[#182142] shadow-[0_14px_30px_rgba(42,31,94,0.16)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(42,31,94,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8d63ff] focus-visible:ring-offset-2 active:scale-[0.98] ${className}`}
      {...props}
    >
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}
