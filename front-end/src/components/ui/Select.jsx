import { useId } from "react";
import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  id,
  className = "",
  children,
  ...props
}) {
  const autoId = useId();
  const selectId = id || autoId;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="label">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className="input cursor-pointer appearance-none pr-9"
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
