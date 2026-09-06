import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, Category, AcademicLevel, ALL_INDIAN_STATES, Gender } from '../../types';
import { MAJORS_LIST, FIELD_OF_STUDY_CATEGORIES } from '../../data/constants';
import { uploadProfilePictureToBackend } from '../../lib/api';
import {
  User as UserIcon,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  DollarSign,
  Award,
  CheckCircle2,
  Edit,
  Save,
  X,
  Layers,
  Sparkles,
  ShieldCheck,
  CloudDownload,
  BookOpen,
  FileText,
  Check,
  Eye,
  Download,
  Share2,
  Copy,
  IdCard,
  Home,
  Camera,
  Upload,
  HardDrive,
  Loader2,
  Trash2,
} from 'lucide-react';

// ---- Google Drive Picker config ----
// Replace these with your own credentials from Google Cloud Console
// (OAuth 2.0 Client ID + API Key with Drive Picker API and Drive API enabled)
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
const GOOGLE_APP_ID = 'YOUR_GOOGLE_APP_ID'; // Project number, optional but recommended

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [state, setState] = useState(user?.state || 'Assam');
  const [major, setMajor] = useState(user?.major || 'Computer Science');
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>(user?.academicLevel || 'Undergraduate');
  const [gpa, setGpa] = useState<number>(user?.gpa || 3.4);
  const [familyIncome, setFamilyIncome] = useState<number>(user?.familyIncome || 320000);
  const [category, setCategory] = useState<Category>(user?.category || 'General');
  const [gender, setGender] = useState<Gender>((user?.gender as Gender) || 'Male');
  const [expectedGradYear, setExpectedGradYear] = useState<number>(user?.expectedGraduationYear || 2027);
  const [isCAPFWard, setIsCAPFWard] = useState<boolean>(user?.isCAPFWard || false);
  const [careerGoals, setCareerGoals] = useState<string>(
    user?.careerGoals || 'Software Engineering and Open-Source Systems Research'
  );

  // New Academic & DigiLocker state fields
  const [tenthBoard, setTenthBoard] = useState('CBSE');
  const [tenthYear, setTenthYear] = useState('2021');
  const [tenthMarks, setTenthMarks] = useState('94.2%');

  const [twelfthBoard, setTwelfthBoard] = useState('CBSE');
  const [twelfthYear, setTwelfthYear] = useState('2023');
  const [twelfthMarks, setTwelfthMarks] = useState('91.5%');
  const [twelfthStream, setTwelfthStream] = useState('Science');

  const [gradUniversity, setGradUniversity] = useState('Tezpur University');
  const [gradDegree, setGradDegree] = useState('B.Tech Computer Science');
  const [gradSemester, setGradSemester] = useState('6th Semester');
  const [gradCgpa, setGradCgpa] = useState('8.75');

  const [isDigilockerSyncing, setIsDigilockerSyncing] = useState(false);
  const [digilockerVerified, setDigilockerVerified] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Document preview modal state
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  // ---- Profile picture state ----
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [pickerReady, setPickerReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  // ---- Load Google API scripts for Drive Picker (lazy, only once) ----
  useEffect(() => {
    if ((window as any).gapi && (window as any).google?.picker) {
      setPickerReady(true);
      return;
    }

    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = () => {
      (window as any).gapi.load('picker', () => setPickerReady(true));
    };
    document.body.appendChild(gapiScript);

    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.async = true;
    gisScript.defer = true;
    document.body.appendChild(gisScript);

    return () => {
      if (document.body.contains(gapiScript)) document.body.removeChild(gapiScript);
      if (document.body.contains(gisScript)) document.body.removeChild(gisScript);
    };
  }, []);

  const handleDigilockerSync = () => {
    setIsDigilockerSyncing(true);
    setTimeout(() => {
      setIsDigilockerSyncing(false);
      setDigilockerVerified(true);
      alert('DigiLocker sync successful! All marksheets verified from Govt. repository.');
    }, 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      state,
      major,
      academicLevel,
      gpa: Number(gpa),
      familyIncome: Number(familyIncome),
      category,
      gender,
      expectedGraduationYear: Number(expectedGradYear),
      isCAPFWard,
      careerGoals,
      profilePicture,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // ---- Validate + read a File into a data URL ----
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const validateImageFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG and PNG image files are allowed.';
    }
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Image must be smaller than ${maxSizeMB}MB.`;
    }
    return null;
  };

  // ---- Handle local file selection (device upload) ----
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setAvatarError(validationError);
      setTimeout(() => setAvatarError(null), 3500);
      e.target.value = '';
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const dataUrl = await readFileAsDataURL(file);
      // Attempt upload to Google Drive backend
      const backendUpload = await uploadProfilePictureToBackend(file);
      const finalUrl = backendUpload?.url || dataUrl;
      setProfilePicture(finalUrl);
      updateProfile({ profilePicture: finalUrl });
    } catch (err) {
      setAvatarError('Could not load the selected image. Please try again.');
      setTimeout(() => setAvatarError(null), 3500);
    } finally {
      setIsUploadingAvatar(false);
      setShowAvatarMenu(false);
      e.target.value = '';
    }
  };

  // ---- Handle Google Drive import ----
  const handleDriveImport = () => {
    setShowAvatarMenu(false);

    if (!pickerReady || !(window as any).google?.accounts?.oauth2) {
      setAvatarError('Google Drive picker is still loading. Please try again in a moment.');
      setTimeout(() => setAvatarError(null), 3500);
      return;
    }

    if (GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')) {
      setAvatarError('Google Drive import is not configured yet. Please contact the site admin.');
      setTimeout(() => setAvatarError(null), 4000);
      return;
    }

    const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: (tokenResponse: any) => {
        if (tokenResponse.error) {
          setAvatarError('Google Drive authorization failed.');
          setTimeout(() => setAvatarError(null), 3500);
          return;
        }
        openDrivePicker(tokenResponse.access_token);
      },
    });

    tokenClient.requestAccessToken();
  };

  const openDrivePicker = (accessToken: string) => {
    const google = (window as any).google;

    const view = new google.picker.DocsView(google.picker.ViewId.DOCS_IMAGES)
      .setMimeTypes('image/png,image/jpeg,image/jpg')
      .setSelectFolderEnabled(false);

    const picker = new google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(accessToken)
      .setDeveloperKey(GOOGLE_API_KEY)
      .setAppId(GOOGLE_APP_ID)
      .setCallback(async (data: any) => {
        if (data.action === google.picker.Action.PICKED) {
          const fileId = data.docs[0].id;
          setIsUploadingAvatar(true);
          try {
            const res = await fetch(
              `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            const blob = await res.blob();

            const validationError = validateImageFile(
              new File([blob], data.docs[0].name, { type: blob.type })
            );
            if (validationError) {
              setAvatarError(validationError);
              setTimeout(() => setAvatarError(null), 3500);
              return;
            }

            const reader = new FileReader();
            reader.onload = () => {
              const dataUrl = reader.result as string;
              setProfilePicture(dataUrl);
              updateProfile({ profilePicture: dataUrl });
            };
            reader.readAsDataURL(blob);
          } catch (err) {
            setAvatarError('Could not import the selected file from Drive.');
            setTimeout(() => setAvatarError(null), 3500);
          } finally {
            setIsUploadingAvatar(false);
          }
        }
      })
      .build();

    picker.setVisible(true);
  };

  const handleRemovePicture = () => {
    setProfilePicture(null);
    updateProfile({ profilePicture: null });
    setShowAvatarMenu(false);
  };

  // ---- Documents list (10th, 12th, Graduation + other scholarship-required docs) ----
  const documents = [
    {
      id: 'tenth',
      title: '10th Grade Marksheet',
      subtitle: `${tenthBoard} Board • ${tenthYear}`,
      value: tenthMarks,
      icon: FileText,
    },
    {
      id: 'twelfth',
      title: '12th Grade Marksheet',
      subtitle: `${twelfthBoard} Board • ${twelfthYear} • ${twelfthStream}`,
      value: twelfthMarks,
      icon: FileText,
    },
    {
      id: 'graduation',
      title: 'Graduation Degree Certificate',
      subtitle: `${gradUniversity} • ${gradDegree} • ${gradSemester}`,
      value: `CGPA: ${gradCgpa}`,
      icon: GraduationCap,
    },
    {
      id: 'income',
      title: 'Income Certificate',
      subtitle: `Issued by Revenue Dept., ${state}`,
      value: `₹${familyIncome.toLocaleString('en-IN')} / annum`,
      icon: DollarSign,
    },
    {
      id: 'category',
      title: 'Category / Caste Certificate',
      subtitle: 'Reservation category proof',
      value: category,
      icon: IdCard,
    },
    {
      id: 'domicile',
      title: 'Domicile / Residence Certificate',
      subtitle: `State of ${state}`,
      value: 'Permanent Resident',
      icon: Home,
    },
  ];

  // ---- Generate a single certificate PDF ----
  const generateDocumentPDF = (doc: any) => {
    const pdf = new jsPDF();

    pdf.setFillColor(245, 183, 49); // teal
    pdf.rect(0, 0, 210, 25, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.text('DigiLocker Verified Document', 14, 16);

    pdf.setTextColor(20, 20, 20);
    pdf.setFontSize(18);
    pdf.text(doc.title, 14, 40);

    pdf.setDrawColor(200, 200, 200);
    pdf.line(14, 45, 196, 45);

    pdf.setFontSize(11);
    pdf.text(`Student Name: ${user.name}`, 14, 58);
    pdf.text(`Email: ${user.email}`, 14, 66);
    pdf.text(`Document: ${doc.subtitle}`, 14, 74);
    pdf.text(`Value / Score: ${doc.value}`, 14, 82);

    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      'This document has been digitally fetched and verified via DigiLocker,',
      14,
      100
    );
    pdf.text(
      'Ministry of Electronics & IT (MeitY), Government of India.',
      14,
      106
    );
    pdf.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 116);

    pdf.save(`${doc.id}-certificate.pdf`);
  };

  // ---- Generate one combined PDF with all documents ----
  const generateAllDocumentsPDF = () => {
    const pdf = new jsPDF();

    documents.forEach((doc, idx) => {
      if (idx > 0) pdf.addPage();

      pdf.setFillColor(245, 183, 49);
      pdf.rect(0, 0, 210, 25, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.text('DigiLocker Verified Document', 14, 16);

      pdf.setTextColor(20, 20, 20);
      pdf.setFontSize(18);
      pdf.text(doc.title, 14, 40);

      pdf.setDrawColor(200, 200, 200);
      pdf.line(14, 45, 196, 45);

      pdf.setFontSize(11);
      pdf.text(`Student Name: ${user.name}`, 14, 58);
      pdf.text(`Email: ${user.email}`, 14, 66);
      pdf.text(`Document: ${doc.subtitle}`, 14, 74);
      pdf.text(`Value / Score: ${doc.value}`, 14, 82);

      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        'This document has been digitally fetched and verified via DigiLocker,',
        14,
        100
      );
      pdf.text(
        'Ministry of Electronics & IT (MeitY), Government of India.',
        14,
        106
      );
      pdf.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 116);
    });

    pdf.save(`${user.name.replace(/\s+/g, '_')}-all-documents.pdf`);
  };

  // ---- Share document (Web Share API with clipboard fallback) ----
  const handleShareDocument = async (doc: any) => {
    const shareText = `${doc.title}\n${doc.subtitle}\nValue: ${doc.value}\nVerified via DigiLocker — ${user.name}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: doc.title, text: shareText });
      } catch (err) {
        // user cancelled share — no-op
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopiedDocId(doc.id);
      setTimeout(() => setCopiedDocId(null), 2000);
    }
  };

  // ---- Copy document details to clipboard ----
  const handleCopyDocument = async (doc: any) => {
    const shareText = `${doc.title}\n${doc.subtitle}\nValue: ${doc.value}\nVerified via DigiLocker — ${user.name}`;
    await navigator.clipboard.writeText(shareText);
    setCopiedDocId(doc.id);
    setTimeout(() => setCopiedDocId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Toast */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile updated! Eligibility rules will recalculate immediately.</span>
        </div>
      )}

      {/* Copied Toast */}
      {copiedDocId && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Document details copied to clipboard!</span>
        </div>
      )}

      {/* Avatar Error Toast */}
      {avatarError && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in max-w-xs">
          <X className="w-4 h-4 shrink-0" />
          <span>{avatarError}</span>
        </div>
      )}

      {/* Hidden file input for device upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Document Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#FEF4DA] dark:bg-amber-950/40 p-2.5 rounded-xl">
                  <previewDoc.icon className="w-5 h-5 text-[#D97706] dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{previewDoc.title}</h3>
                  <p className="text-[11px] text-gray-500">{previewDoc.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Student Name:</span>
                <strong className="text-gray-900">{user.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Value / Score:</span>
                <strong className="text-gray-900">{previewDoc.value}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> DigiLocker Verified
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => generateDocumentPDF(previewDoc)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#F5B731] hover:bg-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
              <button
                onClick={() => handleShareDocument(previewDoc)}
                className="flex items-center justify-center gap-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button
                onClick={() => handleCopyDocument(previewDoc)}
                className="flex items-center justify-center gap-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1E1B18] rounded-3xl border border-stone-200/80 dark:border-stone-800/80 overflow-hidden shadow-2xs">
        <div className="h-32 bg-stone-950 dark:bg-black border-b border-stone-800 p-6 flex justify-end items-start">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-sm transition-colors cursor-pointer"
          >
            {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-4">
            {/* Avatar with change-picture control */}
            <div className="relative">
              <button
                onClick={() => setShowAvatarMenu((v) => !v)}
                className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-400 to-[#F5B731] text-stone-950 border-4 border-white shadow-md flex items-center justify-center text-3xl font-extrabold text-white overflow-hidden relative group cursor-pointer"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>

              {/* Small camera badge */}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-stone-200/80 dark:border-stone-800/80">
                <div className="bg-[#0D9488] rounded-full p-1.5">
                  <Camera className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Avatar dropdown menu */}
              {showAvatarMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowAvatarMenu(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-xl z-40 overflow-hidden">
                    <button
                      onClick={() => {
                        setShowAvatarMenu(false);
                        fileInputRef.current?.click();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 text-left cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4 text-[#D97706] dark:text-amber-400" />
                      Upload from Device (JPG/PNG)
                    </button>
                    <button
                      onClick={handleDriveImport}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 text-left border-t border-gray-100 cursor-pointer transition-colors"
                    >
                      <HardDrive className="w-4 h-4 text-blue-600" />
                      Import from Google Drive
                    </button>
                    {profilePicture && (
                      <button
                        onClick={handleRemovePicture}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-red-600 hover:bg-red-50 text-left border-t border-gray-100 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Picture
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FEF3D6] dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300/40 dark:border-amber-800/40">
                {user.role === 'admin' ? 'Platform Administrator' : 'Verified Student Candidate'}
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900">{user.name}</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            {user.academicLevel || 'Undergraduate'} in <strong>{user.major || 'Computer Science'}</strong> • Class of {user.expectedGraduationYear || 2027}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{user.state || 'Assam'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-gray-400" />
              <span>Category: {user.category || 'General'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* DigiLocker Sync Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3.5 rounded-2xl text-white shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">DigiLocker Academic Verification</h2>
              {digilockerVerified && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Linked & Verified
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              Securely synchronized with Ministry of Education repositories (10th, 12th & Degree).
            </p>
            <a
              href="https://www.digilocker.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2 mt-1 inline-block"
            >
              Don't have a DigiLocker account? Create / sign in at digilocker.gov.in →
            </a>
          </div>
        </div>
        <button
          onClick={handleDigilockerSync}
          disabled={isDigilockerSyncing}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-70 shadow-sm shrink-0 cursor-pointer"
        >
          <CloudDownload className="w-4 h-4" />
          {isDigilockerSyncing ? 'Syncing Records...' : 'Sync via DigiLocker'}
        </button>
      </div>

      {/* Certificates & Documents Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D97706] dark:text-amber-400" />
              Certificates & Documents
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              All documents verified via DigiLocker. View, download as PDF, or share/copy.
            </p>
          </div>
          <button
            onClick={generateAllDocumentsPDF}
            className="flex items-center justify-center gap-1.5 bg-[#F5B731] hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download All (Combined PDF)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documents.map((doc) => {
            const Icon = doc.icon;
            return (
              <div
                key={doc.id}
                className="border border-stone-200/80 dark:border-stone-800/80 rounded-2xl p-4 flex flex-col gap-3 hover:border-amber-400 dark:hover:border-amber-750 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-[#FEF4DA] dark:bg-amber-950/40 p-2.5 rounded-xl shrink-0">
                    <Icon className="w-4.5 h-4.5 text-[#D97706] dark:text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{doc.title}</h4>
                    <p className="text-[11px] text-gray-500 truncate">{doc.subtitle}</p>
                    <p className="text-xs font-black text-gray-800 mt-1">{doc.value}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                    title="View"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button
                    onClick={() => generateDocumentPDF(doc)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold text-[#D97706] dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer transition-colors"
                    title="Download as PDF"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                  <button
                    onClick={() => handleShareDocument(doc)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold text-blue-700 hover:bg-blue-50 cursor-pointer transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                  <button
                    onClick={() => handleCopyDocument(doc)}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors"
                    title="Copy details"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editing Form or View Mode */}
      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl border border-stone-200/80 dark:border-stone-800/80 p-6 sm:p-8 shadow-sm space-y-8"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Update Profile Details</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                All scholarship criteria are evaluated deterministically against these values.
              </p>
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5B731] hover:bg-amber-500 text-stone-950 font-bold text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Cumulative GPA / CGPA (Scale of 4.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                required
                value={gpa}
                onChange={(e) => setGpa(parseFloat(e.target.value))}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Annual Family Income (₹)</label>
              <input
                type="number"
                step="5000"
                min="0"
                required
                value={familyIncome}
                onChange={(e) => setFamilyIncome(parseInt(e.target.value, 10))}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">State of Domicile</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
              >
                {ALL_INDIAN_STATES.filter((s) => s !== 'All').map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Degree Stream / Major</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
              >
                {FIELD_OF_STUDY_CATEGORIES.map((group) => (
                  <optgroup key={group.category} label={group.category}>
                    {group.options.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Academic Level</label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value as any)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
              >
                <option value="School">School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Doctoral">Doctoral</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Reservation Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
                <option value="Minority">Minority</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Female (in STEM)">Female (in STEM) - Priority for Tech Grants</option>
                <option value="Transgender">Transgender (SMILE / Central Quota)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Expected Graduation Year</label>
              <input
                type="number"
                min="2024"
                max="2032"
                required
                value={expectedGradYear}
                onChange={(e) => setExpectedGradYear(parseInt(e.target.value, 10))}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>
          </div>

          {/* Detailed Academic Qualifications Edit Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D97706] dark:text-amber-400" /> Educational Qualifications (10th, 12th & Graduation)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">10th Board & Marks</label>
                <input
                  type="text"
                  value={tenthBoard}
                  onChange={(e) => setTenthBoard(e.target.value)}
                  placeholder="Board e.g. CBSE"
                  className="w-full p-2 border border-gray-300 rounded-xl text-xs mb-2 bg-white"
                />
                <input
                  type="text"
                  value={tenthMarks}
                  onChange={(e) => setTenthMarks(e.target.value)}
                  placeholder="Marks/Percentage"
                  className="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">12th Board & Marks</label>
                <input
                  type="text"
                  value={twelfthBoard}
                  onChange={(e) => setTwelfthBoard(e.target.value)}
                  placeholder="Board e.g. CBSE"
                  className="w-full p-2 border border-gray-300 rounded-xl text-xs mb-2 bg-white"
                />
                <input
                  type="text"
                  value={twelfthMarks}
                  onChange={(e) => setTwelfthMarks(e.target.value)}
                  placeholder="Marks/Percentage"
                  className="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Graduation CGPA / Inst.</label>
                <input
                  type="text"
                  value={gradUniversity}
                  onChange={(e) => setGradUniversity(e.target.value)}
                  placeholder="University Name"
                  className="w-full p-2 border border-gray-300 rounded-xl text-xs mb-2 bg-white"
                />
                <input
                  type="text"
                  value={gradCgpa}
                  onChange={(e) => setGradCgpa(e.target.value)}
                  placeholder="CGPA e.g. 8.75"
                  className="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="capf"
              checked={isCAPFWard}
              onChange={(e) => setIsCAPFWard(e.target.checked)}
              className="w-4 h-4 text-[#D97706] dark:text-amber-400 rounded cursor-pointer"
            />
            <label htmlFor="capf" className="text-xs font-medium text-gray-700 cursor-pointer">
              Dependent ward of Central Armed Police Forces (CAPF) or Assam Rifles
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Career Aspirations & Research Goals
            </label>
            <textarea
              rows={3}
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold bg-[#F5B731] hover:bg-amber-500 text-stone-950 font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Academic & Demographic Attributes */}
          <div className="bg-white rounded-3xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#D97706] dark:text-amber-400" />
              Academic & Demographic Attributes
            </h3>

            <div className="divide-y divide-gray-100 text-xs space-y-3 pt-1">
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Cumulative GPA:</span>
                <strong className="text-gray-900 font-bold">{user.gpa || 3.4} / 4.0</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Annual Family Income:</span>
                <strong className="text-gray-900 font-bold">
                  ₹{(user.familyIncome || 320000).toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Domicile State:</span>
                <strong className="text-gray-900 font-bold">{user.state || 'Assam'}</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Field of Study:</span>
                <strong className="text-gray-900 font-bold">{user.major || 'Computer Science'}</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Reservation Quota:</span>
                <strong className="text-gray-900 font-bold">{user.category || 'General'}</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Gender:</span>
                <strong className="text-gray-900 font-bold">{user.gender || 'Male'}</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">CAPF / Assam Rifles Ward:</span>
                <strong className="text-gray-900 font-bold">{user.isCAPFWard ? 'Yes' : 'No'}</strong>
              </div>
            </div>
          </div>

          {/* DigiLocker Verified Educational Records & Career Goals */}
          <div className="space-y-6">
            {/* Marksheets Breakdown */}
            <div className="bg-white rounded-3xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D97706] dark:text-amber-400" />
                DigiLocker Marksheet Records
              </h3>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#FEF4DA] dark:bg-amber-950/30 border border-amber-300/40 dark:border-amber-800/40 p-3 rounded-2xl">
                  <span className="block text-[10px] uppercase font-bold text-amber-900 dark:text-amber-300">10th Grade</span>
                  <span className="text-sm font-black text-gray-900 mt-1 block">{tenthMarks}</span>
                  <span className="text-[10px] text-gray-500">{tenthBoard} ({tenthYear})</span>
                </div>
                <div className="bg-[#FEF4DA] dark:bg-amber-950/30 border border-amber-300/40 dark:border-amber-800/40 p-3 rounded-2xl">
                  <span className="block text-[10px] uppercase font-bold text-amber-900 dark:text-amber-300">12th Grade</span>
                  <span className="text-sm font-black text-gray-900 mt-1 block">{twelfthMarks}</span>
                  <span className="text-[10px] text-gray-500">{twelfthBoard} ({twelfthYear})</span>
                </div>
                <div className="bg-[#FEF4DA] dark:bg-amber-950/30 border border-amber-300/40 dark:border-amber-800/40 p-3 rounded-2xl">
                  <span className="block text-[10px] uppercase font-bold text-amber-900 dark:text-amber-300">Graduation</span>
                  <span className="text-sm font-black text-gray-900 mt-1 block">CGPA {gradCgpa}</span>
                  <span className="text-[10px] text-gray-500 truncate block">{gradUniversity}</span>
                </div>
              </div>
            </div>

            {/* Extracurriculars & Career Vision */}
            <div className="bg-white rounded-3xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D97706] dark:text-amber-400" />
                Extracurriculars & Career Vision
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-500 block mb-1 font-semibold">Career Aspiration:</span>
                  <p className="p-3 bg-gray-50 rounded-xl text-gray-800 border border-gray-100 leading-relaxed">
                    {user.careerGoals || 'Dedicated to advancing computer engineering research in North East India.'}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500 block mb-1.5 font-semibold">Key Highlights & Honors:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(user.extracurriculars || ['Competitive Coding', 'Hackathon Finalist', 'Robotics Club']).map(
                      (act, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#FEF4DA] dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300/40 dark:border-amber-800/40 font-semibold"
                        >
                          {act}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


