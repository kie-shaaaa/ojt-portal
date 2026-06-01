import getBaseUrl from "@/lib/GetBaseUrl";

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const API_URL = getBaseUrl();
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);

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

  let data;

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