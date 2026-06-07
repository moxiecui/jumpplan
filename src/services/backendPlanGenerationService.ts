import type { GeneratedAdaptivePlan, PlanGenerationRequest } from "@/types/adaptivePlan";
import type { PlanGenerationService } from "@/services/planGeneration";

export class BackendPlanGenerationService implements PlanGenerationService {
  async generateAdaptivePlan(request: PlanGenerationRequest): Promise<GeneratedAdaptivePlan> {
    const response = await fetch("/api/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error("Plan generation backend request failed.");
    }

    return response.json() as Promise<GeneratedAdaptivePlan>;
  }
}

// Future backend notes:
// - The mobile app must not call OpenAI directly.
// - The mobile app must not contain an OpenAI API key.
// - The backend/serverless function should keep the API key in a server-side environment variable.
// - The backend should call OpenAI, validate the JSON shape, and return GeneratedAdaptivePlan.
