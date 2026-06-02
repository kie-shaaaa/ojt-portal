"use client";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiCall } from "../../../lib/api";
import { FilterInternsSection } from "../../../components/layout/private/OJT-Data/FilterInternSection";
import { InternStatsOverviewSection } from "../../../components/layout/private/OJT-Data/InternStatsOverviewSection";
import { OjtDataHeaderSection } from "../../../components/layout/private/OJT-Data/OjtDataHeaderSection";
import { VerifiedInternsTableSection } from "../../../components/layout/private/OJT-Data/VerifiedInternsTableSection";
import InternDetailsModal, {
  ModalInternData,
} from "../../../components/layout/private/modals/InternDetailsModal";

type CompletedInternRecord = {
  id: number;
  ojt_id: string;
  application_id?: number | null;
  application_type: string;
  first_name: string;
  last_name: string;
  gender: "Male" | "Female" | null;
  email: string;
  phone: string;
  school_name: string | null;
  hours_needed: number | null;
  course: string | null;
  deployment_date: string | null;
  end_date: string | null;
  certificate_issuance_date: string | null;
  orientation_date: string | null;
  confirmed_at: string | null;
  confirmation_ip: string | null;
  second_chance: number;
  submission_date: string;
  original_status: string | null;
  moved_to_ojt_at: string;
  admin_notes: string | null;
};

// ============ MAIN COMPONENT ============
export default function OJTDataPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalIntern, setModalIntern] = useState<ModalInternData | null>(null);
  const [interns, setInterns] = useState<CompletedInternRecord[]>([]);
  const [schoolOptions, setSchoolOptions] = useState<string[]>(["All Schools"]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filters, setFilters] = useState<{
    school: string;
    sortByDate: "Newest First" | "Oldest First";
  }>({
    school: "All Schools",
    sortByDate: "Newest First",
  });

  const resetOjtFilters = () => {
    setSearchTerm("");
    setFilters({
      school: "All Schools",
      sortByDate: "Newest First",
    });
  };

  // Fetch interns from API
  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await apiCall(
          `/ojt/fetch-all?count=${itemsPerPage}&page=${currentPage}`,
        );
        // Handle wrapped response
        let interns: CompletedInternRecord[] = [];
        if (Array.isArray(response)) {
          interns = response;
        } else if (response && typeof response === "object") {
          interns = response.data || response.interns || [];
        }
        const validInterns = Array.isArray(interns) ? interns : [];
        setInterns(validInterns);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error fetching interns";
        console.error(errorMessage, error);
        toast.error(errorMessage);
        setInterns([]);
      }
    };

    fetchInterns();
  }, [currentPage, itemsPerPage]);

  // Fetch schools from API
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await apiCall("/schools/fetch-all?count=1000&page=1");
        let schools: any[] = [];
        // Handle wrapped response
        if (Array.isArray(response)) {
          schools = response;
        } else if (response && typeof response === "object") {
          schools = response.data || response.schools || [];
        }
        const schoolNames = Array.isArray(schools)
          ? schools
              .map((school: any) => {
                // Handle different school object formats
                if (typeof school === "string") return school;
                return school.name || school.school_name || "";
              })
              .filter((name: string) => name.trim())
          : [];

        const seen = new Set<string>();
        const uniqueSchoolNames = schoolNames.filter((name: string) => {
          const normalized = name.trim().toLowerCase();
          if (!normalized || seen.has(normalized)) return false;
          seen.add(normalized);
          return true;
        });

        setSchoolOptions(["All Schools", ...uniqueSchoolNames]);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error fetching schools";
        console.error(errorMessage, error);
        toast.error(errorMessage);
        setSchoolOptions(["All Schools"]);
      }
    };

    fetchSchools();
  }, []);

  const allInterns = useMemo(() => {
    return interns;
  }, [interns]);

  const normalizeStatus = (status: string | null) => {
    return (status || "").trim().toLowerCase();
  };

  const verifiedInternsOnlyList = useMemo(() => {
    // Try to find records with verified status
    const verified = allInterns.filter(
      (intern) => normalizeStatus(intern.original_status) === "verified",
    );

    // If no records with "verified" status, try other possible status values
    if (verified.length === 0 && allInterns.length > 0) {
      ("No 'verified' status found. Checking available statuses...");
      const statuses = new Set(allInterns.map((i) => i.original_status));
      // Return all records if no verified records found (fallback)
      return allInterns;
    }
    return verified;
  }, [allInterns]);

  const tableInternsList = useMemo(() => allInterns, [allInterns]);

  // Filter and search interns
  const filteredInterns = useMemo(() => {
    let filtered = [...tableInternsList];

    if (filters.school !== "All Schools") {
      const selectedSchool = filters.school.trim().toLowerCase();
      filtered = filtered.filter(
        (intern) =>
          (intern.school_name || "").trim().toLowerCase() === selectedSchool,
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();

      filtered = filtered.filter(
        (intern) =>
          String(intern.id ?? "").includes(searchLower) ||
          String(intern.ojt_id ?? "")
            .toLowerCase()
            .includes(searchLower) ||
          String(intern.first_name ?? "")
            .toLowerCase()
            .includes(searchLower) ||
          String(intern.last_name ?? "")
            .toLowerCase()
            .includes(searchLower) ||
          String(intern.email ?? "")
            .toLowerCase()
            .includes(searchLower),
      );
    }

    filtered.sort((a, b) => {
      const dateA = a.deployment_date
        ? new Date(a.deployment_date).getTime()
        : 0;
      const dateB = b.deployment_date
        ? new Date(b.deployment_date).getTime()
        : 0;
      return filters.sortByDate === "Newest First"
        ? dateB - dateA
        : dateA - dateB;
    });

    return filtered;
  }, [filters, searchTerm, tableInternsList]);

  const verifiedCount = verifiedInternsOnlyList.length;
  const confirmedThisMonth = verifiedInternsOnlyList.filter((i) => {
    if (!i.confirmed_at) return false;
    const verifiedDate = new Date(i.confirmed_at);
    const now = new Date();
    return (
      verifiedDate.getMonth() === now.getMonth() &&
      verifiedDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const currentStats = {
    totalVerified: verifiedCount,
    confirmedThisMonth: confirmedThisMonth,
    pendingVerification: 0,
    completionRate:
      allInterns.length > 0
        ? Math.round((verifiedCount / allInterns.length) * 100)
        : 0,
  };

  const totalPages = Math.ceil((interns.length || 0) / itemsPerPage) || 1;

  return (
    <>
      <main
        className="relative flex w-full min-w-0 flex-col items-start gap-6 bg-white p-4 sm:p-6 lg:p-8"
        data-id="main-content-area"
      >
        <section className="w-full" aria-label="OJT data header">
          <OjtDataHeaderSection />
        </section>
        <section className="w-full" aria-label="Intern statistics overview">
          <InternStatsOverviewSection stats={currentStats} />
        </section>
        <section className="w-full" aria-label="Filter interns">
          <FilterInternsSection
            filters={filters}
            onFilterChange={setFilters}
            schoolOptions={schoolOptions}
          />
        </section>
        <section className="w-full" aria-label="Verified interns table">
          <VerifiedInternsTableSection
            interns={filteredInterns}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClearFilters={resetOjtFilters}
            currentPage={currentPage}
            totalPages={totalPages}
            onPreviousPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNextPage={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            onViewDetails={(intern) => {
              setModalIntern(intern);
              setShowModal(true);
            }}
          />
        </section>
      </main>
      {showModal && (
        <InternDetailsModal
          intern={modalIntern}
          onClose={() => {
            setShowModal(false);
            setModalIntern(null);
          }}
        />
      )}
    </>
  );
}
