import { JSX, useId, useRef, useState } from "react";
import {
  FileText,
  Mail,
  Upload,
  Heart,
  FileCheck,
  Image,
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

const UploadIllustration = ({ icon }: { icon: UploadCard["icon"] }) => {
  if (icon === "resume") {
    return (
      <div aria-hidden="true">
        <FileText size={32} />
      </div>
    );
  }

  if (icon === "document") {
    return (
      <div aria-hidden="true">
        <FileText size={32} />
      </div>
    );
  }

  if (icon === "mail") {
    return (
      <div aria-hidden="true">
        <Mail size={32} />
      </div>
    );
  }

  if (icon === "medical") {
    return (
      <div aria-hidden="true">
        <Heart size={32} />
      </div>
    );
  }

  if (icon === "agreement") {
    return (
      <div aria-hidden="true">
        <FileCheck size={32} />
      </div>
    );
  }

  return (
    <div aria-hidden="true">
      <Image size={32} />
    </div>
  );
};

const UploadCardItem = ({
  card,
  fileName,
  onSelectFile,
}: {
  card: UploadCard;
  fileName: string;
  onSelectFile: (cardId: string, file: File | null) => void;
}) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={card.areaClassName}>
      <div className={card.contentClassName}>
        <div className={card.iconWrapperClassName}>
          <UploadIllustration icon={card.icon} />
        </div>
        <div className="flex items-start pt-3 pb-0 px-0 self-stretch w-full flex-col relative flex-[0_0_auto]">
          <p className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-normal text-transparent text-sm tracking-[0] leading-5">
            <span className="font-bold text-gray-800">
              {card.number}. {card.title}{" "}
            </span>
            {card.required ? <span className="text-red-500">*</span> : null}
            {card.optional ? (
              <span className="[font-family:'Nimbus_Sans-Regular',Helvetica] text-gray-400">
                (optional)
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex flex-col items-start self-stretch w-full relative flex-[0_0_auto]">
          <p
            className={`relative flex items-center self-stretch mt-[-1.00px] text-xs tracking-[0] leading-4 ${
              card.id === "draft-endorsement"
                ? "[font-family:'Nimbus_Sans-Italic',Helvetica] font-normal italic text-gray-400"
                : "[font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-gray-400"
            }`}
          >
            {card.description}
          </p>
        </div>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={card.accept}
          className="sr-only"
          aria-required={card.required ? true : undefined}
          aria-invalid={card.error ? true : undefined}
          aria-describedby={card.error ? `${inputId}-error` : undefined}
          onChange={async (event) => {
            const file = event.target.files?.[0] ?? null;
            if (file) {
              const isValid = await validateFile(file);
              if (isValid) {
                onSelectFile(card.id, file);
              } else {
                // Reset input if validation fails
                inputRef.current!.value = "";
                onSelectFile(card.id, null);
              }
            } else {
              onSelectFile(card.id, null);
            }
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
        {card.error ? (
          <div className="flex flex-col items-start pt-1 pb-0 px-0 self-stretch w-full relative flex-[0_0_auto]">
            <div
              id={`${inputId}-error`}
              className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Nimbus_Sans-Regular',Helvetica] font-normal text-red-600 text-xs tracking-[0] leading-4"
            >
              {card.error}
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
  const uploadCards: UploadCard[] = [
    {
      id: "proof-of-enrollment",
      number: "2",
      title: "Proof of Enrollment",
      optional: true,
      description: "PDF only • Max 5 MB",
      areaClassName: "relative row-[1_/_2] col-[2_/_3] w-full h-fit",
      contentClassName:
        "flex flex-col items-start gap-1 pt-6 pb-12 px-6 rounded-xl border-2 border-dashed border-blue-200",
      iconWrapperClassName:
        "inline-flex items-start p-2 relative flex-[0_0_auto] bg-blue-100 rounded-lg",
      icon: "document",
      accept: ".pdf,application/pdf",
    },
    {
      id: "draft-endorsement",
      number: "3",
      title: "Draft Endorsement Letter",
      optional: true,
      description: "Addressed to CHIEF, FLORA R. RALAR • PDF • Max 5 MB",
      areaClassName: "relative row-[2_/_3] col-[1_/_2] w-full h-fit",
      contentClassName:
        "flex flex-col items-start gap-1 p-6 rounded-xl border-2 border-dashed border-blue-200",
      iconWrapperClassName:
      const validateFile = async (file: File): Promise<boolean> => {
        // Check file size
        const maxSize = card.id === "picture-1x1" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
          alert(
            `File size exceeds the maximum limit of ${maxSize / (1024 * 1024)} MB`
          );
          return false;
        }

        // For 1x1 picture, validate aspect ratio
        if (card.id === "picture-1x1" && file.type.startsWith("image/")) {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                const isSquare = img.width === img.height;
                if (!isSquare) {
                  alert(
                    `Image must be square (1:1 ratio). Current dimensions: ${img.width}x${img.height}`
                  );
                  resolve(false);
                } else {
                  resolve(true);
                }
              };
              img.onerror = () => {
                alert("Failed to read image");
                resolve(false);
              };
              img.src = e.target?.result as string;
            };
            reader.onerror = () => {
              alert("Failed to read file");
              resolve(false);
            };
            reader.readAsDataURL(file);
          });
        }

        return true;
      };
        "inline-flex items-start p-2 relative flex-[0_0_auto] bg-blue-100 rounded-lg",
      icon: "mail",
      accept: ".pdf,application/pdf",
    },
    {
      id: "vaccine-card",
      number: "4",
      title: "Vaccine Card / Medical Cert.",
      optional: true,
      description: "Xerox copy • PDF • Max 5 MB",
      areaClassName: "relative row-[2_/_3] col-[2_/_3] w-full h-fit",
      contentClassName:
        "flex flex-col items-start gap-1 p-6 rounded-xl border-2 border-dashed border-blue-200",
      iconWrapperClassName:
        "inline-flex items-start p-2 relative flex-[0_0_auto] bg-blue-100 rounded-lg",
      icon: "medical",
      accept: ".pdf,application/pdf",
    },
    {
      id: "draft-moa",
      number: "5",
      title: "Draft Memorandum of Agreement",
      optional: true,
      description: "PDF only • Max 5 MB",
      areaClassName: "relative row-[3_/_4] col-[1_/_2] w-full h-fit",
      contentClassName:
        "flex flex-col items-start gap-1 pt-6 pb-12 px-6 rounded-xl border-2 border-dashed border-blue-200",
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
        "flex flex-col items-start gap-1 p-6 bg-red-50 rounded-xl border-2 border-dashed border-red-400",
      iconWrapperClassName:
        "inline-flex items-start p-2 relative flex-[0_0_auto] bg-white rounded-lg shadow-[0px_1px_2px_#0000000d]",
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
        "flex flex-col items-start gap-1 p-6 bg-red-50 rounded-xl border-2 border-dashed border-red-400",
      iconWrapperClassName:
        "inline-flex items-start p-2 relative flex-[0_0_auto] bg-red-50 rounded-lg",
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

  const handleSelectFile = (cardId: string, file: File | null) => {
    onDocumentsChange({
      ...documents,
      [cardId]: file,
    });
  };

  return (
    <section className="flex flex-col items-center gap-6 p-8 self-stretch w-full relative flex-[0_0_auto]">
      <div className="flex items-center gap-3 pt-6 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
        <Info size={24} />
        <div className="inline-flex items-start flex-col relative flex-[0_0_auto]">
          <h2 className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-blue-900 text-lg tracking-[0.45px] leading-7 whitespace-nowrap">
            REQUIRED DOCUMENTS
          </h2>
        </div>
      </div>
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
      <div className="grid grid-cols-2 grid-rows-[212px_188px_212px] h-fit gap-6 pt-2 pb-0 px-0 w-full">
        {orderedCards.map((card) => (
          <UploadCardItem
            key={card.id}
            card={card}
            fileName={documents[card.id]?.name ?? ""}
            onSelectFile={handleSelectFile}
          />
        ))}
      </div>
    </section>
  );
};

export default DocumentUploadSection;