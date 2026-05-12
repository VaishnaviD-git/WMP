const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8000";

/** Absolute backend URL for `fetch` (multipart forms and JSON endpoints). */
export function apiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** POST `multipart/form-data`; parses JSON body and throws on non-OK responses. */
export async function postForm(path: string, formData: FormData): Promise<unknown> {
  const response = await fetch(apiUrl(path), {
    method: "POST",
    body: formData,
  });

  let parsed: unknown = null;
  try {
    parsed = await response.json();
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    if (parsed && typeof parsed === "object") {
      const detail = (parsed as Record<string, unknown>).detail;
      const msg = (parsed as Record<string, unknown>).message;
      if (typeof detail === "string" && detail.trim()) {
        message = detail;
      } else if (typeof msg === "string" && msg.trim()) {
        message = msg;
      }
    }
    throw new Error(message);
  }

  return parsed;
}

type Primitive = string | number | boolean | null;
type JsonValue = Primitive | JsonValue[] | { [key: string]: JsonValue };

export type ApiEnvelope = Record<string, JsonValue>;

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
  latitude: number;
  longitude: number;
};

export type PredictRequest = {
  waste: string;
  delay: string;
  density: string;
  area: string;
  lat: number;
  lon: number;
};

export type ApiResult<T = ApiEnvelope> = {
  ok: boolean;
  status: number;
  data: T | null;
  message: string;
};

async function request<T = ApiEnvelope>(
  path: string,
  method: "POST",
  payload: Record<string, JsonValue>,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let parsed: unknown = null;
    try {
      parsed = await response.json();
    } catch {
      parsed = null;
    }

    const data = (parsed && typeof parsed === "object" ? parsed : null) as T | null;
    const fallbackMessage = response.ok
      ? "Request completed successfully."
      : "Request failed. Please try again.";
    const message = extractMessage(data) ?? fallbackMessage;

    return {
      ok: response.ok,
      status: response.status,
      data,
      message,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      message: "Unable to reach the server. Check backend availability and CORS settings.",
    };
  }
}

function extractMessage(input: unknown): string | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const candidateKeys = ["message", "detail", "error", "status"];
  for (const key of candidateKeys) {
    const value = (input as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return null;
}

export async function login(payload: LoginRequest): Promise<ApiResult> {
  return request("/api/login", "POST", payload);
}

export async function register(payload: RegisterRequest): Promise<ApiResult> {
  return request("/api/register", "POST", payload);
}

export async function predict(payload: PredictRequest): Promise<ApiResult> {
  return request("/api/predict", "POST", payload);
}
