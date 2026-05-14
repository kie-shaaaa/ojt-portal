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

  // console.log("Token", token);

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

  // DEBUG only 
  console.log("Data", data);
  console.log("Response", response);

  // Temporary, removed to avoid unauthorized status completely deleting sessions
  // if (response.status === 401) {
  //   localStorage.removeItem("access_token");
  //   sessionStorage.removeItem("access_token");

  //   window.location.href = "/login";
  // }

  if (!response.ok) {
    return response;
    // Temporary, removed for cleaner management of error

    // throw new Error(
    //   data?.message ||
    //     `Request failed due to unknown error: ${response.status}`,
    // );
  }

  return data;
}
