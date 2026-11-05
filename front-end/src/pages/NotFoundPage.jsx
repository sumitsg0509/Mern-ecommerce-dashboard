import { useNavigate } from "react-router-dom";
import { ArrowLeft, Compass, Home } from "lucide-react";
import Button from "../components/ui/Button";
import { isAuthenticated } from "../utils/auth";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const signedIn = isAuthenticated();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md animate-slide-up text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Compass className="h-8 w-8" aria-hidden="true" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-brand-600">
          404
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Go back
          </Button>

          <Button onClick={() => navigate(signedIn ? "/" : "/login")}>
            <Home className="h-4 w-4" aria-hidden="true" />
            {signedIn ? "Dashboard" : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
