import React, { forwardRef, InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  className?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(function InputBase(
  { label, error, className, ...props },
  ref
) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        ref={ref}
        {...props}
        className={`w-full border rounded px-3 py-2 outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.name}-error` : undefined}
      />
      {error && (
        <div id={`${props.name}-error`} className="text-xs text-red-600 mt-1">
          {error}
        </div>
      )}
    </div>
  );
});

export default Input;