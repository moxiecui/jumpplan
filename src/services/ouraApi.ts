import type { OuraDailyReadinessInput } from "@/types/training";

export async function getOuraApiReadiness(_date: string): Promise<OuraDailyReadinessInput> {
  // TODO: add OAuth flow.
  // TODO: store access token securely.
  // TODO: fetch daily readiness data from Oura API v2.
  // TODO: map Oura response to OuraDailyReadinessInput.
  // Do not put API secrets in the app.
  throw new Error("Oura API integration is not implemented yet.");
}
