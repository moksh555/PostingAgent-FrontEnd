/** Mirrors `UserService._validatePassword` in authentication_microservice. */

const SPECIAL = new Set("!@#$%^&*()_+-=[]{}|;:,.<>?/`~");

export const PASSWORD_MIN_LEN = 10;

export type PasswordValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export function validatePasswordForRegister(password: string): PasswordValidationResult {
  if (!password) return { ok: false, message: "Password cannot be empty" };
  if (password.length < PASSWORD_MIN_LEN) {
    return {
      ok: false,
      message: `Password must be at least ${PASSWORD_MIN_LEN} characters`,
    };
  }
  if (password.trim() !== password) {
    return {
      ok: false,
      message: "Password cannot have leading or trailing whitespace",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      ok: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      ok: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!/\d/.test(password)) {
    return { ok: false, message: "Password must contain at least one number" };
  }
  if (![...password].some((c) => SPECIAL.has(c))) {
    return {
      ok: false,
      message:
        "Password must contain at least one special character (! @ # $ … )",
    };
  }
  return { ok: true };
}

export const passwordHelperText =
  "10+ characters, upper, lower, number, special (!@#$…); no spaces at the ends.";
