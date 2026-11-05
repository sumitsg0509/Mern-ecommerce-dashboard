import { Link } from "react-router-dom";
import { Package, Pencil, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import { formatCurrency } from "../../utils/format";

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[640px]">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th scope="col" className="table-th">
              Product
            </th>
            <th scope="col" className="table-th">
              Category
            </th>
            <th scope="col" className="table-th">
              Brand
            </th>
            <th scope="col" className="table-th text-right">
              Price
            </th>
            <th scope="col" className="table-th text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr
              key={product._id}
              className="transition-colors hover:bg-slate-50/70"
            >
              <td className="table-td">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                    <Package className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="font-medium text-slate-900">
                    {product.name}
                  </span>
                </div>
              </td>

              <td className="table-td">
                <Badge variant="brand">{product.category}</Badge>
              </td>

              <td className="table-td text-slate-500">{product.brand}</td>

              <td className="table-td text-right font-semibold tabular-nums text-slate-900">
                {formatCurrency(product.price)}
              </td>

              <td className="table-td">
                <div className="flex justify-end gap-1">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
