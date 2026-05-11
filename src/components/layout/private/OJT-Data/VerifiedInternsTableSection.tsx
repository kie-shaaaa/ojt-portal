"use client";
import InlineInternDetailsModal, { ModalInternData } from "./InlineInternDetailsModal";
import { JSX, useState } from "react";
import { Download, Eye, SquarePen, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";

interface Intern {
  id: string;
  ojtId: string;
  name: string;
  email: string;
  school: string;
  startDate: string;
  endDate: string;
  status: 'verified' | 'completed';
  verifiedDate: string;
  gender?: string;
  ojtDetails?: string;
  deploymentDate?: string;
}

interface VerifiedInternsTableSectionProps {
  interns: Intern[];
  onViewDetails?: (intern: any) => void;
}

export const VerifiedInternsTableSection = ({ interns, onViewDetails }: VerifiedInternsTableSectionProps): JSX.Element => {
  const [selectedInterns, setSelectedInterns] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [viewingIntern, setViewingIntern] = useState<ModalInternData | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedInterns([]);
    } else {
      setSelectedInterns(interns.map(intern => intern.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectIntern = (id: string) => {
    if (selectedInterns.includes(id)) {
      setSelectedInterns(selectedInterns.filter(internId => internId !== id));
      setSelectAll(false);
    } else {
      setSelectedInterns([...selectedInterns, id]);
      if (selectedInterns.length + 1 === interns.length) {
        setSelectAll(true);
      }
    }
  };

  const exportToExcel = (dataToExport: Intern[]) => {
    const excelData = dataToExport.map(intern => ({
      'OJT ID': intern.ojtId,
      'Intern Name': intern.name,
      'Gender': intern.gender || 'Not set',
      'School': intern.school,
      'OJT Details': intern.ojtDetails || '—',
      'Deployment Date': formatDate(intern.startDate),
      'End Date': formatDate(intern.endDate),
      'Email': intern.email,
      'Status': intern.status,
      'Verified Date': formatDate(intern.verifiedDate)
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    const colWidths = [
      { wch: 15 },
      { wch: 25 },
      { wch: 10 },
      { wch: 35 },
      { wch: 30 },
      { wch: 18 },
      { wch: 15 },
      { wch: 30 },
      { wch: 12 },
      { wch: 18 }
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Verified Interns");

    const fileName = `verified_interns_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    XLSX.writeFile(workbook, fileName);
  };

  const handleExportExcel = () => {
    if (selectedInterns.length > 0) {
      const selectedData = interns.filter(intern => selectedInterns.includes(intern.id));
      exportToExcel(selectedData);
    } else {
      exportToExcel(interns);
    }
  };

  const handleViewDetails = (intern: Intern) => {
    const requirementFiles = [
      { id: 'resume-or-cv', title: 'RESUME OR CV', fileType: 'PDF' as const },
      { id: 'proof-of-enrollment', title: 'PROOF OF ENROLLMENT', fileType: 'PDF' as const },
      { id: 'draft-endorsement-letter', title: 'DRAFT ENDORSEMENT LETTER', subtitle: '(ADDRESS TO CHIEF. FLORA R. RALAR)', fileType: 'PDF' as const },
      { id: 'vaccine-card-or-medical-cert', title: 'VACCINE CARD OR MEDICAL CERT.', subtitle: '(XEROX COPY)', fileType: 'PDF' as const },
      { id: 'draft-memorandum-of-agreement', title: 'DRAFT MEMORANDUM OF AGREEMENT', fileType: 'PDF' as const },
      { id: '1x1-picture', title: '1X1 PICTURE', fileType: 'JPG/PNG' as const },
    ];

    const modalData: ModalInternData = {
      ojtId: intern.ojtId,
      portalId: intern.ojtId.replace('NTC-', 'OJT-'),
      name: intern.name,
      gender: intern.gender || 'Not specified',
      email: intern.email,
      phone: 'N/A',
      school: intern.school,
      course: intern.ojtDetails || 'Not specified',
      hoursNeeded: 'N/A',
      deploymentDate: intern.startDate,
      endDate: intern.endDate,
      requirementFiles,
    };

    console.log('Opening inline modal for:', modalData.name);
    setViewingIntern(modalData);
  };

  const handleEdit = (intern: Intern) => {
    console.log("Editing intern:", intern);
  };

  const handleDelete = (intern: Intern) => {
    if (confirm(`Are you sure you want to delete ${intern.name}?`)) {
      console.log("Deleting intern:", intern);
    }
  };

  return (
    <>
      <section className="flex relative self-stretch w-full flex-col items-start gap-4 rounded-lg border border-solid border-slate-200 bg-white shadow-[0px_1px_2px_#0000000d] overflow-hidden">
        {/* Header with title and export button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 pb-0 w-full">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Verified Interns (OJT Data)</h3>
            <p className="text-sm text-slate-500 mt-1">
              Showing {interns.length} of {interns.length} interns
            </p>
          </div>
          <div className="flex gap-3">
            {/* Export to Excel Button */}
            <button 
              onClick={handleExportExcel}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-700 w-12">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border border-slate-300 bg-white accent-blue-600 focus:ring-blue-500"
                    />
                </th>
                <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-700">OJT ID</th>
                <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-700">INTERN NAME</th>
                <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-700">GENDER</th>
                <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-700">SCHOOL</th>
                <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">OJT DETAILS</th>
                <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">DEPLOYMENT DATE</th>
                <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">END DATE</th>
                <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-700">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {interns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                    No interns found
                  </td>
                </tr>
              ) : (
                interns.map((intern) => (
                  <tr key={intern.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedInterns.includes(intern.id)}
                          onChange={() => handleSelectIntern(intern.id)}
                          className="w-4 h-4 rounded border border-slate-300 bg-white accent-blue-600 focus:ring-blue-500"
                          aria-label={`Select intern ${intern.name}`}
                        />
                      </label>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{intern.ojtId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{intern.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 ">{intern.gender || 'Not set'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{intern.school}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{intern.ojtDetails || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{formatDate(intern.startDate)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{formatDate(intern.endDate)}</td>
                    <td className="px-6 py-4 text-sm">
                     
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(intern)}
                          className="rounded-md bg-blue-50 p-2 text-blue-500 transition hover:bg-blue-100">
                      <Eye size={16} />
                          
                        </button>
                        <button
                          onClick={() => handleEdit(intern)}
                           className="rounded-md bg-amber-50 p-2 text-[#CA8A04] transition hover:bg-amber-100">
                            <SquarePen size={16}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(intern)}
                          className="rounded-md bg-red-50 p-2 text-red-500 transition hover:bg-red-100">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with selection info */}
        {selectedInterns.length > 0 && (
          <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 flex items-center justify-between w-full">
            <p className="text-sm text-blue-700">
              Selected {selectedInterns.length} intern(s)
            </p>
            <button
              onClick={handleExportExcel}
              className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Export Selected
            </button>
          </div>
        )}
      </section>

      {/* FIXED: Remove the !onViewDetails condition */}
      {viewingIntern && (
        <InlineInternDetailsModal
          intern={viewingIntern}
          onClose={() => {
            console.log('Closing inline modal');
            setViewingIntern(null);
          }}
        />
      )}
    </>
  );
};