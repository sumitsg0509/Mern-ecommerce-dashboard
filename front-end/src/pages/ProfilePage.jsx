import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  LogOut,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { clearAuth, getStoredUser } from "../utils/auth";

export default function ProfilePage() {
  const user = getStoredUser();
  const navigate = useNavigate();

  const details = [
    {
      label: "Full name",
      value: user?.name || "—",
      icon: User,
    },
    {
      label: "Email address",
      value: user?.email || "—",
      icon: Mail,
    },
    {
      label: "Member since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "—",
      icon: CalendarDays,
    },
  ];

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your account details and session."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar name={user?.name} size="lg" />

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {user?.name || "User"}
            </h2>
            <p className="mt-0.5 break-all text-sm text-slate-500">
              {user?.email}
            </p>

            <Badge variant="success" className="mt-3">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Authenticated
            </Badge>

            <Button variant="danger" className="mt-6 w-full" onClick={logout}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </Button>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-900">
            Account information
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Details stored in your account.
          </p>

          <dl className="mt-5 divide-y divide-slate-100">
            {details.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <dt className="flex items-center gap-2 text-sm text-slate-500">
                  <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="break-all text-right text-sm font-medium text-slate-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </>
  );
}
