import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = React.forwardRef<HTMLInputElement, Props>(({ label, error, ...rest }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-300">{label}</label>}
      <input
        ref={ref}
        {...rest}
        className="rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;