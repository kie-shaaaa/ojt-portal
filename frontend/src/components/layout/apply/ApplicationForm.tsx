"use client";

import { JSX, useState, useCallback } from "react";
import { HeaderSection } from "./HeaderSection";
import { FormStepper } from "./FormStepper";
import { PersonalDetailsSection } from "./PersonalDetailsSection";
import { OjtInformationSection } from "./OjtInformationSection";
import { DocumentUploadSection } from "./DocumentUploadSection";
import { DataPrivacySection } from "./DataPrivacySection";
import { FormActionsSection } from "./FormActionsSection";
import { apiCall } from "@/lib/api";
import ApplicationSubmittedModal from "../../modals/ApplicationSubmittedModal";
import { useRouter } from "next/navigation";

export type FormStep = 1 | 2 | 3 | 4;

export interface PersonalDetailsData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface OjtInformationData {
  school: string;
  course: string;
  hours: string;
  deploymentDate: string;
}

export interface DocumentUploadData {
  [key: string]: File | null;
}

export interface DataPrivacyData {
  agreed: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export const ApplicationForm = (): JSX.Element => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [personalDetails, setPersonalDetails] = useState<PersonalDetailsData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [ojtInformation, setOjtInformation] = useState<OjtInformationData>({
    school: "",
    course: "",
    hours: "",
    deploymentDate: "",
  });

  const [uploadedDocuments, setUploadedDocuments] =
    useState<DocumentUploadData>({});

  const [dataPrivacy, setDataPrivacy] = useState<DataPrivacyData>({
    agreed: false,
  });

  // Validation functions
  const validatePersonalDetails = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (!personalDetails.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!personalDetails.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!personalDetails.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalDetails.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!personalDetails.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(personalDetails.phone.replace(/\D/g, ""))) {
      errors.phone =
        "Please enter a valid 10-digit PH mobile number starting with 9";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [personalDetails]);

  const validateOjtInformation = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (!ojtInformation.school.trim()) {
      errors.school = "School is required";
    }
    if (!ojtInformation.course.trim()) {
      errors.course = "Course/Program is required";
    }
    if (!ojtInformation.hours.trim()) {
      errors.hours = "Hours to render is required";
    } else if (parseInt(ojtInformation.hours) < 1) {
      errors.hours = "Hours must be greater than 0";
    }
    if (!ojtInformation.deploymentDate.trim()) {
      errors.deploymentDate = "Deployment date is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [ojtInformation]);

  const validateDocuments = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    // Check for required documents
    const requiredDocs = [
      "resume-cv",
      "picture-1x1",
      "proof-of-enrollment",
      "draft-endorsement",
      "vaccine-card",
      "draft-moa",
    ];
    requiredDocs.forEach((docId) => {
      if (!uploadedDocuments[docId]) {
        errors[docId] =
          docId === "resume-cv"
            ? "Resume/CV is required"
            : docId === "picture-1x1"
              ? "1x1 Picture is required"
              : "This document is required";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [uploadedDocuments]);

  const validateDataPrivacy = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (!dataPrivacy.agreed) {
      errors.agreed = "You must agree to the data privacy terms";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [dataPrivacy]);

  // Step navigation
  const handleNext = useCallback(() => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validatePersonalDetails();
        if (!isValid) {
          return; // Stop navigation if validation fails
        }
        break;
      case 2:
        isValid = validateOjtInformation();
        if (!isValid) {
          return; // Stop navigation if validation fails
        }
        break;
      case 3:
        isValid = validateDocuments();
        if (!isValid) {
          return; // Stop navigation if validation fails
        }
        break;
      case 4:
        isValid = validateDataPrivacy();
        if (!isValid) {
          return; // Stop navigation if validation fails
        }
        break;
    }

    // Only proceed if we haven't reached the last step
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as FormStep);
      setValidationErrors({});
      setSubmitError(null);
    }
  }, [
    currentStep,
    validatePersonalDetails,
    validateOjtInformation,
    validateDocuments,
    validateDataPrivacy,
  ]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
      setValidationErrors({});
      setSubmitError(null);
    } else if (currentStep === 1) {
      router.push("/");
    }
  }, [currentStep, router]);

  const handleSubmit = useCallback(() => {
    const isValid =
      validatePersonalDetails() &&
      validateOjtInformation() &&
      validateDocuments() &&
      validateDataPrivacy();

    if (!isValid) {
      return;
    }

    setSubmitError(null);

    const formData = new FormData();
    const normalizedPhone = personalDetails.phone
      .replace(/\D/g, "")
      .slice(0, 10);

    formData.append("application_type", "ojt");
    formData.append("first_name", personalDetails.firstName);
    formData.append("last_name", personalDetails.lastName);
    formData.append("email", personalDetails.email);
    formData.append("phone", `+63${normalizedPhone}`);
    formData.append("school_name", ojtInformation.school);
    formData.append("course", ojtInformation.course);
    formData.append("hours_needed", ojtInformation.hours);
    formData.append("deployment_date", ojtInformation.deploymentDate);
    formData.append("agreed_terms", String(dataPrivacy.agreed));

    Object.entries(uploadedDocuments).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file, file.name);
      }
    });

    setIsSubmitting(true);

    void (async () => {
      try {
        const result = await apiCall("/applications/submit", {
          method: "POST",
          body: formData,
        });

        if (!result?.ok) {
          throw new Error(result?.message || "Failed to submit application");
        }

        setIsSuccessModalOpen(true);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to submit application";
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    })();
  }, [
    dataPrivacy.agreed,
    ojtInformation.course,
    ojtInformation.deploymentDate,
    ojtInformation.hours,
    ojtInformation.school,
    personalDetails.email,
    personalDetails.firstName,
    personalDetails.lastName,
    personalDetails.phone,
    uploadedDocuments,
    validateDataPrivacy,
    validateDocuments,
    validateOjtInformation,
    validatePersonalDetails,
  ]);

  const handleSuccessModalClose = useCallback(() => {
    setIsSuccessModalOpen(false);
    router.push("/");
  }, [router]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-4 py-8 [background:radial-gradient(50%_50%_at_50%_50%,rgba(30,58,138,1)_0%,rgba(15,23,42,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)]">
      <section
        aria-label="OJT application form"
        className="relative flex w-full max-w-4xl flex-col items-start overflow-hidden rounded-3xl bg-[#002b80] shadow-[0px_25px_50px_-12px_#00000040]"
      >
        <div className="self-stretch w-full overflow-hidden rounded-t-3xl bg-[#002b80]">
          <HeaderSection currentStep={currentStep} />
        </div>

        <div className="self-stretch w-full bg-white">
          {/* Step Indicator */}
          <FormStepper currentStep={currentStep} />

          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <PersonalDetailsSection
              data={personalDetails}
              onDataChange={setPersonalDetails}
              errors={validationErrors}
            />
          )}

          {/* Step 2: OJT Information */}
          {currentStep === 2 && (
            <OjtInformationSection
              data={ojtInformation}
              onDataChange={setOjtInformation}
              errors={validationErrors}
            />
          )}

          {/* Step 3: Document Upload */}
          {currentStep === 3 && (
            <DocumentUploadSection
              documents={uploadedDocuments}
              onDocumentsChange={setUploadedDocuments}
              errors={validationErrors}
            />
          )}

          {/* Step 4: Data Privacy */}
          {currentStep === 4 && (
            <DataPrivacySection
              data={dataPrivacy}
              onDataChange={setDataPrivacy}
              errors={validationErrors}
            />
          )}

          {submitError && (
            <div
              role="alert"
              className="mx-6 md:mx-12 mt-6 w-[calc(100%-3rem)] md:w-[calc(100%-6rem)] rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {submitError}
            </div>
          )}

          {/* Navigation Buttons */}
          <FormActionsSection
            onPrevious={handlePrevious}
            onNext={currentStep === 4 ? handleSubmit : handleNext}
            previousDisabled={false}
            nextDisabled={isSubmitting}
            previousLabel={currentStep === 1 ? "Return" : "Previous"}
            nextLabel={
              isSubmitting
                ? "Submitting..."
                : currentStep === 4
                  ? "Submit"
                  : "Next"
            }
          />
        </div>
      </section>

      <ApplicationSubmittedModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
      />
    </main>
  );
};

export default ApplicationForm;
