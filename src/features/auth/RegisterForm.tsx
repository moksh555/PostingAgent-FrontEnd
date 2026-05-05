import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";
import TextField from "../../components/ui/TextField";
import { routes } from "../../config/routes";
import { passwordHelperText } from "../../lib/passwordPolicy";
import {
  phoneHelperText,
  validateRegisterForm,
} from "../../lib/registerFieldValidation";
import { useAuth } from "./AuthContext";
import AuthSplitShell from "./AuthSplitShell";
import GoogleAuthBlock from "./GoogleAuthBlock";
import GoogleOneTapPlaceholder from "./GoogleOneTapPlaceholder";
import { AuthRequestError, postRegister } from "../../services/authApi";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [googleInfo, setGoogleInfo] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<
      Record<
        | "firstName"
        | "lastName"
        | "email"
        | "phoneNumber"
        | "dateOfBirth"
        | "password"
        | "confirmPassword",
        string
      >
    >
  >({});

  const clearField = (
    key: keyof NonNullable<typeof fieldErrors>,
  ) => {
    setFieldErrors((s) => ({ ...s, [key]: undefined }));
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setFormError(null);
    setGoogleInfo(null);

    const values = {
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth,
      password,
      confirmPassword,
    };
    const errs = validateRegisterForm(values);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await postRegister({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        dateOfBirth: `${dateOfBirth}T00:00:00.000Z`,
        password,
      });
      await refreshSession();
      navigate(routes.dashboard, { replace: true });
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
      <AuthSplitShell cardWidth="lg">
        <section
          className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-white/10 dark:bg-black/55 dark:shadow-[0_1px_0_rgba(255,255,255,0.06)] sm:p-8"
          aria-labelledby="register-heading"
        >
          <h2
            id="register-heading"
            className="text-2xl font-semibold tracking-tight text-black dark:text-white"
          >
            Create account
          </h2>
          <p className="mt-2 text-sm text-black/60 dark:text-white/55">
            One account for campaigns, drafts, and history.
          </p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={onSubmit} noValidate>
            <GoogleAuthBlock
              disabled={submitting}
              infoMessage={googleInfo}
              onContinueGoogle={() =>
                setGoogleInfo(
                  "Google sign-up isn’t connected yet — use the form below.",
                )
              }
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                id="reg-first"
                label="First name"
                autoComplete="given-name"
                value={firstName}
                disabled={submitting}
                error={fieldErrors.firstName}
                onChange={(v) => {
                  setFirstName(v);
                  clearField("firstName");
                }}
              />
              <TextField
                id="reg-last"
                label="Last name"
                autoComplete="family-name"
                value={lastName}
                disabled={submitting}
                error={fieldErrors.lastName}
                onChange={(v) => {
                  setLastName(v);
                  clearField("lastName");
                }}
              />
            </div>

            <TextField
              id="reg-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              disabled={submitting}
              error={fieldErrors.email}
              onChange={(v) => {
                setEmail(v);
                clearField("email");
              }}
            />

            <TextField
              id="reg-phone"
              label="Phone number"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={phoneNumber}
              disabled={submitting}
              hint={phoneHelperText}
              error={fieldErrors.phoneNumber}
              onChange={(v) => {
                setPhoneNumber(v);
                clearField("phoneNumber");
              }}
            />

            <TextField
              id="reg-dob"
              label="Date of birth"
              type="date"
              name="dateOfBirth"
              autoComplete="bday"
              value={dateOfBirth}
              disabled={submitting}
              error={fieldErrors.dateOfBirth}
              onChange={(v) => {
                setDateOfBirth(v);
                clearField("dateOfBirth");
              }}
            />

            <TextField
              id="reg-password"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              disabled={submitting}
              hint={passwordHelperText}
              error={fieldErrors.password}
              onChange={(v) => {
                setPassword(v);
                clearField("password");
              }}
            />

            <TextField
              id="reg-confirm"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              disabled={submitting}
              error={fieldErrors.confirmPassword}
              onChange={(v) => {
                setConfirmPassword(v);
                clearField("confirmPassword");
              }}
            />

            {formError ? (
              <p
                className="rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 text-sm text-black/75 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/70"
                role="alert"
              >
                {formError}
              </p>
            ) : null}

            <Button type="submit" variant="invert" disabled={submitting} className="w-full justify-center">
              {submitting ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-black/60 dark:text-white/55">
            Already have an account?{" "}
            <Link
              to={routes.login}
              className="font-semibold text-black underline-offset-4 hover:underline dark:text-white"
            >
              Sign in
            </Link>
          </p>
        </section>
      </AuthSplitShell>
      <GoogleOneTapPlaceholder />
    </>
  );
};

export default RegisterForm;
