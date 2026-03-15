import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDefaultTripChecklist,
  createTripChecklistItem,
  getChecklistProgress,
  isTripPlanEmpty,
  sanitizeTripChecklist,
  type TripPlan,
  type TripStatus,
  isTripStatus,
} from '../utils/tripPlanner';

const TRIP_PLANS_KEY = '@lumaswipe_trip_plans';

type TripPlansById = Record<string, TripPlan>;

interface TripPlannerContextValue {
  plans: TripPlansById;
  activePlans: TripPlan[];
  loading: boolean;
  tripStats: {
    total: number;
    dreaming: number;
    planning: number;
    booked: number;
    visited: number;
    checklistTotal: number;
    checklistCompleted: number;
  };
  getTripPlan: (destinationId: string) => TripPlan | undefined;
  setTripStatus: (destinationId: string, status: TripStatus | null) => void;
  saveTripNotes: (destinationId: string, notes: string) => void;
  toggleChecklistItem: (destinationId: string, itemId: string) => void;
  addChecklistItem: (destinationId: string, label: string) => void;
  removeChecklistItem: (destinationId: string, itemId: string) => void;
  clearTripPlan: (destinationId: string) => void;
}

const TripPlannerContext = createContext<TripPlannerContextValue | undefined>(undefined);

function sanitizeTripPlans(input: unknown): TripPlansById {
  if (!input || typeof input !== 'object') {
    return {};
  }

  const entries = Object.entries(input as Record<string, unknown>).flatMap(([destinationId, value]) => {
    if (!value || typeof value !== 'object') {
      return [];
    }

    const candidate = value as Partial<TripPlan>;
    const status = candidate.status ?? null;
    const notes = typeof candidate.notes === 'string' ? candidate.notes : '';
    const checklist = candidate.checklist === undefined
      ? createDefaultTripChecklist()
      : sanitizeTripChecklist(candidate.checklist);
    const updatedAt = typeof candidate.updatedAt === 'string'
      ? candidate.updatedAt
      : new Date().toISOString();

    if (status !== null && !isTripStatus(status)) {
      return [];
    }

    if (isTripPlanEmpty({ status, notes, checklist })) {
      return [];
    }

    return [[
      destinationId,
      {
        destinationId,
        status,
        notes,
        checklist,
        updatedAt,
      } satisfies TripPlan,
    ]];
  });

  return Object.fromEntries(entries);
}

function upsertTripPlan(
  currentPlans: TripPlansById,
  destinationId: string,
  updater: (existingPlan?: TripPlan) => TripPlan | null
): TripPlansById {
  const nextPlan = updater(currentPlans[destinationId]);

  if (!nextPlan || isTripPlanEmpty(nextPlan)) {
    const { [destinationId]: _removed, ...remainingPlans } = currentPlans;
    return remainingPlans;
  }

  return {
    ...currentPlans,
    [destinationId]: nextPlan,
  };
}

function createBaseTripPlan(destinationId: string, existingPlan?: TripPlan): TripPlan {
  return existingPlan ?? {
    destinationId,
    status: null,
    notes: '',
    checklist: createDefaultTripChecklist(),
    updatedAt: new Date().toISOString(),
  };
}

export function TripPlannerProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<TripPlansById>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTripPlans = async () => {
      try {
        const stored = await AsyncStorage.getItem(TRIP_PLANS_KEY);
        if (!stored) {
          return;
        }

        setPlans(sanitizeTripPlans(JSON.parse(stored)));
      } catch (error) {
        console.warn('Failed to load trip plans:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadTripPlans();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const saveTripPlans = async () => {
      try {
        await AsyncStorage.setItem(TRIP_PLANS_KEY, JSON.stringify(plans));
      } catch (error) {
        console.warn('Failed to save trip plans:', error);
      }
    };

    void saveTripPlans();
  }, [loading, plans]);

  const getTripPlan = useCallback(
    (destinationId: string) => plans[destinationId],
    [plans]
  );

  const setTripStatus = useCallback((destinationId: string, status: TripStatus | null) => {
    setPlans((currentPlans) =>
      upsertTripPlan(currentPlans, destinationId, (existingPlan) => {
        const basePlan = createBaseTripPlan(destinationId, existingPlan);

        return {
          ...basePlan,
          status,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const saveTripNotes = useCallback((destinationId: string, notes: string) => {
    setPlans((currentPlans) =>
      upsertTripPlan(currentPlans, destinationId, (existingPlan) => {
        const basePlan = createBaseTripPlan(destinationId, existingPlan);

        return {
          ...basePlan,
          notes,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const toggleChecklistItem = useCallback((destinationId: string, itemId: string) => {
    setPlans((currentPlans) =>
      upsertTripPlan(currentPlans, destinationId, (existingPlan) => {
        const basePlan = createBaseTripPlan(destinationId, existingPlan);

        return {
          ...basePlan,
          checklist: basePlan.checklist.map((item) =>
            item.id === itemId
              ? { ...item, completed: !item.completed }
              : item
          ),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const addChecklistItem = useCallback((destinationId: string, label: string) => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      return;
    }

    setPlans((currentPlans) =>
      upsertTripPlan(currentPlans, destinationId, (existingPlan) => {
        const basePlan = createBaseTripPlan(destinationId, existingPlan);

        return {
          ...basePlan,
          checklist: [...basePlan.checklist, createTripChecklistItem(trimmedLabel)],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const removeChecklistItem = useCallback((destinationId: string, itemId: string) => {
    setPlans((currentPlans) =>
      upsertTripPlan(currentPlans, destinationId, (existingPlan) => {
        const basePlan = createBaseTripPlan(destinationId, existingPlan);

        return {
          ...basePlan,
          checklist: basePlan.checklist.filter((item) => item.id !== itemId),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const clearTripPlan = useCallback((destinationId: string) => {
    setPlans((currentPlans) => {
      const { [destinationId]: _removed, ...remainingPlans } = currentPlans;
      return remainingPlans;
    });
  }, []);

  const value = useMemo<TripPlannerContextValue>(() => {
    const activePlans = Object.values(plans).sort(
      (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    );

    const tripStats = activePlans.reduce(
      (stats, plan) => {
        if (plan.status) {
          stats[plan.status] += 1;
        }
        const checklistProgress = getChecklistProgress(plan);
        stats.checklistTotal += checklistProgress.total;
        stats.checklistCompleted += checklistProgress.completed;
        stats.total += 1;
        return stats;
      },
      {
        total: 0,
        dreaming: 0,
        planning: 0,
        booked: 0,
        visited: 0,
        checklistTotal: 0,
        checklistCompleted: 0,
      }
    );

    return {
      plans,
      activePlans,
      loading,
      tripStats,
      getTripPlan,
      setTripStatus,
      saveTripNotes,
      toggleChecklistItem,
      addChecklistItem,
      removeChecklistItem,
      clearTripPlan,
    };
  }, [
    addChecklistItem,
    clearTripPlan,
    getTripPlan,
    loading,
    plans,
    removeChecklistItem,
    saveTripNotes,
    setTripStatus,
    toggleChecklistItem,
  ]);

  return (
    <TripPlannerContext.Provider value={value}>
      {children}
    </TripPlannerContext.Provider>
  );
}

export function useTripPlanner() {
  const context = useContext(TripPlannerContext);

  if (!context) {
    throw new Error('useTripPlanner must be used within a TripPlannerProvider');
  }

  return context;
}
