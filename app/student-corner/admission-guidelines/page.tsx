import AdmissionGuidelines from "./admissionguidelines";
import Discipline from "./discipline";
import ScholarshipPolicy from "./scholarshipPolicy";
import LegalDocuments from "./legalDocuments";

export default function Page() {
  return (
    <>
      <AdmissionGuidelines />
      <Discipline />
      <ScholarshipPolicy />
      <LegalDocuments />
    </>
  );
}