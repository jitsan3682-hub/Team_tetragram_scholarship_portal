export type Role = 'student' | 'admin';

export type AcademicLevel = 'School' | 'Undergraduate' | 'Postgraduate' | 'Doctoral' | 'Diploma';

export type AwardType = 'Full-Ride' | 'Tuition Waiver' | 'Living Stipend' | 'One-Time Grant' | 'Merit Award';

export type Category = 'General' | 'SC' | 'ST' | 'OBC' | 'EWS' | 'Minority';

export type Gender = 'All' | 'Male' | 'Female (in STEM)' | 'Female' | 'Transgender' | 'Other';

export const GENDER_CATEGORIES: Gender[] = [
  'All',
  'Male',
  'Female (in STEM)',
  'Female',
  'Transgender',
];

export const ALL_INDIAN_STATES = [
  'All',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const;

export interface FieldOfStudyGroup {
  category: string;
  options: string[];
}

export const FIELD_OF_STUDY_CATEGORIES: FieldOfStudyGroup[] = [
  {
    category: 'STEM',
    options: ['Computer Science', 'Information Technology', 'Engineering', 'Mathematics', 'Science']
  },
  {
    category: 'Health & Medicine',
    options: ['Medicine', 'Nursing', 'Public Health', 'Physical Therapy', 'Psychiatry']
  },
  {
    category: 'Business & Law',
    options: ['Business Administration', 'Economics', 'Marketing', 'Forensic Accounting', 'Law']
  },
  {
    category: 'Arts, Humanities & Education',
    options: ['History', 'English', 'Foreign Languages', 'Journalism', 'Special Education']
  },
  {
    category: 'General',
    options: ['General Studies', 'Interdisciplinary', 'Undeclared', 'Vocational/Trade']
  }
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  state?: string;
  major?: string;
  academicLevel?: AcademicLevel;
  gpa?: number;
  familyIncome?: number;
  category?: Category;
  expectedGraduationYear?: number;
  gender?: Gender | string;
  isCAPFWard?: boolean;
  extracurriculars?: string[];
  careerGoals?: string;
  profilePicture?: string | null;
}

export interface Activity {
  id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  type: string;
}

export type ScholarshipStatus = 'Ongoing' | 'Upcoming' | 'Closed';

export interface AwardBreakdown {
  tuition: string | boolean;
  accommodation?: string | boolean;
  travel?: string | boolean;
  booksOrStipend?: string | boolean;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  status: ScholarshipStatus;
  deadline: string; // ISO or YYYY-MM-DD
  amount: number | string;
  awardType: AwardType;
  academicLevels: AcademicLevel[];
  description: string;
  category?: string;
  isCustom?: boolean;
  country?: string;
  nationality?: string;
  isInternational?: boolean;
  applicationUrl?: string;
  fieldOfStudy?: string;
  eligibility: {
    minGpa: number;
    maxIncome: number;
    states: string[]; // 'All' or specific states
    majors: string[]; // 'All' or specific majors
    categories?: string[];
    genders?: string[]; // 'All', 'Female', 'Male'
    requiresCAPF?: boolean;
  };
  awardBreakdown: AwardBreakdown;
  docsNeeded: string[];
  link: string;
  isVerified: boolean;
}

export type ApplicationStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Shortlisted' | 'Awarded' | 'Rejected';

export interface Application {
  id: string;
  scholarshipId: string;
  scholarshipTitle?: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  dateApplied: string;
  status: ApplicationStatus;
  adminRemarks: string;
  sopText?: string;
  attachedDocs?: string[];
  scoreRubric?: {
    academicScore: number;
    needScore: number;
    sopScore: number;
    totalScore: number;
  };
}

export interface DocumentRecord {
  id: string;
  title: string;
  type: 'Income Certificate' | 'Domicile / PRC' | 'Marksheet / Transcript' | 'Caste Certificate' | 'ID Proof' | 'Resume' | 'Other';
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Missing';
  fileName?: string;
  fileSize?: string;
}

export interface LorRequest {
  id: string;
  professorName: string;
  professorEmail: string;
  organization: string;
  status: 'Requested' | 'Received' | 'Pending';
  requestedDate: string;
  notes?: string;
}

export interface RuleCriterionResult {
  rule: string;
  satisfied: boolean;
  userValue: string | number;
  requiredValue: string | number;
  message: string;
}

export interface EligibilityResult {
  status: 'Eligible' | 'Possibly Eligible' | 'Not Eligible';
  reasons: string[];
  missingFields: string[];
  criteriaPassed: RuleCriterionResult[];
  // Dual-compatibility fields for automated evaluations & scoring
  isEligible: boolean;
  matchScore: number;
  unmetCriteria: string[];
}
