import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import { formatCurrency } from "../../utils/format";

export default function ProductCards({ products, onDelete }) {
  return (
    <div className="grid gap-3 p-4 md:hidden">
      {products.map((product) => (
        <div
          key={product._id}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {product.name}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{product.brand}</p>
            </div>

            <Badge variant="brand">{product.category}</Badge>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-lg font-semibold tabular-nums text-slate-900">
              {formatCurrency(product.price)}
            </p>

            <div className="flex gap-1">
              <Link
                to={`/update/${product._id}`}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-600"
                aria-label={`Edit ${product.name}`}
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </Link>

              <button
                type="button"
                onClick={() => onDelete(product)}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                aria-label={`Delete ${product.name}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
