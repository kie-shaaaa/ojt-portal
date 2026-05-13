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

type UseApplicationFilesInput = {
  applicationId?: number | string;
  applicantEmail?: string;
};

type ApplicationLookup = {
  id: number;
};

const normalizeApplicationId = (
  value: number | string | undefined,
): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (/^\d+$/.test(trimmed)) {
    const parsed = Number(trimmed);
    return parsed > 0 ? parsed : undefined;
  }

  const suffixMatch = trimmed.match(/(\d+)$/);
  if (!suffixMatch) return undefined;

  const parsed = Number(suffixMatch[1]);
  return parsed > 0 ? parsed : undefined;
};

/**
 * Hook to fetch files for an application from the backend
 * @param applicationId - The application ID to fetch files for
 * @returns Object with files array, loading state, and error
 */
export function useApplicationFiles(
  input: UseApplicationFilesInput | number | string | undefined,
): UseApplicationFilesResult {
  const [files, setFiles] = useState<ApplicationFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applicationId =
    typeof input === "object" && input !== null ? input.applicationId : input;
  const applicantEmail =
    typeof input === "object" && input !== null
      ? input.applicantEmail
      : undefined;

  useEffect(() => {
    const normalizedId = normalizeApplicationId(applicationId);

    if (!normalizedId && !applicantEmail) {
      setFiles([]);
      setError(null);
      return;
    }

    const fetchFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        const candidateIds: number[] = [];

        if (normalizedId) {
          candidateIds.push(normalizedId);
        }

        if (applicantEmail) {
          const lookupData: ApplicationLookup[] = await apiCall(
            `/applications/fetch?email=${encodeURIComponent(applicantEmail)}`,
          );

          if (Array.isArray(lookupData)) {
            const sortedByNewest = [...lookupData]
              .filter((item) => Number.isFinite(item.id) && item.id > 0)
              .sort((a, b) => b.id - a.id)
              .map((item) => item.id);

            for (const id of sortedByNewest) {
              if (!candidateIds.includes(id)) {
                candidateIds.push(id);
              }
            }
          }
        }

        let resolvedFiles: ApplicationFile[] = [];

        for (const candidateId of candidateIds) {
          const data: ApplicationFile[] = await apiCall(
            `/applications/${candidateId}/files`,
          );

          if (!Array.isArray(data)) {
            continue;
          }

          if (
            data.length > 0 ||
            candidateId === candidateIds[candidateIds.length - 1]
          ) {
            resolvedFiles = data;
            break;
          }
        }

        setFiles(resolvedFiles);
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
  }, [applicationId, applicantEmail]);

  return { files, loading, error };
}
