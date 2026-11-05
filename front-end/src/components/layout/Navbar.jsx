import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu, User } from "lucide-react";
import Logo from "../ui/Logo";
import Avatar from "../ui/Avatar";
import { clearAuth, getStoredUser } from "../../utils/auth";

const titles = {
  "/": "Dashboard",
  "/add": "Add Product",
  "/profile": "Profile",
};

const getPageTitle = (pathname) => {
  if (pathname.startsWith("/update")) {
    return "Edit Product";
  }

  return titles[pathname] || "Dashboard";
};

export default function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const logout = () => {
    setMenuOpen(false);
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="lg:hidden">
            <Logo />
          </div>

          <h2 className="hidden text-base font-semibold text-slate-900 lg:block">
            {getPageTitle(location.pathname)}
          </h2>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-slate-100"
          >
            <Avatar name={user?.name} size="sm" />
            <span className="hidden max-w-[10rem] truncate text-sm font-medium text-slate-700 sm:block">
              {user?.name || "Account"}
            </span>
            <ChevronDown
              className="hidden h-4 w-4 text-slate-400 sm:block"
              aria-hidden="true"
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-60 animate-slide-up overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-dropdown"
            >
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>

              <Link
                to="/profile"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
              >
                <User className="h-4 w-4 text-slate-400" aria-hidden="true" />
                Profile
              </Link>

              <button
                type="button"
                role="menuitem"
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
