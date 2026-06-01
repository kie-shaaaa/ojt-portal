'use client';

export default function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_LOCAL_URL ||
    process.env.LOCAL_URL;

  if (raw && typeof raw === "string") {
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      return raw;
    }
    // Assume HTTPS if protocol is missing
    return `https://${raw}`;
  }

  return "http://localhost:5000";
}