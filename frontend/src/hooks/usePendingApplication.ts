import { useEffect, useState } from "react";
import getBaseUrl from "@/lib/GetBaseUrl";

export const usePendingApplications = () => {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchPendingCount = async () => {
      try {
        const response = await fetch(
          `${getBaseUrl()}/applications/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          },
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setPendingCount(data.count || 0);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch pending count:", err);
        setError("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchPendingCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { pendingCount, loading, error };
};
