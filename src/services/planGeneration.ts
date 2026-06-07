import type { GeneratedAdaptivePlan, PlanGenerationRequest } from "@/types/adaptivePlan";

export interface PlanGenerationService {
  generateAdaptivePlan(
    request: PlanGenerationRequest
  ): Promise<GeneratedAdaptivePlan>;
}
