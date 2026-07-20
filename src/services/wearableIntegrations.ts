import type {
  DailyWearableSignals,
  WithingsBodySignals
} from "@/types/bodySignals";

export interface WearableIntegrationService {
  getDailyWearableSignals(date: string): Promise<DailyWearableSignals | null>;
}

export interface BodyCompositionIntegrationService {
  getWithingsBodySignals(date: string): Promise<WithingsBodySignals | null>;
}

export const mockOuraService: WearableIntegrationService = {
  async getDailyWearableSignals(date) {
    return {
      date,
      source: "mock",
      ouraReadiness: 78,
      ouraSleepScore: 82,
      ouraHrvMs: 54,
      ouraRestingHr: 52,
      ouraBodyTempDeviationC: 0.1,
      ouraRespiratoryRate: 14.5,
      ouraSleepDurationMinutes: 430,
      notes: "Mock Oura data for local validation."
    };
  }
};

export const mockWhoopService: WearableIntegrationService = {
  async getDailyWearableSignals(date) {
    return {
      date,
      source: "mock",
      whoopRecovery: 72,
      whoopStrain: 9.4,
      whoopSleepPerformance: 84,
      whoopHrvMs: 57,
      whoopRestingHr: 51,
      whoopRespiratoryRate: 14.7,
      notes: "Mock WHOOP data for local validation."
    };
  }
};

export const mockWithingsService: BodyCompositionIntegrationService = {
  async getWithingsBodySignals(date) {
    return {
      date,
      weightKg: 82.5,
      bodyFatPercent: 15.8,
      muscleMassKg: 66.2,
      bodyWaterPercent: 58.4,
      leftLegMuscleMassKg: 10.8,
      rightLegMuscleMassKg: 10.4,
      leftRightLegMuscleDifferencePercent: 3.8,
      notes: "Mock Withings BodyFit data for local validation."
    };
  }
};

async function fetchBackendJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as T;
}

export const backendOuraService: WearableIntegrationService = {
  async getDailyWearableSignals(date) {
    // OAuth access/refresh tokens must be stored server-side.
    // The frontend calls only this app backend endpoint; it must not call Oura directly.
    return fetchBackendJson<DailyWearableSignals>(
      `/api/integrations/oura/daily?date=${encodeURIComponent(date)}`
    );
  }
};

export const backendWhoopService: WearableIntegrationService = {
  async getDailyWearableSignals(date) {
    // OAuth access/refresh tokens must be stored server-side.
    // The frontend calls only this app backend endpoint; it must not call WHOOP directly.
    return fetchBackendJson<DailyWearableSignals>(
      `/api/integrations/whoop/daily?date=${encodeURIComponent(date)}`
    );
  }
};

export const backendWithingsService: BodyCompositionIntegrationService = {
  async getWithingsBodySignals(date) {
    // OAuth access/refresh tokens must be stored server-side.
    // The frontend calls only this app backend endpoint; it must not call Withings directly.
    return fetchBackendJson<WithingsBodySignals>(
      `/api/integrations/withings/body?date=${encodeURIComponent(date)}`
    );
  }
};
