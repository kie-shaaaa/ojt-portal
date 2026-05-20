import {JSX} from "react";
import { RequiredDocumentsUploadSection } from "../../../components/layout/resubmission/RequiredDocumentUpload";
import { ApplicationResubmissionBannerSection } from "../../../components/layout/resubmission/ApplicationResubmissionBanner";

export const ResubmissionPage = (): JSX.Element => {
    return (
        <main className="bg-white w-full min-h-screen flex flex-col">
        <ApplicationResubmissionBannerSection/>
        <RequiredDocumentsUploadSection/>
        </main>
    )
};

export default ResubmissionPage;