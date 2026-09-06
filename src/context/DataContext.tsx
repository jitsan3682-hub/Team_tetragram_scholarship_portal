import React, { createContext, useContext, useState, useEffect } from 'react';
import { Scholarship, Application, Activity, DocumentRecord, LorRequest } from '../types';
import { mockScholarships, mockInitialDocuments, mockInitialApplications, mockInitialLors } from '../data/mockData';
import { useAuth } from './AuthContext';

interface DataContextType {
  scholarships: Scholarship[];
  savedScholarshipIds: string[];
  applications: Application[];
  activities: Activity[];
  documents: DocumentRecord[];
  lorRequests: LorRequest[];
  
  // Bookmarking / Save for Later
  toggleSaveScholarship: (id: string) => void;
  removeSavedScholarship: (id: string) => void;
  isSaved: (id: string) => boolean;

  // Applications
  applyForScholarship: (scholarshipId: string, sopText: string, attachedDocs: string[]) => void;
  withdrawApplication: (id: string) => void;
  updateApplicationStatus: (id: string, status: Application['status'], remarks: string) => void;

  // Document Checklist per Scholarship
  docChecklist: Record<string, Record<string, boolean>>;
  toggleDocCheck: (schId: string, doc: string) => void;
  getCheckedDocCount: (schId: string) => number;

  // Document Locker
  addDocument: (doc: Omit<DocumentRecord, 'id' | 'uploadDate'>) => void;
  deleteDocument: (id: string) => void;

  // LOR Requests
  requestLor: (lor: Omit<LorRequest, 'id' | 'requestedDate' | 'status'>) => void;

  // Admin Scholarship Management
  addScholarship: (scholarship: Omit<Scholarship, 'id'>) => void;
  updateScholarship: (id: string, updated: Partial<Scholarship>) => void;
  deleteScholarship: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_SAVED_KEY = 'saved_scholarships_v1';
const STORAGE_SCHOLARSHIPS_KEY = 'portal_scholarships_v2';
const STORAGE_APPLICATIONS_KEY = 'student_applications_v1';
const STORAGE_DOCUMENTS_KEY = 'student_documents_v1';
const STORAGE_LORS_KEY = 'student_lors_v1';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // 1. Scholarships list with localStorage fallback
  const [scholarships, setScholarships] = useState<Scholarship[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SCHOLARSHIPS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 100) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse local scholarships', e);
    }
    return mockScholarships;
  });

  // 2. Saved / Bookmarked scholarships (Strictly persistent in localStorage)
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved scholarships from storage', e);
    }
    return [];
  });

  // 3. Applications
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_APPLICATIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse applications', e);
    }
    return mockInitialApplications;
  });

  // 4. Documents in Locker
  const [documents, setDocuments] = useState<DocumentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DOCUMENTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse documents', e);
    }
    return mockInitialDocuments;
  });

  // 5. LOR Requests
  const [lorRequests, setLorRequests] = useState<LorRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LORS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse LORs', e);
    }
    return mockInitialLors;
  });

  const [activities, setActivities] = useState<Activity[]>([]);

  // Sync to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedScholarshipIds));
  }, [savedScholarshipIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SCHOLARSHIPS_KEY, JSON.stringify(scholarships));
  }, [scholarships]);

  useEffect(() => {
    localStorage.setItem(STORAGE_APPLICATIONS_KEY, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_DOCUMENTS_KEY, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_LORS_KEY, JSON.stringify(lorRequests));
  }, [lorRequests]);

  // 6. Interactive Document Checklist State
  const [docChecklist, setDocChecklist] = useState<Record<string, Record<string, boolean>>>(() => {
    try {
      const saved = localStorage.getItem('scholarship_doc_checklists_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse doc checklists', e);
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('scholarship_doc_checklists_v1', JSON.stringify(docChecklist));
  }, [docChecklist]);

  const toggleDocCheck = (schId: string, doc: string) => {
    setDocChecklist((prev) => {
      const schDocs = prev[schId] || {};
      const updated = {
        ...prev,
        [schId]: {
          ...schDocs,
          [doc]: !schDocs[doc],
        },
      };
      localStorage.setItem('scholarship_doc_checklists_v1', JSON.stringify(updated));
      return updated;
    });
  };

  const getCheckedDocCount = (schId: string) => {
    const schDocs = docChecklist[schId] || {};
    return Object.values(schDocs).filter(Boolean).length;
  };

  // Bookmarking / "Save for Later" Logic
  const toggleSaveScholarship = (id: string) => {
    setSavedScholarshipIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeSavedScholarship = (id: string) => {
    setSavedScholarshipIds((prev) => {
      const next = prev.filter((item) => item !== id);
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isSaved = (id: string) => savedScholarshipIds.includes(id);

  // Application Actions
  const applyForScholarship = (scholarshipId: string, sopText: string, attachedDocs: string[]) => {
    const sch = scholarships.find((s) => s.id === scholarshipId);
    const newApp: Application = {
      id: `app-${Date.now()}`,
      scholarshipId,
      scholarshipTitle: sch ? sch.title : 'Direct Application',
      studentId: user?.id || 'guest',
      studentName: user?.name || 'Candidate',
      studentEmail: user?.email || 'candidate@tezhack.in',
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      adminRemarks: 'Application received and verified by system. Queued for committee review.',
      sopText,
      attachedDocs,
      scoreRubric: {
        academicScore: 85,
        needScore: 80,
        sopScore: 82,
        totalScore: 82.3,
      },
    };
    setApplications((prev) => [newApp, ...prev]);
  };

  const withdrawApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const updateApplicationStatus = (id: string, status: Application['status'], remarks: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status, adminRemarks: remarks } : app))
    );
  };

  // Document Locker Actions
  const addDocument = (doc: Omit<DocumentRecord, 'id' | 'uploadDate'>) => {
    const newDoc: DocumentRecord = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Verified',
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // LOR Requests
  const requestLor = (lor: Omit<LorRequest, 'id' | 'requestedDate' | 'status'>) => {
    const newLor: LorRequest = {
      ...lor,
      id: `lor-${Date.now()}`,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Requested',
    };
    setLorRequests((prev) => [newLor, ...prev]);
  };

  // Admin Scholarship Management
  const addScholarship = (schData: Omit<Scholarship, 'id'>) => {
    const newSch: Scholarship = {
      ...schData,
      id: `sch-${Date.now()}`,
    };
    setScholarships((prev) => [newSch, ...prev]);
  };

  const updateScholarship = (id: string, updated: Partial<Scholarship>) => {
    setScholarships((prev) =>
      prev.map((sch) => (sch.id === id ? { ...sch, ...updated } : sch))
    );
  };

  const deleteScholarship = (id: string) => {
    setScholarships((prev) => prev.filter((sch) => sch.id !== id));
    // Also remove from saved if deleted
    setSavedScholarshipIds((prev) => prev.filter((item) => item !== id));
  };

  return (
    <DataContext.Provider
      value={{
        scholarships,
        savedScholarshipIds,
        applications,
        activities,
        documents,
        lorRequests,
        docChecklist,
        toggleDocCheck,
        getCheckedDocCount,
        toggleSaveScholarship,
        removeSavedScholarship,
        isSaved,
        applyForScholarship,
        withdrawApplication,
        updateApplicationStatus,
        addDocument,
        deleteDocument,
        requestLor,
        addScholarship,
        updateScholarship,
        deleteScholarship,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
