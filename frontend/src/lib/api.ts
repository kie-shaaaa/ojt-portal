import getBaseUrl from "@/lib/GetBaseUrl";

function shouldAttachCsrfHeader(method?: string): boolean {
  const normalizedMethod = (method ?? "GET").toUpperCase();
  return !["GET", "HEAD", "OPTIONS"].includes(normalizedMethod);
}

let csrfTokenCache: string = '';

async function fetchCsrfToken(): Promise<string> {
  const API_URL = getBaseUrl();

  const response = await fetch(`${API_URL}/auth/csrf`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch CSRF token");
  }

  const data = await response.json();

  if (!data?.csrf_token) {
    throw new Error("Invalid CSRF response");
  }

  csrfTokenCache = data.csrf_token;

  return csrfTokenCache;
}

/**
 * Main API wrapper
 */
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const API_URL = getBaseUrl();
  const isFormData = options.body instanceof FormData;

  const headers = new Headers(options.headers);

  if (shouldAttachCsrfHeader(options.method)) {
    if (!csrfTokenCache) {
      csrfTokenCache = await fetchCsrfToken();
    }

    headers.set("x-csrf-token", csrfTokenCache);
  }

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const { body, method, ...rest } = options;

  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...rest,
      method,
      headers,
      credentials: "include",
      ...(method !== "GET" && method !== "HEAD" && body ? { body } : {}),
    });
  } catch (error) {
    console.error("Fetch failed:", error);
    throw new Error(
      "Unable to connect to the server. Please check if the backend is running.",
    );
  }

  let data: any;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      data?.error ||
      response.statusText ||
      `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return data;
}

export function clearCsrfCache() {
  csrfTokenCache = '';
}
