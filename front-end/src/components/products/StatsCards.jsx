import { Boxes, Users, Wallet } from "lucide-react";
import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";
import { formatCurrency, formatNumber } from "../../utils/format";

const items = [
  {
    key: "totalProducts",
    label: "Total Products",
    icon: Boxes,
    tint: "bg-brand-50 text-brand-600",
    format: formatNumber,
  },
  {
    key: "inventoryValue",
    label: "Inventory Value",
    icon: Wallet,
    tint: "bg-emerald-50 text-emerald-600",
    format: formatCurrency,
  },
  {
    key: "users",
    label: "Users",
    icon: Users,
    tint: "bg-amber-50 text-amber-600",
    format: formatNumber,
  },
];

export default function StatsCards({ stats, loading }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map(({ key, label, icon: Icon, tint, format }) => (
        <Card key={key} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">{label}</p>

              {loading ? (
                <Skeleton className="mt-2 h-8 w-24" />
              ) : (
                <p className="mt-1 truncate text-2xl font-semibold tracking-tight text-slate-900">
                  {format(stats[key] || 0)}
                </p>
              )}
            </div>

            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tint}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
