import getBaseUrl from "@/lib/GetBaseUrl";

const API_URL = getBaseUrl();

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const { body, method, ...rest } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    method,
    headers,
    credentials: "include",
    ...(method !== "GET" && method !== "HEAD" && body ? { body } : {}),
  });

  const data = await response.json();

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }

  if (!response.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
}
