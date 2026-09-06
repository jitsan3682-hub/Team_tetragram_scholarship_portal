/**
 * Deadline tracking helpers.
 * Pure functions, no side effects — safe to call on every render.
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export type DeadlineUrgency = 'closed' | 'urgent' | 'soon' | 'normal' | 'unknown';

/**
 * Returns the number of whole days remaining until `deadline` (inclusive
 * of today). Negative numbers mean the deadline has already passed.
 * Returns null if the deadline string can't be parsed.
 */
export function getDaysLeft(deadline: string | undefined | null): number | null {
  if (!deadline) return null;
  const target = new Date(`${deadline}T23:59:59`);
  if (Number.isNaN(target.getTime())) return null;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return Math.ceil((target.getTime() - startOfToday.getTime()) / MS_PER_DAY);
}

/**
 * Classifies a deadline into an urgency tier used for badge styling.
 * 'closed'  -> deadline has passed
 * 'urgent'  -> closing within 7 days
 * 'soon'    -> closing within 30 days
 * 'normal'  -> more than 30 days away
 * 'unknown' -> deadline couldn't be parsed
 */
export function getDeadlineUrgency(deadline: string | undefined | null): DeadlineUrgency {
  const daysLeft = getDaysLeft(deadline);
  if (daysLeft === null) return 'unknown';
  if (daysLeft < 0) return 'closed';
  if (daysLeft <= 7) return 'urgent';
  if (daysLeft <= 30) return 'soon';
  return 'normal';
}

/**
 * Human-readable label for the days-left badge, e.g. "Closes today",
 * "3 days left", "Closed 5 days ago".
 */
export function formatDaysLeftLabel(deadline: string | undefined | null): string {
  const daysLeft = getDaysLeft(deadline);
  if (daysLeft === null) return '';
  if (daysLeft < 0) return `Closed ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} ago`;
  if (daysLeft === 0) return 'Closes today';
  if (daysLeft === 1) return '1 day left';
  return `${daysLeft} days left`;
}
