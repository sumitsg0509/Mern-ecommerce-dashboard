import { BarChart3, Boxes, ShieldCheck } from "lucide-react";
import Logo from "../ui/Logo";

const highlights = [
  {
    icon: Boxes,
    title: "Manage products easily",
    text: "Add, edit, search and delete your catalogue in seconds.",
  },
  {
    icon: BarChart3,
    title: "Live dashboard stats",
    text: "See product count, inventory value and users at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by design",
    text: "JWT authentication with hashed passwords and validated requests.",
  },
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative">
          <Logo to={null} light />
        </div>

        <div className="relative max-w-md">
          <h1 className="text-3xl font-semibold leading-tight">
            Run your store dashboard like a pro.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            A clean, fast and secure admin experience for managing your
            e-commerce products.
          </p>

          <ul className="mt-8 space-y-5">
            {highlights.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-400">
          © {new Date().getFullYear()} E-CommDash
        </p>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
