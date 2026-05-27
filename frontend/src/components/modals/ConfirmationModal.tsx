"use client";

import { PersonalDetailsData, OjtInformationData } from "../layout/apply/ApplicationForm";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  personalDetails: PersonalDetailsData;
  ojtInformation: OjtInformationData;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  personalDetails,
  ojtInformation,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Confirm Submission
              </h3>
              <div className="mt-4 space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-semibold text-gray-800">Personal Details</h4>
                  <p><strong>First Name:</strong> {personalDetails.firstName}</p>
                  <p><strong>Last Name:</strong> {personalDetails.lastName}</p>
                  <p><strong>Email:</strong> {personalDetails.email}</p>
                  <p><strong>Phone:</strong> {personalDetails.phone}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">OJT Information</h4>
                  <p><strong>School:</strong> {ojtInformation.school}</p>
                  <p><strong>Course:</strong> {ojtInformation.course}</p>
                  <p><strong>Hours to Render:</strong> {ojtInformation.hours}</p>
                  <p><strong>Deployment Date:</strong> {ojtInformation.deploymentDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;