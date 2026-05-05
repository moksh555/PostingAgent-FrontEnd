import axios, { type AxiosError } from "axios";

export type AuthApiErrorBody = {
  code?: string;
  message?: string;
  details?: unknown;
};

export class AuthRequestError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "AuthRequestError";
    this.status = status;
    this.code = code;
  }
}

function authBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_AUTH_BASE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return "http://127.0.0.1:8000";
  return "";
}

export const authApi = axios.create({
  baseURL: authBaseUrl(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

function extractMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const msg = (data as AuthApiErrorBody).message;
  return typeof msg === "string" ? msg : undefined;
}

function throwFromAxios(err: unknown): never {
  if (!axios.isAxiosError(err)) throw err;
  const ax = err as AxiosError<AuthApiErrorBody>;
  const status = ax.response?.status ?? 0;
  const message =
    extractMessage(ax.response?.data) ?? ax.message ?? "Request failed";
  const code = ax.response?.data?.code;
  throw new AuthRequestError(status, message, code);
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export async function postLogin(
  payload: LoginPayload,
): Promise<{ message: string; status: string }> {
  try {
    const { data } = await authApi.post<{ message: string; status: string }>(
      "/userservices/v1/login",
      payload,
    );
    return data;
  } catch (e) {
    throwFromAxios(e);
  }
}

export type SessionUser = {
  email: string;
  sub: string;
  userFirstName: string;
  userLastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  createdAt: string;
  isActive: boolean;
  subscriptionType: string;
};

export async function fetchSessionUser(): Promise<SessionUser | null> {
  try {
    const { data } = await authApi.get<SessionUser>(
      "/userservices/v1/getUserFromToken",
    );
    return data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const s = e.response?.status;
      if (s === 401 || s === 403) return null;
    }
    return null;
  }
}

export async function postRegister(
  payload: RegisterPayload,
): Promise<{ message: string; status: string }> {
  try {
    const { data } = await authApi.post<{ message: string; status: string }>(
      "/userservices/v1/register",
      payload,
    );
    return data;
  } catch (e) {
    throwFromAxios(e);
  }
}
