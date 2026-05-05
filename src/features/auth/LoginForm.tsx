import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";
import TextField from "../../components/ui/TextField";
import { routes } from "../../config/routes";
import { useAuth } from "./AuthContext";
import AuthSplitShell from "./AuthSplitShell";
import GoogleAuthBlock from "./GoogleAuthBlock";
import GoogleOneTapPlaceholder from "./GoogleOneTapPlaceholder";
import { AuthRequestError, postLogin } from "../../services/authApi";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [googleInfo, setGoogleInfo] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const next: typeof fieldErrors = {};
    const e = email.trim();
    if (!e) next.email = "Email cannot be empty";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      next.email = "Invalid email address";
    }
    if (!password) next.password = "Password cannot be empty";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setFormError(null);
    setGoogleInfo(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await postLogin({ email: email.trim(), password });
      await refreshSession();
      const from =
        (location.state as { from?: string } | null)?.from ?? routes.dashboard;
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err instanceof AuthRequestError
          ? err.message
          : "Something went wrong. Try again.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AuthSplitShell cardWidth="md">
        <section
          className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-white/10 dark:bg-black/55 dark:shadow-[0_1px_0_rgba(255,255,255,0.06)] sm:p-8"
          aria-labelledby="sign-in-heading"
        >
          <h2
            id="sign-in-heading"
            className="text-2xl font-semibold tracking-tight text-black dark:text-white"
          >
            Sign in
          </h2>
          <p className="mt-2 text-sm text-black/60 dark:text-white/55">
            Welcome back. Pick up where you left off.
          </p>

          <form className="mt-8 flex flex-col gap-6" onSubmit={onSubmit} noValidate>
            <GoogleAuthBlock
              disabled={submitting}
              infoMessage={googleInfo}
              onContinueGoogle={() =>
                setGoogleInfo(
                  "Google sign-in isn’t connected yet — use email and password for now.",
                )
              }
            />

            <TextField
              id="login-email"
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              disabled={submitting}
              error={fieldErrors.email}
              onChange={(v) => {
                setEmail(v);
                if (fieldErrors.email) setFieldErrors((s) => ({ ...s, email: undefined }));
              }}
            />
            <TextField
              id="login-password"
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              disabled={submitting}
              error={fieldErrors.password}
              onChange={(v) => {
                setPassword(v);
                if (fieldErrors.password)
                  setFieldErrors((s) => ({ ...s, password: undefined }));
              }}
            />

            {formError ? (
              <p
                className="rounded-lg border border-black/10 bg-black/3 px-3 py-2 text-sm text-black/75 dark:border-white/10 dark:bg-white/6 dark:text-white/70"
                role="alert"
              >
                {formError}
              </p>
            ) : null}

            <Button type="submit" variant="invert" disabled={submitting} className="w-full justify-center">
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-black/60 dark:text-white/55">
            Don&apos;t have an account?{" "}
            <Link
              to={routes.register}
              className="font-semibold text-black underline-offset-4 hover:underline dark:text-white"
            >
              Create account
            </Link>
          </p>
        </section>
      </AuthSplitShell>
      <GoogleOneTapPlaceholder />
    </>
  );
};

export default LoginForm;
