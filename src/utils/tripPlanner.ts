import type { ThemeColors } from '../constants';

export const TRIP_STATUS_OPTIONS = [
  { value: 'dreaming', label: 'Dreaming' },
  { value: 'planning', label: 'Planning' },
  { value: 'booked', label: 'Booked' },
  { value: 'visited', label: 'Visited' },
] as const;

export type TripStatus = (typeof TRIP_STATUS_OPTIONS)[number]['value'];

const DEFAULT_TRIP_CHECKLIST_TEMPLATE = [
  { id: 'book-transport', label: 'Book transport' },
  { id: 'reserve-stay', label: 'Reserve stay' },
  { id: 'build-itinerary', label: 'Build itinerary' },
  { id: 'pack-essentials', label: 'Pack essentials' },
] as const;

export interface TripChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface TripPlan {
  destinationId: string;
  status: TripStatus | null;
  notes: string;
  checklist: TripChecklistItem[];
  updatedAt: string;
}

export function isTripStatus(value: unknown): value is TripStatus {
  return TRIP_STATUS_OPTIONS.some((option) => option.value === value);
}

export function createDefaultTripChecklist(): TripChecklistItem[] {
  return DEFAULT_TRIP_CHECKLIST_TEMPLATE.map((item) => ({
    ...item,
    completed: false,
  }));
}

function normalizeChecklistLabel(label: string): string {
  return label.replace(/\s+/g, ' ').trim();
}

export function createTripChecklistItem(label: string): TripChecklistItem {
  const normalizedLabel = normalizeChecklistLabel(label);

  return {
    id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    label: normalizedLabel,
    completed: false,
  };
}

export function sanitizeTripChecklist(input: unknown): TripChecklistItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const seenIds = new Set<string>();

  return input.flatMap((item, index) => {
    if (!item || typeof item !== 'object') {
      return [];
    }

    const candidate = item as Partial<TripChecklistItem>;
    const label = typeof candidate.label === 'string'
      ? normalizeChecklistLabel(candidate.label)
      : '';

    if (!label) {
      return [];
    }

    const requestedId = typeof candidate.id === 'string' && candidate.id.trim() !== ''
      ? candidate.id.trim()
      : `checklist-${index}`;
    const id = seenIds.has(requestedId) ? `${requestedId}-${index}` : requestedId;
    seenIds.add(id);

    return [{
      id,
      label,
      completed: Boolean(candidate.completed),
    }];
  });
}

export function isTripPlanEmpty(plan: Pick<TripPlan, 'status' | 'notes' | 'checklist'>): boolean {
  return plan.status === null && plan.notes.trim() === '' && plan.checklist.length === 0;
}

export function getTripStatusLabel(status: TripStatus | null | undefined): string {
  return TRIP_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? 'Unplanned';
}

export function getTripStatusRank(status: TripStatus | null | undefined): number {
  switch (status) {
    case 'booked':
      return 0;
    case 'planning':
      return 1;
    case 'dreaming':
      return 2;
    case 'visited':
      return 3;
    default:
      return 4;
  }
}

export function getTripStatusColor(colors: ThemeColors, status: TripStatus | null | undefined): string {
  switch (status) {
    case 'booked':
      return colors.primary;
    case 'planning':
      return colors.warning;
    case 'dreaming':
      return colors.accent;
    case 'visited':
      return colors.success;
    default:
      return colors.textMuted;
  }
}

export function getTripStatusTextColor(
  colors: ThemeColors,
  status: TripStatus | null | undefined
): string {
  return status === 'planning' ? colors.black : colors.white;
}

export function getTripPlanDisplayLabel(plan: Pick<TripPlan, 'status' | 'notes'> | null | undefined): string {
  if (!plan) {
    return 'Unplanned';
  }

  if (plan.status) {
    return getTripStatusLabel(plan.status);
  }

  return plan.notes.trim() !== '' ? 'Notes Saved' : 'Unplanned';
}

export function getChecklistProgress(plan: Pick<TripPlan, 'checklist'> | null | undefined) {
  const total = plan?.checklist.length ?? 0;
  const completed = plan?.checklist.filter((item) => item.completed).length ?? 0;
  const remaining = Math.max(total - completed, 0);

  return {
    completed,
    total,
    remaining,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}
