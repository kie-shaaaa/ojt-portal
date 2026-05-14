"use client";

import { JSX, useId, useRef, useState } from "react";
import {
  FileText,
  Mail,
  Upload,
  Heart,
  FileCheck,
  Image as LucideImage,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Download,
  Info,
} from "lucide-react";

type UploadCard = {
  id: string;
  number: string;
  title: string;
  optional?: boolean;
  required?: boolean;
  description: string;
  error?: string;
  areaClassName: string;
  contentClassName: string;
  iconWrapperClassName: string;
  icon: "resume" | "document" | "mail" | "medical" | "agreement" | "image";
  accept: string;
};

const StepIndicator = ({
  number,
  label,
  status,
}: {
  number: string;
  label: string;
  status: "completed" | "current" | "upcoming";
}) => {
  const circleClassName =
    status === "completed"
      ? "bg-emerald-500"
      : status === "current"
        ? "bg-blue-700"
        : "bg-gray-200";

  const numberClassName =
    status === "completed"
      ? "text-white"
      : status === "current"
        ? "text-white"
        : "text-gray-400";

  const labelClassName =
    status === "completed"
      ? "text-emerald-600"
      : status === "current"
        ? "text-blue-700"
        : "text-gray-400";

  return (
    <li className="inline-flex flex-col items-center relative self-stretch flex-[0_0_auto] z-[1]">
      <div
        className={`flex w-10 h-10 items-center justify-center relative rounded-full ${circleClassName}`}
      >
        {status === "current" ? (
          <div className="absolute top-0 left-[calc(50.00%_-_20px)] w-10 h-10 bg-[#ffffff01] rounded-full shadow-[0px_0px_0px_4px_#dbeafe]" />
        ) : null}
        <div
          className={`relative flex items-center justify-center w-fit [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-base text-center tracking-[0] leading-6 whitespace-nowrap ${numberClassName}`}
        >
          {number}
        </div>
      </div>
      <div className="inline-flex flex-col items-start pt-2 pb-0 px-0 relative flex-[0_0_auto]">
        <div
          className={`relative flex items-center w-fit mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-xs tracking-[0] leading-4 whitespace-nowrap ${labelClassName}`}
        >
          {label}
        </div>
      </div>
    </li>
  );
};

const UploadIllustration = ({
  icon,
  className,
}: {
  icon: UploadCard["icon"];
  className?: string;
}) => {
  if (icon === "resume") {
    return (
      <div aria-hidden="true" className={className}>
        <FileText size={32} />
      </div>
    );
  }

  if (icon === "document") {
    return (
      <div aria-hidden="true" className={className}>
        <FileText size={32} />
      </div>
    );
  }

  if (icon === "mail") {
    return (
      <div aria-hidden="true" className={className}>
        <Mail size={32} />
      </div>
    );
  }

  if (icon === "medical") {
    return (
      <div aria-hidden="true" className={className}>
        <Heart size={32} />
      </div>
    );
  }

  if (icon === "agreement") {
    return (
      <div aria-hidden="true" className={className}>
        <FileCheck size={32} />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={className}>
      <LucideImage size={32} />
    </div>
  );
};

const UploadCardItem = ({
  card,
  fileName,
  onSelectFile,
  error,
}: {
  card: UploadCard;
  fileName: string;
  onSelectFile: (cardId: string, file: File | null) => void;
  error?: string | undefined;
}) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isMissing = card.required && !fileName;
  const hasError = !!error || isMissing;
  const isValid = !!fileName && !hasError;

  // Determine content class: if missing/invalid, show red styling; otherwise use card's default
  const contentClass = hasError
    ? "flex flex-col items-start gap-1 p-6 bg-red-50 rounded-xl border-2 border-dashed border-red-400"
    : isValid
      ? "flex flex-col items-start gap-1 p-6 rounded-xl border-2 border-dashed border-emerald-400 bg-white"
      : card.contentClassName;

  return (
    <div className={card.areaClassName}>
      <div className={contentClass}>
        <div className={card.iconWrapperClassName}>
          <UploadIllustration icon={card.icon} className="text-blue-700" />
        </div>
        <div className="flex items-start pt-3 pb-0 px-0 self-stretch w-full flex-col relative flex-[0_0_auto]">
          <p className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-normal text-transparent text-sm tracking-[0] leading-5">
            <span className="font-bold text-gray-800">
              {card.number}. {card.title}{" "}
            </span>
            {card.required ? <span className="text-red-500">*</span> : null}
          </p>
        </div>
        
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={card.accept}
          className="sr-only"
          aria-required={card.required ? true : undefined}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            onSelectFile(card.id, file);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="all-[unset] box-border gap-1 pt-3 pb-0 px-0 inline-flex items-center relative flex-[0_0_auto] cursor-pointer"
        >
          <Upload size={16} />
          <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-blue-700 text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
            {fileName || "No file chosen"}
          </div>
        </button>
        <div className="mt-3 text-xs text-gray-500">
          {card.description}
        </div>
        {hasError ? (
          <div className="flex flex-col items-start pt-1 pb-0 px-0 self-stretch w-full relative flex-[0_0_auto]">
            <div
              id={`${inputId}-error`}
              className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-red-600 text-xs tracking-[0] leading-4"
            >
              {error ?? (isMissing ? "This file is required" : null)}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

interface DocumentUploadSectionProps {
  documents: Record<string, File | null>;
  onDocumentsChange: (documents: Record<string, File | null>) => void;
  errors: Record<string, string>;
}

export const DocumentUploadSection = ({
  documents,
  onDocumentsChange,
  errors,
}: DocumentUploadSectionProps): JSX.Element => {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const uploadCards: UploadCard[] = [
    {
      id: "proof-of-enrollment",
      number: "2",
      title: "Proof of Enrollment",
      required: true,
      description: "PDF only • Max 5 MB",
      areaClassName: "relative row-[1_/_2] col-[2_/_3] w-full h-fit",
      contentClassName:
        "flex flex-col items-start gap-1 p-6 rounded-xl border-2 border-dashed border-blue-200 bg-white",
      iconWrapperClassName:
        "inline-flex items-start p-2 relative flex-[0_0_auto] bg-blue-100 rounded-lg",
      icon: "document",
      accept: ".pdf,application/pdf",
    },
    {
      id: "draft-endorsement",
      number: "3",
      title: "Draft Endorsement Letter",
      required: true,
      description: "Addressed to CHIEF, FLORA R. RALAR • PDF • Max 5 MB",
      areaClassName: "relative row-[2_/_3] col-[1_/_2] w-full h-fit",
      contentClassName:
        "flex flex-col items-start gap-1 p-6 rounded-xl border-2 border-dashed border-blue-200 bg-white",
      iconWrapperClassName:
        "inline-flex items-start p-2 relative flex-[0_0_auto] bg-blue-100 rounded-lg",
      icon: "mail",
      accept: ".pdf,application/pdf",
    },
    {
      id: "vaccine-card",
      number: "4",
      title: "Vaccine Card / Medical Cert.",
      required: true,
      description: "Xerox copy • PDF • Max 5 MB",
      areaClassName: "relative row-[2_/_3] col-[2_/_3] w-full h-fit",
      contentClassName:
        "flex flex-col items-start gap-1 p-6 rounded-xl border-2 border-dashed border-blue-200 bg-white",
      iconWrapperClassName:
        "inline-flex items-start p-2 relative flex-[0_0_auto] bg-blue-100 rounded-lg",
      icon: "medical",
      accept: ".pdf,application/pdf",
    },
    {
      id: "draft-moa",
      number: "5",
      title: "Draft Memorandum of Agreement",
      required: true,
      description: "PDF only • Max 5 MB",
      areaClassName: "relative row-[3_/_4] col-[1_/_2] w-full h-fit",
      contentClassName:
        "flex flex-col items-start gap-1 p-6 rounded-xl border-2 border-dashed border-blue-200 bg-white",
      iconWrapperClassName:
        "inline-flex items-start p-2 relative flex-[0_0_auto] bg-blue-100 rounded-lg",
      icon: "agreement",
      accept: ".pdf,application/pdf",
    },
    {
      id: "resume-cv",
      number: "1",
      title: "Resume / CV",
      required: true,
      description: "PDF only • Max 5 MB",
      error: errors["resume-cv"],
      areaClassName: "relative row-[1_/_2] col-[1_/_2] w-full h-fit",
      contentClassName:
        "flex flex-col items-start gap-1 p-6 bg-white rounded-xl border-2 border-dashed border-blue-200",
      iconWrapperClassName:
        "inline-flex items-start p-2 relative flex-[0_0_auto] bg-blue-100 rounded-lg",
      icon: "resume",
      accept: ".pdf,application/pdf",
    },
    {
      id: "picture-1x1",
      number: "6",
      title: "1×1 Picture",
      required: true,
      description: "JPG / PNG only • Square (1:1) • Max 2 MB",
      error: errors["picture-1x1"],
      areaClassName: "relative row-[3_/_4] col-[2_/_3] w-full h-fit",
      contentClassName:
        "flex flex-col items-start gap-1 p-6 bg-white rounded-xl border-2 border-dashed border-blue-200",
      iconWrapperClassName:
        "inline-flex items-start p-2 relative flex-[0_0_auto] bg-blue-100 rounded-lg",
      icon: "image",
      accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
    },
  ];

  const orderedCards = [
    uploadCards[4],
    uploadCards[0],
    uploadCards[1],
    uploadCards[2],
    uploadCards[3],
    uploadCards[5],
  ];

  const handleSelectFile = async (cardId: string, file: File | null) => {
    const card = uploadCards.find((c) => c.id === cardId);
    if (!card) return;

    // Clear previous local error for this card
    setLocalErrors((s) => {
      const next = { ...s };
      delete next[cardId];
      return next;
    });

    if (!file) {
      // user cleared file - mark as empty
      setLocalErrors((s) => ({ ...s, [cardId]: "This file is required" }));
      onDocumentsChange({ ...documents, [cardId]: null });
      return;
    }

    // Validate file type and size
    const isPdf = card.accept.includes("pdf");
    const maxSize = card.id === "picture-1x1" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;

    if (isPdf) {
      if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
        setLocalErrors((s) => ({ ...s, [cardId]: "Only PDF files are allowed" }));
        onDocumentsChange({ ...documents, [cardId]: null });
        return;
      }
    } else if (card.id === "picture-1x1") {
      if (!file.type.startsWith("image/")) {
        setLocalErrors((s) => ({ ...s, [cardId]: "Only JPG/PNG images are allowed" }));
        onDocumentsChange({ ...documents, [cardId]: null });
        return;
      }
    }

    if (file.size > maxSize) {
      setLocalErrors((s) => ({ ...s, [cardId]: `File must be under ${maxSize / (1024 * 1024)} MB` }));
      onDocumentsChange({ ...documents, [cardId]: null });
      return;
    }

    // If picture, validate 1:1 ratio
    if (card.id === "picture-1x1") {
      const dataUrl = await new Promise<string>((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(String(fr.result ?? ""));
        fr.onerror = rej;
        fr.readAsDataURL(file);
      });

      const dims = await new Promise<{ w: number; h: number }>((res, rej) => {
        const img = new Image();
        img.onload = () => res({ w: img.width, h: img.height });
        img.onerror = rej;
        img.src = dataUrl;
      });

      if (dims.w !== dims.h) {
        setLocalErrors((s) => ({ ...s, [cardId]: "Image must be square (1:1)" }));
        onDocumentsChange({ ...documents, [cardId]: null });
        return;
      }
    }

    // Passed validation
    setLocalErrors((s) => {
      const next = { ...s };
      delete next[cardId];
      return next;
    });
    onDocumentsChange({ ...documents, [cardId]: file });
  };

  return (
    <section className="flex flex-col items-center gap-6 p-8 self-stretch w-full relative flex-[0_0_auto]">
      <div className="flex items-center gap-3 pt-6 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
        <Info size={24} className="text-[#0047ab]" />
        <div className="inline-flex items-start flex-col relative flex-[0_0_auto]">
          <h2 className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-blue-900 text-lg tracking-[0.45px] leading-7 whitespace-nowrap">
            REQUIRED DOCUMENTS
          </h2>
        </div>
      </div>
      <div className="relative self-stretch w-full h-px border-t border-gray-100" />
      <div className="flex flex-col items-start p-4 relative self-stretch w-full flex-[0_0_auto] bg-blue-50 rounded-lg border border-solid border-blue-100">
        <div className="flex items-start gap-3 self-stretch w-full relative flex-[0_0_auto]">
          <div className="flex flex-col w-5 h-[22px] items-start pt-0.5 pb-0 px-0 relative">
            <AlertCircle size={20} />
          </div>
          <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
            <div className="flex flex-col items-start self-stretch w-full relative flex-[0_0_auto]">
              <p className="relative w-fit mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-gray-600 text-sm tracking-[0] leading-5">
                <span className="[font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-gray-600 text-sm tracking-[0] leading-5">
                  Upload all required documents below. Each PDF must be under{" "}
                </span>
                <span className="[font-family:'Nimbus_Sans-Bold',Helvetica] font-bold">
                  5 MB
                </span>
                <span className="[font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-gray-600 text-sm tracking-[0] leading-5">
                  ; the 1x1 picture must be{" "}
                </span>
                <span className="[font-family:'Nimbus_Sans-Bold',Helvetica] font-bold">
                  JPG/PNG, square, and
                </span>
                <span className="[font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-gray-600 text-sm tracking-[0] leading-5">
                  <br />
                </span>
                <span className="[font-family:'Nimbus_Sans-Bold',Helvetica] font-bold">
                  under 2 MB.
                </span>
              </p>
            </div>
            <button
              type="button"
              className="all-[unset] box-border flex items-center gap-1 relative self-stretch w-full flex-[0_0_auto] cursor-pointer"
            >
              <Download size={16} />
              <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-blue-700 text-sm tracking-[0] leading-5 underline whitespace-nowrap">
                Download Requirements Guide
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 auto-rows-min h-fit gap-8 pt-2 pb-0 px-0 w-full">
        {orderedCards.map((card) => (
          <UploadCardItem
            key={card.id}
            card={card}
            fileName={documents[card.id]?.name ?? ""}
            onSelectFile={handleSelectFile}
            error={localErrors[card.id] ?? errors[card.id]}
          />
        ))}
      </div>
    </section>
  );
};

export default DocumentUploadSection;