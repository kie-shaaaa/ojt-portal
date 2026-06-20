import { apiCall } from "@/lib/api";
import { useEffect, useState } from "react";

export function useApplicationChecker() {
  const [isAllowed, setIsAllowed] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const checkPortal = async () => {
      try {
        const response = await apiCall("/applications/settings", {
          method: "GET",
        });

        const settings = response?.data ?? response;

        const isOpen =
          typeof settings?.portal_status === "boolean"
            ? settings.portal_status
            : true;

        if (alive) {
          setIsAllowed(isOpen);
        }
      } catch (error) {
        // fallback: allow or deny depending on your preference
        // here we assume CLOSED on failure (safer for applications)
        if (alive) {
          setIsAllowed(false);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    void checkPortal();

    return () => {
      alive = false;
    };
  }, []);

  return { isAllowed, loading };
}
