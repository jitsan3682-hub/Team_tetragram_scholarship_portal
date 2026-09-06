/**
 * Multi-lingual UI translations for TEZHACK 2026 Scholarship Eligibility Portal
 * Supporting English (en), Assamese (as), and Hindi (hi)
 */

export type SupportedLanguage = 'en' | 'hi' | 'as';

export interface TranslationDict {
  appName: string;
  tagline: string;
  dashboardTitle: string;
  eligible: string;
  notEligible: string;
  possiblyEligible: string;
  saveForLater: string;
  saved: string;
  savedScholarships: string;
  allScholarships: string;
  onlyEligible: string;
  discoveryMatcher: string;
  myProfile: string;
  applicationTracker: string;
  documentLocker: string;
  sopLorManager: string;
  resourceCenter: string;
  helpdeskFaq: string;
  adminPortal: string;
  searchPlaceholder: string;
  filterByLevel: string;
  filterByStream: string;
  filterByState: string;
  filterByGender: string;
  filterByCategory: string;
  filterByAward: string;
  sortByDeadline: string;
  all: string;
  closingSoon: string;
  applyNow: string;
  viewDetails: string;
  officialNotice: string;
  verifiedSource: string;
  eligibilityBreakdown: string;
  requiredDocuments: string;
  whyEligible: string;
  whyNotEligible: string;
  whyPossible: string;
  saveForLaterHint: string;
  noSavedYet: string;
  noSavedDesc: string;
  submitApplication: string;
  statusSubmitted: string;
  statusReview: string;
  statusShortlisted: string;
  statusAwarded: string;
  statusRejected: string;
  ruleCheckTitle: string;
  disclaimer: string;
  logout: string;
  login: string;
  register: string;
  instructionsGuide: string;
}

export const translations: Record<SupportedLanguage, TranslationDict> = {
  en: {
    appName: "ScholarBridge India",
    tagline: "Transparent, Rule-Based Scholarship Discovery & ATS",
    dashboardTitle: "Scholarship Directory & Matcher",
    eligible: "Eligible",
    notEligible: "Not Eligible",
    possiblyEligible: "Possibly Eligible",
    saveForLater: "Save for Later",
    saved: "Saved",
    savedScholarships: "Saved Scholarships",
    allScholarships: "All Opportunities",
    onlyEligible: "Only My Eligible",
    discoveryMatcher: "Discovery & Matcher",
    myProfile: "Student Profile",
    applicationTracker: "Application Pipeline (ATS)",
    documentLocker: "Document Locker",
    sopLorManager: "SOP & LOR Tracker",
    resourceCenter: "Resources & Guidance",
    helpdeskFaq: "FAQ & Helpdesk",
    adminPortal: "Admin Dashboard",
    searchPlaceholder: "Search by title, provider, field, or keywords...",
    filterByLevel: "Academic Level",
    filterByStream: "Field of Study",
    filterByState: "Domicile / State",
    filterByGender: "Gender",
    filterByCategory: "Category / Quota",
    filterByAward: "Award Type",
    sortByDeadline: "Sort by Deadline",
    all: "All",
    closingSoon: "Closing Soon (< 15 Days)",
    applyNow: "Apply Now (In-Portal)",
    viewDetails: "View Criteria Breakdown",
    officialNotice: "Original Official Notice",
    verifiedSource: "Verified Provider",
    eligibilityBreakdown: "Transparent Rule Breakdown",
    requiredDocuments: "Required Verification Documents",
    whyEligible: "You meet all recorded criteria for this scholarship.",
    whyNotEligible: "You do not satisfy one or more strict criteria.",
    whyPossible: "You are close to meeting the criteria or certain profile details are pending.",
    saveForLaterHint: "Bookmarks persist in browser storage across page reloads.",
    noSavedYet: "No saved scholarships yet",
    noSavedDesc: "Browse the directory and click the bookmark icon on any opportunity to save it for later review.",
    submitApplication: "Submit Direct Application",
    statusSubmitted: "Submitted",
    statusReview: "Under Review",
    statusShortlisted: "Shortlisted",
    statusAwarded: "Awarded",
    statusRejected: "Not Selected",
    ruleCheckTitle: "Transparent Deterministic Rule Evaluation",
    disclaimer: "Eligibility is calculated purely from recorded official rules. This portal does not guarantee final institutional selection.",
    logout: "Logout",
    login: "Sign In",
    register: "Create Account",
    instructionsGuide: "Hackathon & User Guide",
  },
  hi: {
    appName: "स्कॉलरब्रिज इंडिया",
    tagline: "पारदर्शी, नियम-आधारित छात्रवृत्ति खोज एवं आवेदन प्रणाली",
    dashboardTitle: "छात्रवृत्ति निर्देशिका एवं मैचिंग",
    eligible: "पात्र",
    notEligible: "पात्र नहीं",
    possiblyEligible: "संभवतः पात्र",
    saveForLater: "बाद के लिए सहेजें",
    saved: "सहेजा गया",
    savedScholarships: "सहेजी गई छात्रवृत्तियां",
    allScholarships: "सभी अवसर",
    onlyEligible: "केवल मेरे पात्र",
    discoveryMatcher: "खोज एवं मैचिंग",
    myProfile: "छात्र प्रोफ़ाइल",
    applicationTracker: "आवेदन ट्रैकर (ATS)",
    documentLocker: "दस्तावेज़ लॉकर",
    sopLorManager: "एसओपी एवं अनुशंसा ट्रैकर",
    resourceCenter: "संसाधन एवं मार्गदर्शन",
    helpdeskFaq: "प्रश्नोत्तरी एवं सहायता",
    adminPortal: "व्यवस्थापक डैशबोर्ड",
    searchPlaceholder: "योजना, प्रदाता, विषय या कीवर्ड द्वारा खोजें...",
    filterByLevel: "शैक्षणिक स्तर",
    filterByStream: "अध्ययन क्षेत्र",
    filterByState: "मूल निवास राज्य",
    filterByGender: "लिंग",
    filterByCategory: "श्रेणी / आरक्षण",
    filterByAward: "पुरस्कार प्रकार",
    sortByDeadline: "समय सीमा के अनुसार",
    all: "सभी",
    closingSoon: "शीघ्र समाप्त (15 दिनों से कम)",
    applyNow: "पोर्टल में आवेदन करें",
    viewDetails: "नियम विवरण देखें",
    officialNotice: "मूल आधिकारिक अधिसूचना",
    verifiedSource: "सत्यापित प्रदाता",
    eligibilityBreakdown: "पारदर्शी नियम विश्लेषण",
    requiredDocuments: "आवश्यक सत्यापन दस्तावेज़",
    whyEligible: "आप इस छात्रवृत्ति के सभी दर्ज नियमों को पूरा करते हैं।",
    whyNotEligible: "आप एक या अधिक अनिवार्य नियमों को पूरा नहीं करते।",
    whyPossible: "आप पात्रता के बहुत करीब हैं अथवा कुछ प्रोफ़ाइल विवरण लंबित हैं।",
    saveForLaterHint: "पेज रीलोड करने पर भी बुकमार्क सुरक्षित रहते हैं।",
    noSavedYet: "अभी तक कोई छात्रवृत्ति सहेजी नहीं गई",
    noSavedDesc: "निर्देशिका देखें और बाद में देखने के लिए बुकमार्क आइकन पर क्लिक करें।",
    submitApplication: "सीधा आवेदन जमा करें",
    statusSubmitted: "जमा किया गया",
    statusReview: "समीक्षाधीन",
    statusShortlisted: "शॉर्टलिस्ट",
    statusAwarded: "पुरस्कृत",
    statusRejected: "अस्वीकृत",
    ruleCheckTitle: "पारदर्शी नियम आधारित मूल्यांकन",
    disclaimer: "पात्रता विशुद्ध रूप से आधिकारिक नियमों पर आंकी जाती है। पोर्टल अंतिम संस्थागत चयन की गारंटी नहीं देता।",
    logout: "लॉग आउट",
    login: "लॉग इन",
    register: "खाता बनाएं",
    instructionsGuide: "मार्गदर्शिका एवं निर्देश",
  },
  as: {
    appName: "স্কলাৰব্ৰিজ ইণ্ডিয়া",
    tagline: "স্বচ্ছ, নিয়ম-ভিত্তিক বৃত্তি সন্ধান আৰু আবেদন ব্যৱস্থা",
    dashboardTitle: "বৃত্তি নিৰ্দেশিকা আৰু যোগ্যতা নিৰ্ণয়",
    eligible: "যোগ্য",
    notEligible: "যোগ্য নহয়",
    possiblyEligible: "সম্ভৱতঃ যোগ্য",
    saveForLater: "পাছলৈ সাঁচি থওক",
    saved: "সাঁচি ৰখা হৈছে",
    savedScholarships: "সাঁচি ৰখা বৃত্তিসমূহ",
    allScholarships: "সকলো সুযোগ",
    onlyEligible: "কেৱল মোৰ যোগ্য",
    discoveryMatcher: "সন্ধান আৰু নিৰ্ণয়",
    myProfile: "ছাত্ৰ-ছাত্ৰীৰ প্ৰফাইল",
    applicationTracker: "আবেদন ট্ৰেকাৰ (ATS)",
    documentLocker: "নথিপত্ৰ লকাৰ",
    sopLorManager: "বিৱৰণী আৰু অনুমোদন পত্ৰ",
    resourceCenter: "সম্পদ আৰু সহায়",
    helpdeskFaq: "প্ৰশ্নোত্তৰ আৰু সহায় কেন্দ্ৰ",
    adminPortal: "প্ৰশাসক ডেশ্ববৰ্ড",
    searchPlaceholder: "আঁচনিৰ নাম, সংস্থা, শাখা বা শব্দৰে সন্ধান কৰক...",
    filterByLevel: "শৈক্ষিক স্তৰ",
    filterByStream: "অধ্যয়নৰ শাখা",
    filterByState: "স্থায়ী বাসস্থানৰ ৰাজ্য",
    filterByGender: "লিংগ",
    filterByCategory: "শ্ৰেণী / সংৰক্ষণ",
    filterByAward: "বৃত্তিৰ ধৰণ",
    sortByDeadline: "সময়সীমা অনুসৰি সজাওক",
    all: "সকলো",
    closingSoon: "শীঘ্ৰে শেষ হ'ব (< ১৫ দিন)",
    applyNow: "পোনে পোনে আবেদন কৰক",
    viewDetails: "নিয়মৰ বিৱৰণ চাওক",
    officialNotice: "মূল অফিচিয়েল জাননী",
    verifiedSource: "সত্যায়িত সংস্থা",
    eligibilityBreakdown: "স্বচ্ছ নিয়ম বিশ্লেষণ",
    requiredDocuments: "প্ৰয়োজনীয় সত্যাপন নথিপত্ৰ",
    whyEligible: "আপুনি এই বৃত্তিৰ সকলো নিৰ্ধাৰিত নিয়ম পূৰণ কৰিছে।",
    whyNotEligible: "আপুনি এক বা ততোধিক বাধ্যতামূলক চৰ্ত পূৰণ কৰা নাই।",
    whyPossible: "আপুনি চৰ্তসমূহ পূৰণৰ কাষত আছে বা কিছু প্ৰফাইল তথ্য বাকী আছে।",
    saveForLaterHint: "পৃষ্ঠা পুনৰ লোড কৰিলেও সংৰক্ষিত বৃত্তি থাকি যাব।",
    noSavedYet: "এতিয়ালৈকে কোনো বৃত্তি সাঁচি ৰখা হোৱা নাই",
    noSavedDesc: "নিৰ্দেশিকা চাওক আৰু পাছত চাবলৈ বুকমাৰ্ক আইকনত ক্লিক কৰক।",
    submitApplication: "আবেদন পত্ৰ জমা দিয়ক",
    statusSubmitted: "জমা দিয়া হৈছে",
    statusReview: "পৰ্যালোচনা চলি আছে",
    statusShortlisted: "মনোনীত কৰা হৈছে",
    statusAwarded: "প্ৰদান কৰা হ'ল",
    statusRejected: "নিৰ্বাচিত নহ'ল",
    ruleCheckTitle: "স্বচ্ছ আৰু সঠিক নিয়মভিত্তিক যোগ্যতা পৰীক্ষা",
    disclaimer: "যোগ্যতা কেৱল লিখিত নিয়মৰ ওপৰত নিৰ্ণয় কৰা হয়। এই প'ৰ্টেলে চূড়ান্ত অনুমোদনৰ নিশ্চয়তা নিদিয়ে।",
    logout: "লগ আউট",
    login: "প্ৰৱেশ কৰক",
    register: "নতুন একাউন্ট",
    instructionsGuide: "নিৰ্দেশনা আৰু ব্যৱহাৰ বিধি",
  },
};
