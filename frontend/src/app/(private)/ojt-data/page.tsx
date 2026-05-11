"use client";
import { useState, useMemo, useEffect } from "react";
import { FilterInternsSection } from "../../../components/layout/private/OJT-Data/FilterInternSection";
import { InternStatsOverviewSection } from "../../../components/layout/private/OJT-Data/InternStatsOverviewSection";
import { OjtDataHeaderSection } from "../../../components/layout/private/OJT-Data/OjtDataHeaderSection";
import { VerifiedInternsTableSection } from "../../../components/layout/private/OJT-Data/VerifiedInternsTableSection";
import InternDetailsModal, { ModalInternData } from "../../../components/layout/private/InternDetailsModal";

type CompletedInternRecord = {
  id: string;
  ojtId: string;
  name: string;
  email: string;
  school: string;
  startDate: string;
  endDate: string;
  status: "verified" | "completed";
  verifiedDate: string;
  gender?: string;
  course?: string;
  hoursNeeded?: string;
};

// ============ MOCK DATA ============
const mockInterns: Array<{
  id: string;
  ojtId: string;
  name: string;
  email: string;
  school: string;
  startDate: string;
  endDate: string;
  status: "verified" | "completed";
  verifiedDate: string;
  gender?: string;
  course?: string;
  hoursNeeded?: string;
  ojtDetails?: string;  
  deploymentDate?: string;  
}> = [
  {
    id: '1',
    ojtId: 'NTC-000001',
    name: 'John Michael Santos',
    email: 'john.santos@university.edu',
    school: 'University of Santo Tomas',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    status: 'verified',
    verifiedDate: '2024-01-10',
    gender: 'Male',
    course: 'BS Computer Science',
    hoursNeeded: '200 hours'
  },
  {
    id: '2',
    ojtId: 'NTC-000002',
    name: 'Maria Isabella Reyes',
    email: 'maria.reyes@university.edu',
    school: 'Ateneo de Manila University',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    status: 'verified',
    verifiedDate: '2024-01-28',
    gender: 'Female',
    course: 'BS Information Technology',
    hoursNeeded: '250 hours'
  },
  {
    id: '3',
    ojtId: 'NTC-000003',
    name: 'Carlos Miguel Dela Cruz',
    email: 'carlos.delacruz@university.edu',
    school: 'De La Salle University',
    startDate: '2024-01-20',
    endDate: '2024-04-20',
    status: 'verified',
    verifiedDate: '2024-01-15',
    gender: 'Male',
    course: 'BS Computer Engineering',
    hoursNeeded: '300 hours'
  },
  {
    id: '4',
    ojtId: 'NTC-000004',
    name: 'Sofia Marie Gonzales',
    email: 'sofia.gonzales@university.edu',
    school: 'University of Santo Tomas',
    startDate: '2024-02-10',
    endDate: '2024-05-10',
    status: 'verified',
    verifiedDate: '2024-02-05',
    gender: 'Female',
    course: 'BA in Anthropology',
    hoursNeeded: '21 hours'
  },
  {
    id: '5',
    ojtId: 'NTC-000005',
    name: 'James Robert Fernandez',
    email: 'james.fernandez@university.edu',
    school: 'University of the Philippines',
    startDate: '2024-01-05',
    endDate: '2024-04-05',
    status: 'completed',
    verifiedDate: '2024-01-02',
    gender: 'Male',
    course: 'BS Electrical Engineering',
    hoursNeeded: '180 hours'
  },
  {
    id: '6',
    ojtId: 'NTC-000006',
    name: 'Patricia Anne Ramirez',
    email: 'patricia.ramirez@university.edu',
    school: 'Ateneo de Manila University',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
    status: 'verified',
    verifiedDate: '2024-02-10',
    gender: 'Female',
    course: 'BS Accountancy',
    hoursNeeded: '150 hours'
  }
];

// Filter to show ONLY verified interns (used for stats)
const verifiedInternsOnly = mockInterns.filter(intern => intern.status === 'verified');

// Include both verified and completed interns for the table display
const tableInterns = mockInterns.filter(
  (intern) => intern.status === 'verified' || intern.status === 'completed'
);

const schoolOptions = [
  "All Schools",
  "University of Santo Tomas",
  "Ateneo de Manila University",
  "De La Salle University",
  "University of the Philippines"
];

// ============ MAIN COMPONENT ============
export default function OJTDataPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalIntern, setModalIntern] = useState<ModalInternData | null>(null);
  const [completedInterns, setCompletedInterns] = useState<CompletedInternRecord[]>(() => {
    try {
      const raw = localStorage.getItem('ojt_completed_interns');
      return raw ? (JSON.parse(raw) as CompletedInternRecord[]) : [];
    } catch {
      return [];
    }
  });
  const [filters, setFilters] = useState<{
    school: string;
    sortByDate: "Newest First" | "Oldest First";
  }>({
    school: 'All Schools',
    sortByDate: 'Newest First'
  });

  useEffect(() => {
    const handleInternsUpdate = () => {
      try {
        const raw = localStorage.getItem('ojt_completed_interns');
        setCompletedInterns(raw ? (JSON.parse(raw) as CompletedInternRecord[]) : []);
      } catch {
        setCompletedInterns([]);
      }
    };

    window.addEventListener('interns:update', handleInternsUpdate);
    return () => window.removeEventListener('interns:update', handleInternsUpdate);
  }, []);

  const allInterns = useMemo(() => {
    const completedAsInterns = completedInterns.map((intern) => ({
      ...intern,
      status: 'completed' as const,
    }));

    const combined = [...mockInterns, ...completedAsInterns];
    const uniqueByOjtId = new Map(combined.map((intern) => [intern.ojtId, intern]));
    return Array.from(uniqueByOjtId.values());
  }, [completedInterns]);

  const verifiedInternsOnlyList = useMemo(
    () => allInterns.filter((intern) => intern.status === 'verified'),
    [allInterns],
  );

  const tableInternsList = useMemo(
    () => allInterns.filter((intern) => intern.status === 'verified' || intern.status === 'completed'),
    [allInterns],
  );

  // Filter and search interns
  const filteredInterns = useMemo(() => {
    let filtered = [...tableInternsList];

    if (filters.school !== 'All Schools') {
      filtered = filtered.filter(intern => intern.school === filters.school);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(intern =>
        intern.ojtId.toLowerCase().includes(searchLower) ||
        intern.name.toLowerCase().includes(searchLower) ||
        intern.email.toLowerCase().includes(searchLower)
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return filters.sortByDate === 'Newest First' 
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    return filtered;
  }, [filters, searchTerm]);

  // Calculate stats
  const verifiedCount = verifiedInternsOnlyList.length;
  const confirmedThisMonth = verifiedInternsOnlyList.filter(i => {
    const verifiedDate = new Date(i.verifiedDate);
    const now = new Date();
    return verifiedDate.getMonth() === now.getMonth() &&
           verifiedDate.getFullYear() === now.getFullYear();
  }).length;

  const currentStats = {
    totalVerified: verifiedCount,
    confirmedThisMonth: confirmedThisMonth,
    pendingVerification: 0,
    completionRate: Math.round((verifiedCount / allInterns.length) * 100)
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
      <section className="w-full">
        <div className="pt-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-[#0038a8] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#002f8c]"
            onClick={() => setShowModal(true)}
          >
            Show Intern Details
          </button>
        </div>
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