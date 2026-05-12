import getBaseUrl from "@/lib/GetBaseUrl"

const API_URL = getBaseUrl();

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include",
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return response.json();
}
