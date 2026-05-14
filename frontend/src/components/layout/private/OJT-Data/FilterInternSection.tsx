import { JSX, useId, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface FilterOptions {
  school: string;
  sortByDate: 'Newest First' | 'Oldest First';
  status?: string;
}

interface FilterInternsSectionProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  schoolOptions: string[];
}

export const FilterInternsSection = ({
  filters,
  onFilterChange,
  schoolOptions
}: FilterInternsSectionProps): JSX.Element => {
  const sectionTitleId = useId();
  const schoolDropdownRef = useRef<HTMLDivElement>(null);
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        schoolDropdownRef.current &&
        !schoolDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSchoolDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSchoolOptions = schoolOptions
    .filter((option) => option !== "All Schools")
    .filter((option) =>
      option.toLowerCase().includes(schoolSearchQuery.toLowerCase())
    );

  return (
    <section
      aria-labelledby={sectionTitleId}
      className="flex relative self-stretch w-full flex-[0_0_auto] flex-col items-start gap-6 rounded-lg border border-solid border-slate-200 bg-white p-6 shadow-[0px_1px_2px_#0000000d]"
    >
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
        <h2
          id={sectionTitleId}
          className="relative mt-[-1.00px] flex items-center self-stretch font-inter-bold text-lg font-bold leading-7 tracking-[0] text-slate-700"
        >
          Filter Interns
        </h2>
      </div>
      <div className="grid h-fit w-full grid-cols-1 gap-8 sm:grid-cols-2 sm:grid-rows-[70px]">
        {/* School Filter */}
        <div className="relative flex h-fit w-full flex-col items-start gap-2">
          <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
            <label
              htmlFor="school"
              className="relative mt-[-1.00px] flex items-center self-stretch font-inter-bold text-sm font-bold leading-5 tracking-[0] text-slate-600"
            >
              School
            </label>
          </div>
          <div 
            className="relative flex w-full items-center self-stretch"
            ref={schoolDropdownRef}
          >
            <input
              type="text"
              id="school"
              name="school"
              aria-label="School"
              value={
                isSchoolDropdownOpen
                  ? schoolSearchQuery
                  : filters.school === "All Schools"
                    ? ""
                    : filters.school
              }
              placeholder="All Schools"
              onChange={(e) => {
                const val = e.target.value;
                setSchoolSearchQuery(val);
                setIsSchoolDropdownOpen(true);
                if (val.trim() === "") {
                  onFilterChange({ ...filters, school: "All Schools" });
                }
              }}
              onFocus={() => {
                setIsSchoolDropdownOpen(true);
                if (filters.school !== "All Schools") {
                  setSchoolSearchQuery(filters.school);
                } else {
                  setSchoolSearchQuery("");
                }
              }}
              autoComplete="off"
              className="relative flex w-full appearance-none items-center justify-center rounded-lg border border-solid border-slate-200 bg-white py-2.5 pl-3 pr-10 font-inter-regular text-sm font-normal leading-5 tracking-[0] text-slate-600 outline-none transition-colors focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />
            {isSchoolDropdownOpen && (
              <div className="absolute z-50 top-full mt-1 max-h-60 w-full overflow-auto rounded-lg border border-solid border-slate-200 bg-white py-1 shadow-lg outline-none">
                {filteredSchoolOptions.length > 0 ? (
                  filteredSchoolOptions.map((option) => {
                    const isSelected = filters.school === option;
                    return (
                      <div
                        key={option}
                        onClick={() => {
                          onFilterChange({ ...filters, school: option });
                          setIsSchoolDropdownOpen(false);
                          setSchoolSearchQuery("");
                        }}
                        className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-slate-100 ${
                          isSelected
                            ? "bg-slate-50 font-semibold text-slate-700 hover:bg-slate-100"
                            : "text-slate-600"
                        }`}
                      >
                        {option}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    No schools found
                  </div>
                )}
              </div>
            )}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex h-full w-[42px] items-center justify-center">
              <ChevronDown
                size={18}
                className="text-slate-500"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Sort by Date Filter */}
        <div className="relative flex h-fit w-full flex-col items-start gap-2">
          <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
            <label
              htmlFor="sortByDate"
              className="relative mt-[-1.00px] flex items-center self-stretch font-inter-bold text-sm font-bold leading-5 tracking-[0] text-slate-600"
            >
              Sort by Date
            </label>
          </div>
          <div className="relative flex w-full items-center self-stretch">
            <select
              id="sortByDate"
              name="sortByDate"
              aria-label="Sort by Date"
              value={filters.sortByDate}
              onChange={(event) =>
                onFilterChange({
                  ...filters,
                  sortByDate: event.target.value as 'Newest First' | 'Oldest First',
                })
              }
              className="relative flex w-full appearance-none items-center justify-center rounded-lg border border-solid border-slate-200 bg-white py-2.5 pl-3 pr-10 font-inter-regular text-sm font-normal leading-5 tracking-[0] text-slate-600 outline-none transition-colors focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            >
              <option value="Newest First">Newest First</option>
              <option value="Oldest First">Oldest First</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex h-full w-[42px] items-center justify-center">
              <ChevronDown
                size={18}
                className="text-slate-500"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};