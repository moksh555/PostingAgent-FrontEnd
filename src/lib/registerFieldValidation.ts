/**
 * Client-side checks aligned with `UserService` in authentication_microservice
 * (names, email shape, phone, DOB age bounds).
 */

import { validatePasswordForRegister } from "./passwordPolicy";

const PHONE_MIN_DIGITS = 8;
const PHONE_MAX_LEN = 20;
const MIN_AGE = 13;
const MAX_AGE = 120;

export function countDigits(s: string): number {
  return [...s].filter((c) => c >= "0" && c <= "9").length;
}

function parseDateParts(isoDate: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

export function ageFromDateParts(
  y: number,
  mo: number,
  d: number,
  today = new Date(),
): number {
  const todayY = today.getFullYear();
  const todayM = today.getMonth() + 1;
  const todayD = today.getDate();
  let age = todayY - y;
  if (todayM < mo || (todayM === mo && todayD < d)) age -= 1;
  return age;
}

export type RegisterFieldErrors = Partial<
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
>;

export function validateRegisterForm(values: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
}): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};

  if (!values.firstName.trim()) errors.firstName = "First name cannot be empty";
  if (!values.lastName.trim()) errors.lastName = "Last name cannot be empty";

  const email = values.email.trim().toLowerCase();
  if (!email) errors.email = "Email cannot be empty";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email address";
  }

  const phone = values.phoneNumber.trim();
  if (!phone) errors.phoneNumber = "Phone number cannot be empty";
  else if (countDigits(phone) < PHONE_MIN_DIGITS || phone.length > PHONE_MAX_LEN) {
    errors.phoneNumber = "Invalid phone number length";
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required";
  } else {
    const parts = parseDateParts(values.dateOfBirth);
    if (!parts) {
      errors.dateOfBirth = "Date of birth is not valid";
    } else {
      const { y, m, d } = parts;
      const dob = new Date(y, m - 1, d);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dob > today) {
        errors.dateOfBirth = "Date of birth cannot be in the future";
      } else {
        const age = ageFromDateParts(y, m, d);
        if (age < MIN_AGE) {
          errors.dateOfBirth = `You must be at least ${MIN_AGE} years old to register`;
        } else if (age > MAX_AGE) {
          errors.dateOfBirth = "Date of birth is not valid";
        }
      }
    }
  }

  const pw = validatePasswordForRegister(values.password);
  if (!pw.ok) errors.password = pw.message;

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export const phoneHelperText = `At least ${PHONE_MIN_DIGITS} digits; max ${PHONE_MAX_LEN} characters.`;
