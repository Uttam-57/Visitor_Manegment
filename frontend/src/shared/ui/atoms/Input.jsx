import { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Input = forwardRef(({ className, label, error, hasError = false, id, ...props }, ref) => {
  const showError = Boolean(error);
  const isError = hasError || showError;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={twMerge(
          clsx(
            "block w-full rounded-lg border bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-slate-900 dark:text-slate-100 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm",
            isError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 dark:border-slate-700",
            className
          )
        )}
        {...props}
      />
      {showError && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
