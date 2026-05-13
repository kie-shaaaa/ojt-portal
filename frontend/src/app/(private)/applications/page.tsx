"use client";

import { JSX, useEffect, useMemo, useState } from "react";

import { apiCall } from "@/lib/api";

import { ApplicationStatsSection } from "@/components/layout/private/Dashboard/ApplicationStatsSection";
import { ApplicationsHeaderSection } from "@/components/layout/private/Applications/ApplicationsHeaderSection";
import { ApplicationsFilterSection } from "@/components/layout/private/Applications/ApplicationsFilterSection";
import { ApplicationsTableSection } from "@/components/layout/private/Applications/ApplicationsTableSection";

type FilterOption = {
  value: string;
  label: string;
};

export type Application = {
  id: number;

  first_name: string;
  last_name: string;

  email: string;
  phone: string;

  application_type: string;

  school_name: string | null;
  course: string | null;
  hours_needed: number | null;

  deployment_date: string | null;
  submission_date: string;

  status: string;
};

export default function ApplicationPage(): JSX.Element {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    school: "all-schools",
    timePeriod: "all-time",
  });

  const [searchQuery, setSearchQuery] = useState("");

  // School options state
  const [schoolOptions, setSchoolOptions] = useState<FilterOption[]>([
    { value: "all-schools", label: "All Schools" },
  ]);

  // FETCH APPLICATIONS
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);

        const response = await apiCall("/applications/fetch-all?count=50");

        let data: Application[] = [];

        if (Array.isArray(response)) {
          data = response;
          console.log(data);
        } else if (response?.data) {
          data = response.data;
        }

        console.log("Fetched applications:", data);
        setApplications(data);

        // Sync to localStorage for dashboard stats
        if (data && data.length > 0) {
          window.localStorage.setItem("ojt_applications", JSON.stringify(data));
          window.dispatchEvent(new Event("applications:update"));
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // FETCH SCHOOLS
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await apiCall("/schools/fetch-all?count=1000");

        let schools: any[] = [];

        if (Array.isArray(response)) {
          schools = response;
        } else if (response && typeof response === "object") {
          schools = response.data || response.schools || [];
        }

        const formattedSchools: FilterOption[] = schools
          .map((school: any) => {
            const name =
              typeof school === "string"
                ? school
                : school.name || school.school_name || "";

            return {
              value: name.toLowerCase().replace(/\s+/g, "-"),
              label: name,
            };
          })
          .filter((school) => school.label.trim());

        setSchoolOptions([
          { value: "all-schools", label: "All Schools" },
          ...formattedSchools,
        ]);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setSchoolOptions([{ value: "all-schools", label: "All Schools" }]);
      }
    };

    fetchSchools();
  }, []);

  // Normalize school name for comparison
  const normalizeSchool = (name: string | null | undefined) =>
    (name || "").toLowerCase().replace(/\s+/g, "-");

  // FILTERED APPLICATIONS
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // =========================
      // SCHOOL FILTER
      // =========================
      const matchesSchool =
        filters.school === "all-schools"
          ? true
          : normalizeSchool(app.school_name) === filters.school;

      // =========================
      // TIME FILTER
      // =========================
      let matchesTime = true;

      const submissionDate = new Date(app.submission_date);

      const now = new Date();

      switch (filters.timePeriod) {
        case "last-30": {
          const last30 = new Date();

          last30.setDate(now.getDate() - 30);

          matchesTime = submissionDate >= last30;

          break;
        }

        case "last-90": {
          const last90 = new Date();

          last90.setDate(now.getDate() - 90);

          matchesTime = submissionDate >= last90;

          break;
        }

        case "this-year": {
          matchesTime = submissionDate.getFullYear() === now.getFullYear();

          break;
        }

        default:
          matchesTime = true;
      }

      // =========================
      // SEARCH FILTER
      // =========================
      const normalizedSearch = searchQuery.toLowerCase();

      const searchableText = [
        app.id,
        app.first_name,
        app.last_name,
        app.email,
        app.phone,
        app.application_type,
        app.school_name,
        app.course,
        app.status,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchQuery
        ? searchableText.includes(normalizedSearch)
        : true;

      return matchesSchool && matchesTime && matchesSearch;
    });
  }, [applications, filters, searchQuery]);

  return (
    <main
      className="relative flex w-full flex-col items-start gap-6 p-8"
      data-id="main-content"
    >
      <ApplicationsHeaderSection />

      <ApplicationStatsSection />

      <ApplicationsFilterSection
        filters={filters}
        setFilters={setFilters}
        schoolOptions={schoolOptions}
      />

      <ApplicationsTableSection
        applications={filteredApplications}
        isLoading={isLoading}
      />
    </main>
  );
}
