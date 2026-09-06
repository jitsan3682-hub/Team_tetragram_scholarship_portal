/**
 * Shared reference lists for the Scholarship Eligibility Portal.
 *
 * Used by BOTH the student Profile form and the Administrator
 * "Add Scholarship" form, so that any eligibility rule an administrator
 * writes can always be selected by a student filling in their profile.
 * Single source of truth prevents silent mismatches.
 */

export const INDIAN_STATES: string[] = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export interface FieldOfStudyGroup {
  category: string;
  options: string[];
}

export const FIELD_OF_STUDY_CATEGORIES: FieldOfStudyGroup[] = [
  {
    category: "STEM",
    options: ["Computer Science", "Information Technology", "Engineering", "Mathematics", "Science"]
  },
  {
    category: "Health & Medicine",
    options: ["Medicine", "Nursing", "Public Health", "Physical Therapy", "Psychiatry"]
  },
  {
    category: "Business & Law",
    options: ["Business Administration", "Economics", "Marketing", "Forensic Accounting", "Law"]
  },
  {
    category: "Arts, Humanities & Education",
    options: ["History", "English", "Foreign Languages", "Journalism", "Special Education"]
  },
  {
    category: "General",
    options: ["General Studies", "Interdisciplinary", "Undeclared", "Vocational/Trade"]
  }
];

export const ALL_FIELDS_OF_STUDY: string[] = FIELD_OF_STUDY_CATEGORIES.flatMap((g) => g.options);

// Comprehensive list supporting standard clusters plus complementary legacy scheme terms
export const MAJORS_LIST: string[] = [
  ...ALL_FIELDS_OF_STUDY,
  "Technology",
  "Medical",
  "Management",
  "Commerce",
  "Arts",
  "Agriculture",
  "Pharmacy",
  "Polytechnic",
  "Architecture",
  "Professional"
];

export const CATEGORIES: string[] = [
  "Central",
  "State",
  "UGC",
  "AICTE",
  "Private",
  "Corporate",
  "International"
];

export const GENDER_CATEGORIES = [
  'All',
  'Male',
  'Female (in STEM)',
  'Female',
  'Transgender'
] as const;

export type Gender = (typeof GENDER_CATEGORIES)[number];
