import { JSX, useId, useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Check,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  GraduationCap,
  FileBadge,
  X,
  ArrowLeft,
} from "lucide-react";

type Requirement = {
  id: string;
  title: string;
  icon: JSX.Element;
  expanded?: boolean;
  reasons?: string[];
};

const requirementsData: Requirement[] = [
  {
    id: "picture-1x1",
    title: "PICTURE-1X1",
    icon: <ImageIcon size={20} />,
    expanded: true,
    reasons: [
      "Blurry or low-quality image",
      "Missing handwritten signature",
      "Expired document validity",
      "Incorrect document type uploaded",
      "Information mismatch with profile",
    ],
  },
  {
    id: "draft-moa",
    title: "DRAFT-MOA",
    icon: <FileText size={20} />,
    reasons: ["Missing signature", "Incomplete pages", "Wrong template used"],
  },
  {
    id: "vaccine-card",
    title: "VACCINE-CARD",
    icon: <ShieldCheck size={20} />,
    reasons: ["Unreadable document", "Expired vaccination proof"],
  },
  {
    id: "draft-endorsement",
    title: "DRAFT-ENDORSEMENT",
    icon: <FileBadge size={20} />,
    reasons: ["Missing approving signature", "Incorrect format"],
  },
  {
    id: "proof-of-enrollment",
    title: "PROOF-OF-ENROLLMENT",
    icon: <GraduationCap size={20} />,
    reasons: ["School year not indicated", "Document unreadable"],
  },
  {
    id: "resume-cv",
    title: "RESUME-CV",
    icon: <FileText size={20} />,
    reasons: ["Outdated resume", "Missing contact information"],
  },
];

const MAX_COMMENT_LENGTH = 200;

export const RejectionReasons = ({
  onClose,
  onSubmit,
  selectedCount = 0,
}: {
  onClose?: () => void;
  onSubmit?: (payload: {
    items: Array<{
      id: string;
      title: string;
      reasons: string[];
      comment: string;
    }>;
  }) => void;
  selectedCount?: number;
}): JSX.Element => {
  const componentId = useId();

  const initialExpanded = useMemo(
    () =>
      requirementsData.reduce<Record<string, boolean>>((acc, requirement) => {
        acc[requirement.id] = Boolean(requirement.expanded);
        return acc;
      }, {}),
    [],
  );

  const [expandedItems, setExpandedItems] =
    useState<Record<string, boolean>>(initialExpanded);

  const [selectedReasons, setSelectedReasons] = useState<
    Record<string, string[]>
  >(
    requirementsData.reduce<Record<string, string[]>>((acc, requirement) => {
      acc[requirement.id] = [];
      return acc;
    }, {}),
  );

  const [comments, setComments] = useState<Record<string, string>>(
    requirementsData.reduce<Record<string, string>>((acc, requirement) => {
      acc[requirement.id] = "";
      return acc;
    }, {}),
  );

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleReason = (requirementId: string, reason: string) => {
    setSelectedReasons((prev) => {
      const current = prev[requirementId] ?? [];

      const next = current.includes(reason)
        ? current.filter((item) => item !== reason)
        : [...current, reason];

      return {
        ...prev,
        [requirementId]: next,
      };
    });
  };

  const handleCommentChange = (requirementId: string, value: string) => {
    setComments((prev) => ({
      ...prev,
      [requirementId]: value.slice(0, MAX_COMMENT_LENGTH),
    }));
  };

  const canSubmit = requirementsData.some((requirement) => {
    const hasReasons = (selectedReasons[requirement.id] ?? []).length > 0;

    const hasComment = (comments[requirement.id] ?? "").trim().length > 0;

    return hasReasons || hasComment;
  });

  return (
    <section className="flex flex-col max-w-2xl w-[672px] max-h-[920px] bg-white rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <header className="flex items-start justify-between px-6 py-5 border-b border-gray-200">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="text-red-600" size={22} />
          </div>

          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Rejection Reasons
            </h1>

            <p className="mt-1 text-sm text-gray-600 leading-5">
              Provide reasons for rejecting the selected requirements. These
              reasons will be sent to the applicant.
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close rejection reasons"
          className="p-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => onClose?.()}
        >
          <X size={18} className="text-gray-500" />
        </button>
      </header>

      {/* Alert Banner */}
      <div className="flex items-center gap-2 px-6 py-3 bg-red-50 border-b border-red-100">
        <AlertTriangle size={14} className="text-red-700" />

        <p className="text-xs font-semibold text-red-700">
          {selectedCount} requirement{selectedCount === 1 ? "" : "s"} selected
          for rejection
        </p>
      </div>

      {/* Body */}
      <div className="overflow-y-auto max-h-[700px] bg-white">
        <div className="flex flex-col gap-5 p-6">
          {requirementsData.map((requirement) => {
            const isExpanded = expandedItems[requirement.id];

            const currentComment = comments[requirement.id] ?? "";

            const currentSelections = selectedReasons[requirement.id] ?? [];

            const headingId = `${componentId}-${requirement.id}-heading`;

            const panelId = `${componentId}-${requirement.id}-panel`;

            return (
              <div
                key={requirement.id}
                className="border border-red-100 bg-red-50/30 rounded-xl overflow-hidden"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  id={headingId}
                  onClick={() => toggleExpanded(requirement.id)}
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-red-600">{requirement.icon}</div>

                    <h2 className="text-sm font-bold text-slate-900">
                      {requirement.title}
                    </h2>
                  </div>

                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Accordion Body */}
                {isExpanded && requirement.reasons && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    className="px-4 pb-4"
                  >
                    <div className="border-t border-red-100 pt-4 flex flex-col gap-4">
                      <p className="text-xs font-semibold text-gray-700">
                        Reasons for rejecting {requirement.title}:
                      </p>

                      {/* Reasons */}
                      <fieldset className="flex flex-col gap-2">
                        <legend className="sr-only">Select reasons</legend>

                        {requirement.reasons.map((reason, index) => {
                          const reasonId = `${componentId}-${requirement.id}-reason-${index}`;

                          const checked = currentSelections.includes(reason);

                          return (
                            <label
                              key={reason}
                              htmlFor={reasonId}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition"
                            >
                              <div className="relative">
                                <input
                                  id={reasonId}
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    toggleReason(requirement.id, reason)
                                  }
                                  className="peer sr-only"
                                />

                                <div className="w-4 h-4 rounded border border-gray-400 bg-white peer-checked:bg-red-600 peer-checked:border-red-600 flex items-center justify-center">
                                  {checked && (
                                    <Check size={12} className="text-white" />
                                  )}
                                </div>
                              </div>

                              <span className="text-sm text-slate-800">
                                {reason}
                              </span>
                            </label>
                          );
                        })}
                      </fieldset>

                      {/* Comments */}
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor={`${componentId}-${requirement.id}-comments`}
                          className="text-xs font-medium text-gray-700"
                        >
                          Additional Comments (Optional)
                        </label>

                        <div className="relative">
                          <textarea
                            id={`${componentId}-${requirement.id}-comments`}
                            value={currentComment}
                            onChange={(event) =>
                              handleCommentChange(
                                requirement.id,
                                event.target.value,
                              )
                            }
                            maxLength={MAX_COMMENT_LENGTH}
                            placeholder="Specify detailed reason here..."
                            className="w-full h-24 resize-none rounded-xl border border-gray-300 bg-white p-3 text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
                          />

                          <span className="absolute bottom-2 right-3 text-[11px] text-gray-500">
                            {currentComment.length}/{MAX_COMMENT_LENGTH}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-gray-200">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
        >
          <ArrowLeft size={16} />
          <span className="text-sm text-gray-700">Back</span>
        </button>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => {
            if (!canSubmit) return;

            const items = requirementsData.map((requirement) => ({
              id: requirement.id,
              title: requirement.title,
              reasons: selectedReasons[requirement.id] ?? [],
              comment: comments[requirement.id] ?? "",
            }));

            onSubmit?.({ items });
          }}
          className={`px-8 py-3 rounded-xl text-white text-sm font-medium transition ${
            canSubmit
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-300 cursor-not-allowed"
          }`}
        >
          Send Rejection
        </button>
      </footer>
    </section>
  );
};
