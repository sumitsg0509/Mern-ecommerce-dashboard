import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function Logo({ to = "/", showText = true, light = false, className = "" }) {
  const content = (
    <>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
      </span>

      {showText && (
        <span
          className={`text-lg font-semibold tracking-tight ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          E-Comm
          <span className={light ? "text-brand-300" : "text-brand-600"}>Dash</span>
        </span>
      )}
    </>
  );

  if (!to) {
    return <div className={`flex items-center gap-2.5 ${className}`}>{content}</div>;
  }

  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 rounded-lg focus-visible:ring-offset-2 ${className}`}
      aria-label="E-CommDash home"
    >
      {content}
    </Link>
  );
}
