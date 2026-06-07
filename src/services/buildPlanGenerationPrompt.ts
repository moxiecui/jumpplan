import type { PlanGenerationRequest } from "@/types/adaptivePlan";

export function buildPlanGenerationPrompt(request: PlanGenerationRequest): string {
  return [
    "你是一个保守的篮球弹跳训练计划生成器。",
    "只输出 GeneratedAdaptivePlan JSON，不要输出 Markdown、解释文字或额外字段。",
    "",
    "用户目标：basketball vertical jump。",
    `当前请求：${JSON.stringify(request, null, 2)}`,
    "",
    "必须考虑：",
    "- 当前训练反馈",
    "- Readiness 数据",
    "- 跟腱 / 髌腱疼痛状态",
    "- 篮球频率",
    "- 器械和计划约束",
    "- 右脚足弓和右膝轨迹控制",
    "",
    "安全规则：",
    "- Do not generate high-volume plyometrics.",
    "- Do not add max jumps on recovery days.",
    "- Do not override tendon pain with wearable readiness.",
    "- If Achilles or patellar pain >= 4/10, generate recovery-only or tendon-safety plan.",
    "- If basketball frequency is high, reduce gym impact volume.",
    "- No more than 2 high-impact days per week.",
    "- Every training day must include warmup and activeRecovery.",
    "- Generated plan must be structured JSON only.",
    "- recovery/rest days should not be upgraded into hard days.",
    "- preserve right foot arch and right knee tracking focus.",
    "- include warmup, main, activeRecovery, and nutrition summary if available.",
    "- Do not include medical claims.",
    "",
    "输出格式必须匹配 GeneratedAdaptivePlan：metadata, days, globalRules, progressionRules, deloadRules, redFlags。",
    "metadata.source 必须为 backend-gpt。"
  ].join("\n");
}
