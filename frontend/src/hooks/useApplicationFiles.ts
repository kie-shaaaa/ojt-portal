import { apiCall } from "@/lib/api";
import { useEffect, useState } from "react";

export interface ApplicationFile {
  id: number;
  application_id: number;
  file_type: string;
  document_key: string | null;
  file_name: string;
  file_extension: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
  signedUrl: string;
}

interface UseApplicationFilesResult {
  files: ApplicationFile[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch files for an application from the backend
 * @param applicationId - The application ID to fetch files for
 * @returns Object with files array, loading state, and error
 */
export function useApplicationFiles(
  applicationId: number | undefined,
): UseApplicationFilesResult {
  const [files, setFiles] = useState<ApplicationFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) {
      setFiles([]);
      setError(null);
      return;
    }

    const fetchFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`[useApplicationFiles] Fetching files for application ${applicationId}`);
        const data: ApplicationFile[] = await apiCall(
          `/applications/${applicationId}/files`,
        );

        console.log("[useApplicationFiles] Response data:", data);

        if (Array.isArray(data)) {
          console.log(`[useApplicationFiles] Successfully loaded ${data.length} files`);
          setFiles(data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("[useApplicationFiles] Error:", errorMessage);
        setError(errorMessage);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [applicationId]);

  return { files, loading, error };
}
