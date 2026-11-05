import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, LockKeyhole, Mail, User } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../api";
import { useToast } from "../context/ToastContext";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const validate = () => {
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      await api.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      toast.success("Account created. Please sign in.");
      navigate("/login");
    } catch (error) {
      setFormError(error.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const clearError = (field) => (event) => {
    const setter = {
      name: setName,
      email: setEmail,
      password: setPassword,
      confirmPassword: setConfirmPassword,
    }[field];

    setter(event.target.value);
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <AuthLayout>
      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Start managing your store in a minute.
        </p>

        {formError && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          <Input
            label="Full name"
            placeholder="John Doe"
            icon={User}
            autoComplete="name"
            value={name}
            onChange={clearError("name")}
            error={errors.name}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            autoComplete="email"
            value={email}
            onChange={clearError("email")}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            icon={LockKeyhole}
            autoComplete="new-password"
            value={password}
            onChange={clearError("password")}
            error={errors.password}
          />

          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            icon={LockKeyhole}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={clearError("confirmPassword")}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            size="lg"
            loading={submitting}
            className="w-full"
          >
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
