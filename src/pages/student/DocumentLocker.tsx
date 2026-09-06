import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { DocumentRecord } from '../../types';
import {
  FolderLock,
  UploadCloud,
  FileCheck,
  Trash2,
  Download,
  Plus,
  ShieldCheck,
  Clock,
  AlertTriangle,
  X,
  FileText,
} from 'lucide-react';

export default function DocumentLocker() {
  const { documents, addDocument, deleteDocument } = useData();
  const { t } = useLanguage();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<DocumentRecord['type']>('Income Certificate');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('450 KB');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    addDocument({
      title: docTitle,
      type: docType,
      fileName: fileName || `${docTitle.replace(/\s+/g, '_')}.pdf`,
      fileSize: fileSize || '500 KB',
      status: 'Verified',
    });

    setDocTitle('');
    setFileName('');
    setIsUploadOpen(false);
  };

  const statusIcons = {
    Verified: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    Pending: <Clock className="w-4 h-4 text-amber-600" />,
    Missing: <AlertTriangle className="w-4 h-4 text-rose-600" />,
  };

  const statusBadges = {
    Verified: 'bg-[#FEF3D6] dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300/40 dark:border-amber-800/40',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Missing: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#1E1B18] p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-[#FEF3D6] dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 rounded-lg">
              <FolderLock className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] dark:text-amber-400">
              Encrypted Academic Vault
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-950 dark:text-white">{t.documentLocker}</h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            Store, verify, and automatically attach your credentials to any scholarship application without repetitive re-uploads.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5B731] hover:bg-amber-500 text-stone-950 text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Trust & Verification Notice */}
      <div className="bg-[#FEF4DA] dark:bg-amber-950/30 border border-amber-300/60 dark:border-amber-800/40 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950 dark:text-amber-200">
        <ShieldCheck className="w-5 h-5 text-[#D97706] dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Verified Locker Security</p>
          <p className="text-amber-900 dark:text-amber-300 text-[11px] mt-0.5">
            Documents uploaded here are validated by authorized state nodal officers or university verifiers. These documents are directly linked when submitting in-portal scholarship applications.
          </p>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-[#1E1B18] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#D97706] dark:text-amber-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      statusBadges[doc.status]
                    }`}
                  >
                    {statusIcons[doc.status]}
                    {doc.status}
                  </span>
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-stone-950 dark:text-white mb-1">{doc.title}</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">{doc.type}</p>

              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                <span>File: {doc.fileName || 'credential.pdf'}</span>
                <span>{doc.fileSize || '380 KB'}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-400 dark:text-stone-500">Uploaded {doc.uploadDate}</span>
              <button
                onClick={() => alert(`Downloading verified copy of ${doc.title}`)}
                className="inline-flex items-center gap-1 font-bold text-[#D97706] dark:text-amber-400 hover:text-teal-800 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1B18] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-stone-950 dark:bg-black border-b border-stone-800 p-6 text-white relative">
              <button
                onClick={() => setIsUploadOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-xl font-bold text-white">Add Document to Locker</h2>
              <p className="text-xs text-stone-400 mt-1">Upload once, reuse across applications</p>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Income Certificate 2026 or PRC Assam"
                  className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-950 dark:text-white rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488] placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Document Category
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full p-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-950 dark:text-white rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488] cursor-pointer"
                >
                  <option value="Income Certificate">Income Certificate</option>
                  <option value="Domicile / PRC">Domicile / PRC</option>
                  <option value="Marksheet / Transcript">Marksheet / Transcript</option>
                  <option value="Caste Certificate">Caste Certificate</option>
                  <option value="ID Proof">Government ID Proof (Aadhaar/PAN)</option>
                  <option value="Resume">Academic Resume / CV</option>
                  <option value="Other">Other Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Select File (PDF / Image)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-[#F5B731] transition-colors cursor-pointer bg-gray-50/50 dark:bg-slate-800/40">
                  <UploadCloud className="w-8 h-8 text-[#D97706] dark:text-amber-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                    Click to browse or drag and drop file here
                  </p>
                  <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">PDF, PNG, JPG up to 10MB</p>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileName(e.target.files[0].name);
                        setFileSize(`${(e.target.files[0].size / 1024).toFixed(0)} KB`);
                        if (!docTitle) {
                          setDocTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                        }
                      }
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    className="mt-3 inline-block px-3 py-1.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-200 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Choose Local File
                  </label>
                  {fileName && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2">Selected: {fileName} ({fileSize})</p>
                  )}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#F5B731] hover:bg-amber-500 text-stone-950 rounded-xl shadow-sm cursor-pointer"
                >
                  Save to Locker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



