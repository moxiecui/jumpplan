export interface IntegrationSettings {
  ouraEnabled: boolean;
  whoopEnabled: boolean;
  withingsEnabled: boolean;
  preferWearableSourceForReadiness: "oura" | "whoop" | "combined";
  useWithingsForDailyDecisions: false;
  reminderSensitivity: "conservative" | "balanced" | "aggressive";
}

export const defaultIntegrationSettings: IntegrationSettings = {
  ouraEnabled: false,
  whoopEnabled: false,
  withingsEnabled: false,
  preferWearableSourceForReadiness: "combined",
  useWithingsForDailyDecisions: false,
  reminderSensitivity: "balanced"
};
