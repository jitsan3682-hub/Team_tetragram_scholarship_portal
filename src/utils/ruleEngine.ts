import { User, Scholarship, EligibilityResult, RuleCriterionResult, FIELD_OF_STUDY_CATEGORIES } from '../types';

// Pre-computed O(1) cluster lookup indices built once at module initialization
const MAJOR_TO_CLUSTER_MAP = new Map<string, string>();
const CLUSTER_TO_OPTIONS_SET = new Map<string, Set<string>>();
const STEM_OPTIONS_SET = new Set<string>();
const STEM_KEYWORDS = ['computer science', 'information technology', 'engineering', 'mathematics', 'science', 'technology', 'stem'];

FIELD_OF_STUDY_CATEGORIES.forEach((group) => {
  const catLower = group.category.toLowerCase().trim();
  const optSet = new Set<string>();
  group.options.forEach((opt) => {
    const optLower = opt.toLowerCase().trim();
    optSet.add(optLower);
    MAJOR_TO_CLUSTER_MAP.set(optLower, catLower);
    if (group.category === 'STEM') {
      STEM_OPTIONS_SET.add(optLower);
    }
  });
  CLUSTER_TO_OPTIONS_SET.set(catLower, optSet);
});

// Helper to safely normalize inputs to lowercase trimmed string arrays
function normalizeStringArray(val: any): string[] {
  if (!val) return ['All'];
  if (Array.isArray(val)) {
    const list = val.map((s) => String(s ?? '').trim()).filter(Boolean);
    return list.length > 0 ? list : ['All'];
  }
  if (typeof val === 'string') {
    const list = val.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
    return list.length > 0 ? list : ['All'];
  }
  return ['All'];
}

// Helper to safely convert unknown values into trimmed lowercase strings
function safeLowerTrim(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val.trim().toLowerCase();
  if (typeof val === 'number') return String(val).trim().toLowerCase();
  return '';
}

// Helper to defensively parse numeric values from strings (e.g. "8.5", "₹2,50,000", "75%")
function normalizeNumber(val: any, fallback: number): number {
  if (val === null || val === undefined || val === '') return fallback;
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

/**
 * Deterministic Rule Evaluation Engine for Scholarship Eligibility Portal
 * Evaluates student profile against scholarship criteria strictly and transparently.
 * Zero hidden scoring. Returns 'Eligible', 'Possibly Eligible', or 'Not Eligible'.
 */
export function evaluateEligibility(
  student: User | null,
  scholarship: Scholarship
): EligibilityResult {
  // Defensive guard for invalid scholarship objects
  if (!scholarship || typeof scholarship !== 'object' || !scholarship.id || !scholarship.title) {
    return {
      status: 'Not Eligible',
      reasons: ['Invalid or corrupt scholarship record.'],
      missingFields: [],
      criteriaPassed: [],
      isEligible: false,
      matchScore: 0,
      unmetCriteria: ['Invalid or corrupt scholarship record.']
    };
  }

  if (!student) {
    return {
      status: 'Possibly Eligible',
      reasons: ['Log in or complete your student profile to view calculated eligibility.'],
      missingFields: ['Student Profile'],
      criteriaPassed: [
        {
          rule: 'Profile Status',
          satisfied: false,
          userValue: 'Guest User',
          requiredValue: 'Completed Profile',
          message: 'Please complete your student profile to run deterministic rule matching.'
        }
      ],
      isEligible: false,
      matchScore: 0,
      unmetCriteria: ['Missing Student Profile']
    };
  }

  try {
    const rawElig: any = scholarship.eligibility || (scholarship as any).criteria || {};
    const eligibility = {
      minGpa: normalizeNumber(rawElig.minGpa ?? rawElig.min_gpa ?? rawElig.minPercentage ?? rawElig.min_percentage, 0),
      maxIncome: normalizeNumber(rawElig.maxIncome ?? rawElig.max_income, 999999999),
      states: normalizeStringArray(rawElig.states ?? rawElig.eligible_states ?? rawElig.state),
      majors: normalizeStringArray(rawElig.majors ?? rawElig.allowed_majors ?? rawElig.major),
      categories: normalizeStringArray(rawElig.categories ?? rawElig.category),
      genders: normalizeStringArray(rawElig.genders ?? rawElig.gender),
      requiresCAPF: Boolean(rawElig.requiresCAPF),
    };
    const criteriaPassed: RuleCriterionResult[] = [];
    const reasons: string[] = [];
    const missingFields: string[] = [];

    let disqualified = false;
    let hasNearMiss = false;

    // 1. GPA / Percentage Check
    if (eligibility.minGpa > 0) {
      const studentScore = normalizeNumber(student.gpa, -1);
      if (studentScore < 0) {
        missingFields.push('GPA / Academic Score');
        criteriaPassed.push({
          rule: 'Minimum GPA Requirement',
          satisfied: false,
          userValue: 'Not Provided',
          requiredValue: eligibility.minGpa,
          message: `Min GPA/Percentage required: ${eligibility.minGpa}. Update profile with your GPA/score.`
        });
      } else {
        // Scale reconciliation: if student provides 10-scale GPA and requirement is percentage (>10), or vice versa
        let effectiveScore = studentScore;
        if (studentScore <= 10 && eligibility.minGpa > 10) {
          effectiveScore = studentScore * 9.5; // CBSE 10-point scale standard conversion
        } else if (studentScore > 10 && eligibility.minGpa <= 10) {
          effectiveScore = studentScore / 9.5;
        }

        if (effectiveScore >= eligibility.minGpa) {
          criteriaPassed.push({
            rule: 'Minimum GPA Requirement',
            satisfied: true,
            userValue: studentScore,
            requiredValue: eligibility.minGpa,
            message: `Your score (${studentScore}) satisfies the requirement (${eligibility.minGpa}).`
          });
        } else {
          const gap = Number((eligibility.minGpa - effectiveScore).toFixed(2));
          if (gap <= (eligibility.minGpa > 10 ? 3.0 : 0.3)) {
            hasNearMiss = true;
            reasons.push(`Score (${studentScore}) is close to requirement (${eligibility.minGpa}) - near-miss margin of ~${gap}.`);
          } else {
            disqualified = true;
            reasons.push(`Score (${studentScore}) is below required minimum (${eligibility.minGpa}).`);
          }
          criteriaPassed.push({
            rule: 'Minimum GPA Requirement',
            satisfied: false,
            userValue: studentScore,
            requiredValue: eligibility.minGpa,
            message: `Score ${studentScore} does not meet required ${eligibility.minGpa}.`
          });
        }
      }
    }

    // 2. Annual Family Income Cap Check
    if (eligibility.maxIncome < 90000000) {
      const studentIncome = normalizeNumber(student.familyIncome, -1);
      if (studentIncome < 0) {
        missingFields.push('Annual Family Income');
        criteriaPassed.push({
          rule: 'Family Income Cap',
          satisfied: false,
          userValue: 'Not Provided',
          requiredValue: `≤ ₹${eligibility.maxIncome.toLocaleString('en-IN')}`,
          message: `Family income cap is ₹${eligibility.maxIncome.toLocaleString('en-IN')}. Please provide income.`
        });
      } else if (studentIncome <= eligibility.maxIncome) {
        criteriaPassed.push({
          rule: 'Family Income Cap',
          satisfied: true,
          userValue: `₹${studentIncome.toLocaleString('en-IN')}`,
          requiredValue: `≤ ₹${eligibility.maxIncome.toLocaleString('en-IN')}`,
          message: `Income (₹${studentIncome.toLocaleString('en-IN')}) is within limit (₹${eligibility.maxIncome.toLocaleString('en-IN')}).`
        });
      } else {
        const excess = studentIncome - eligibility.maxIncome;
        if (excess <= 50000) {
          hasNearMiss = true;
          reasons.push(`Income is slightly above limit by ₹${excess.toLocaleString('en-IN')}. Discretionary / EWS reviews may apply.`);
        } else {
          disqualified = true;
          reasons.push(`Annual income of ₹${studentIncome.toLocaleString('en-IN')} exceeds the maximum allowed limit of ₹${eligibility.maxIncome.toLocaleString('en-IN')}.`);
        }
        criteriaPassed.push({
          rule: 'Family Income Cap',
          satisfied: false,
          userValue: `₹${studentIncome.toLocaleString('en-IN')}`,
          requiredValue: `≤ ₹${eligibility.maxIncome.toLocaleString('en-IN')}`,
          message: `Income exceeds cap of ₹${eligibility.maxIncome.toLocaleString('en-IN')}.`
        });
      }
    }

    // 3. State Domicile Check
    if (eligibility.states && eligibility.states.length > 0 && !eligibility.states.some(s => safeLowerTrim(s) === 'all')) {
      const studentStateLower = safeLowerTrim(student.state);
      if (!studentStateLower) {
        missingFields.push('State Domicile');
        criteriaPassed.push({
          rule: 'State Domicile',
          satisfied: false,
          userValue: 'Not Provided',
          requiredValue: eligibility.states.join(', '),
          message: `Restricted to students from: ${eligibility.states.join(', ')}.`
        });
      } else {
        const match = eligibility.states.some(s => {
          const sLower = safeLowerTrim(s);
          return sLower === studentStateLower || sLower === 'all';
        });
        if (match) {
          criteriaPassed.push({
            rule: 'State Domicile',
            satisfied: true,
            userValue: student.state || '',
            requiredValue: eligibility.states.join(', '),
            message: `Your state (${student.state}) matches the designated domicile list.`
          });
        } else {
          disqualified = true;
          reasons.push(`Scheme is restricted to domicile of ${eligibility.states.join(', ')}. Your registered state is ${student.state}.`);
          criteriaPassed.push({
            rule: 'State Domicile',
            satisfied: false,
            userValue: student.state || '',
            requiredValue: eligibility.states.join(', '),
            message: `Requires domicile of: ${eligibility.states.join(', ')}.`
          });
        }
      }
    }

    // 4. Major / Field of Study Check (Optimized with O(1) Cluster Lookups)
    if (eligibility.majors && eligibility.majors.length > 0 && !eligibility.majors.some(m => safeLowerTrim(m) === 'all')) {
      const studentMajorLower = safeLowerTrim(student.major);
      if (!studentMajorLower) {
        missingFields.push('Field of Study / Major');
        criteriaPassed.push({
          rule: 'Eligible Degrees & Streams',
          satisfied: false,
          userValue: 'Not Provided',
          requiredValue: eligibility.majors.join(', '),
          message: `Open to majors: ${eligibility.majors.join(', ')}.`
        });
      } else {
        // Determine student's broad cluster category in O(1)
        const studentCluster = MAJOR_TO_CLUSTER_MAP.get(studentMajorLower) || '';

        const match = eligibility.majors.some((m) => {
          const mLower = safeLowerTrim(m);
          if (mLower === 'all') return true;
          if (mLower === studentMajorLower) return true;

          // Cluster matching: e.g. Rule specifies 'STEM' and student is in 'Computer Science'
          if (studentCluster && (mLower === studentCluster || studentCluster.includes(mLower))) return true;

          // Reverse cluster matching: Rule specifies a category cluster that includes student's major (O(1) set lookup)
          const optionsSet = CLUSTER_TO_OPTIONS_SET.get(mLower);
          if (optionsSet && optionsSet.has(studentMajorLower)) return true;

          // Substring / bidirectional match
          if (mLower.includes(studentMajorLower) || studentMajorLower.includes(mLower)) return true;

          // Semantic synonym cross-checks
          if ((mLower === 'medical' || mLower === 'medicine') && (studentMajorLower === 'medical' || studentMajorLower === 'medicine')) return true;
          if ((mLower === 'commerce' || mLower === 'management') && (studentMajorLower.includes('business') || studentMajorLower.includes('economics'))) return true;
          if ((mLower === 'arts' || mLower.includes('humanities')) && (studentMajorLower.includes('history') || studentMajorLower.includes('english') || studentMajorLower.includes('journalism'))) return true;

          return false;
        });

        if (match) {
          criteriaPassed.push({
            rule: 'Eligible Degrees & Streams',
            satisfied: true,
            userValue: student.major || '',
            requiredValue: eligibility.majors.join(', '),
            message: `Your major (${student.major}) qualifies under accepted streams.`
          });
        } else {
          disqualified = true;
          reasons.push(`Degree stream (${student.major}) is not eligible. Accepted: ${eligibility.majors.join(', ')}.`);
          criteriaPassed.push({
            rule: 'Eligible Degrees & Streams',
            satisfied: false,
            userValue: student.major || '',
            requiredValue: eligibility.majors.join(', '),
            message: `Stream not matched. Required: ${eligibility.majors.join(', ')}.`
          });
        }
      }
    }

    // 5. Category / Quota Check
    if (eligibility.categories && eligibility.categories.length > 0 && !eligibility.categories.some(c => safeLowerTrim(c) === 'all')) {
      const studentCatLower = safeLowerTrim(student.category);
      if (!studentCatLower) {
        missingFields.push('Reservation Category');
        criteriaPassed.push({
          rule: 'Social / Quota Category',
          satisfied: false,
          userValue: 'Not Provided',
          requiredValue: eligibility.categories.join(', '),
          message: `Eligible categories: ${eligibility.categories.join(', ')}.`
        });
      } else {
        const match = eligibility.categories.some(c => {
          const cLower = safeLowerTrim(c);
          return cLower === 'all' || cLower === studentCatLower;
        });
        if (match) {
          criteriaPassed.push({
            rule: 'Social / Quota Category',
            satisfied: true,
            userValue: student.category || '',
            requiredValue: eligibility.categories.join(', '),
            message: `Category (${student.category}) qualifies for this scheme.`
          });
        } else {
          disqualified = true;
          reasons.push(`Category (${student.category}) does not qualify. This scheme is for: ${eligibility.categories.join(', ')}.`);
          criteriaPassed.push({
            rule: 'Social / Quota Category',
            satisfied: false,
            userValue: student.category || '',
            requiredValue: eligibility.categories.join(', '),
            message: `Only applicable to: ${eligibility.categories.join(', ')}.`
          });
        }
      }
    }

    // 6. Gender Check (e.g. Girls in STEM / Pragati, Transgender Welfare, Male/Female)
    if (eligibility.genders && eligibility.genders.length > 0 && !eligibility.genders.some(g => safeLowerTrim(g) === 'all')) {
      const studentGenderLower = safeLowerTrim(student.gender);
      if (!studentGenderLower) {
        missingFields.push('Gender');
        criteriaPassed.push({
          rule: 'Gender Specific Scheme',
          satisfied: false,
          userValue: 'Not Provided',
          requiredValue: eligibility.genders.join(', '),
          message: `Specifically reserved for: ${eligibility.genders.join(', ')}.`
        });
      } else {
        const studentMajorLower = safeLowerTrim(student.major);
        const isStemMajor =
          STEM_OPTIONS_SET.has(studentMajorLower) ||
          STEM_KEYWORDS.some((k) => studentMajorLower.includes(k));

        const match = eligibility.genders.some((g) => {
          const gLower = safeLowerTrim(g);
          if (gLower === 'all') return true;
          if (gLower === studentGenderLower) return true;

          // "Female (in STEM)" student qualifies for all "Female" scholarships
          if (studentGenderLower.includes('female') && gLower === 'female') return true;

          // "Female" student in a STEM stream qualifies for "Female (in STEM)"
          if (gLower.includes('female (in stem)') && studentGenderLower === 'female' && isStemMajor) return true;

          // Transgender matching
          if (studentGenderLower.includes('trans') && (gLower.includes('trans') || gLower === 'other')) return true;
          if ((studentGenderLower === 'other' || studentGenderLower.includes('trans')) && gLower.includes('trans')) return true;

          return false;
        });

        if (match) {
          criteriaPassed.push({
            rule: 'Gender Specific Scheme',
            satisfied: true,
            userValue: student.gender || '',
            requiredValue: eligibility.genders.join(', '),
            message: `Gender category (${student.gender}) meets scheme eligibility.`
          });
        } else {
          disqualified = true;
          reasons.push(`Scholarship is reserved for: ${eligibility.genders.join(', ')}.`);
          criteriaPassed.push({
            rule: 'Gender Specific Scheme',
            satisfied: false,
            userValue: student.gender || '',
            requiredValue: eligibility.genders.join(', '),
            message: `Reserved for ${eligibility.genders.join(', ')} only.`
          });
        }
      }
    }

    // 7. CAPF / Defence Ward Check
    if (eligibility.requiresCAPF) {
      if (!student.isCAPFWard) {
        disqualified = true;
        reasons.push('Requires applicant to be a dependent ward of CAPF or Assam Rifles personnel.');
        criteriaPassed.push({
          rule: 'CAPF / Assam Rifles Ward Status',
          satisfied: false,
          userValue: 'No',
          requiredValue: 'Yes (Dependent Child/Widow)',
          message: 'Reserved exclusively for wards of CAPF / Assam Rifles.'
        });
      } else {
        criteriaPassed.push({
          rule: 'CAPF / Assam Rifles Ward Status',
          satisfied: true,
          userValue: 'Yes',
          requiredValue: 'Yes',
          message: 'Verified dependent ward of CAPF / Assam Rifles.'
        });
      }
    }

    // Final Classification Logic
    const status: 'Eligible' | 'Possibly Eligible' | 'Not Eligible' = disqualified
      ? 'Not Eligible'
      : missingFields.length > 0 || hasNearMiss
      ? 'Possibly Eligible'
      : 'Eligible';

    if (status === 'Possibly Eligible' && missingFields.length > 0 && reasons.length === 0) {
      reasons.push(`Missing profile data to confirm eligibility: ${missingFields.join(', ')}.`);
    } else if (status === 'Eligible') {
      reasons.push('All recorded rules and threshold criteria are satisfied.');
    }

    const isEligible = status === 'Eligible';
    const totalCriteria = criteriaPassed.length;
    const passedCount = criteriaPassed.filter((c) => c.satisfied).length;
    const matchScore = totalCriteria > 0
      ? Math.round((passedCount / totalCriteria) * 100)
      : (isEligible ? 100 : 0);

    const unmetCriteria = disqualified
      ? reasons
      : missingFields.length > 0
      ? missingFields.map((f) => `Missing ${f}`)
      : [];

    return {
      status,
      reasons,
      missingFields,
      criteriaPassed,
      isEligible,
      matchScore,
      unmetCriteria
    };
  } catch (error) {
    console.warn('Defensive fallback in rule engine evaluation for scholarship:', scholarship?.id, error);
    return {
      status: 'Possibly Eligible',
      reasons: ['Requirements pending verification. Check provider portal for details.'],
      missingFields: [],
      criteriaPassed: [],
      isEligible: false,
      matchScore: 50,
      unmetCriteria: ['Requirements pending verification']
    };
  }
}
