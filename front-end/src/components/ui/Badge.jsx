const variants = {
  brand: "badge-brand",
  slate: "badge-slate",
  success: "badge-success",
};

export default function Badge({ variant = "slate", className = "", children }) {
  return (
    <span className={`badge ${variants[variant] || variants.slate} ${className}`}>
      {children}
    </span>
  );
}
