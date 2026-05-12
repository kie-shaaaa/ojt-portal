"use client";
import { useState, useMemo, useEffect } from "react";
import { apiCall } from "../../../lib/api";
import { FilterInternsSection } from "../../../components/layout/private/OJT-Data/FilterInternSection";
import { InternStatsOverviewSection } from "../../../components/layout/private/OJT-Data/InternStatsOverviewSection";
import { OjtDataHeaderSection } from "../../../components/layout/private/OJT-Data/OjtDataHeaderSection";
import { VerifiedInternsTableSection } from "../../../components/layout/private/OJT-Data/VerifiedInternsTableSection";
import InternDetailsModal, {
  ModalInternData,
} from "../../../components/layout/private/InternDetailsModal";

type CompletedInternRecord = {
  id: number;
  ojt_id: string;
  application_id: number;
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
  const [filters, setFilters] = useState<{
    school: string;
    sortByDate: "Newest First" | "Oldest First";
  }>({
    school: "All Schools",
    sortByDate: "Newest First",
  });

  // Fetch interns from API
  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await apiCall("/ojt/fetch-all?count=1000");
        // Handle wrapped response
        let interns: CompletedInternRecord[] = [];
        if (Array.isArray(response)) {
          interns = response;
        } else if (response && typeof response === "object") {
          interns = response.data || response.interns || [];
        }
        setInterns(Array.isArray(interns) ? interns : []);
      } catch (error) {
        console.error("Error fetching interns:", error);
        setInterns([]);
      }
    };

    fetchInterns();
  }, []);

  // Fetch schools from API
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await apiCall("/schools/fetch-all?count=1000");
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
        setSchoolOptions(["All Schools", ...schoolNames]);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setSchoolOptions(["All Schools"]);
      }
    };

    fetchSchools();
  }, []);

  const allInterns = useMemo(() => {
    return interns;
  }, [interns]);

  const verifiedInternsOnlyList = useMemo(
    () => allInterns.filter((intern) => intern.original_status === "verified"),
    [allInterns],
  );

  const tableInternsList = useMemo(
    () =>
      allInterns.filter(
        (intern) =>
          intern.original_status === "verified" ||
          intern.original_status === "completed",
      ),
    [allInterns],
  );

  // Filter and search interns
  const filteredInterns = useMemo(() => {
    let filtered = [...tableInternsList];

    if (filters.school !== "All Schools") {
      filtered = filtered.filter(
        (intern) => intern.school_name === filters.school,
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (intern) =>
          intern.id ||
          intern.first_name.toLowerCase().includes(searchLower) ||
          intern.email.toLowerCase().includes(searchLower),
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
  }, [filters, searchTerm]);

  // Calculate stats
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
    completionRate: Math.round((verifiedCount / allInterns.length) * 100),
  };

  return (
    <>
      <main
        className="relative flex w-full flex-col items-start gap-6 bg-white p-8"
        data-id="main-content-area"
      >
        <section className="w-full" aria-label="OJT data header">
          <OjtDataHeaderSection
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
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
