import type { TrainingBlock, TrainingDayType } from "@/types/training";

const dayTypeLabels: Record<TrainingDayType, string> = {
  jump: "弹跳",
  strength: "力量",
  basketball: "篮球",
  recovery: "恢复",
  test: "测试",
  skill: "技术",
  rest: "休息"
};

const blockTypeLabels: Record<TrainingBlock["type"], string> = {
  warmup: "完整热身",
  main: "主训练",
  activeRecovery: "主动恢复",
  eveningRecovery: "晚间恢复",
  notes: "训练备注"
};

const legacyBlockTitleLabels: Record<string, string> = {
  "Complete Warmup": "完整热身",
  "Main Training": "主训练",
  "Active Recovery": "主动恢复",
  "Evening Recovery": "晚间恢复",
  "Optional Evening Recovery": "晚间恢复"
};

export function getTrainingDayTypeLabel(type: TrainingDayType): string {
  return dayTypeLabels[type];
}

export function getTrainingBlockTitle(block: TrainingBlock): string {
  const exactTitle = legacyBlockTitleLabels[block.title];
  if (exactTitle) {
    return exactTitle;
  }

  const legacyPrefix = Object.keys(legacyBlockTitleLabels).find((title) => block.title.startsWith(title));
  if (legacyPrefix) {
    return block.title.replace(legacyPrefix, legacyBlockTitleLabels[legacyPrefix]);
  }

  return blockTypeLabels[block.type] ?? block.title;
}

export function normalizeTrainingCopy(text?: string): string {
  if (!text) {
    return "";
  }

  return text
    .replaceAll("tendon status green", "跟腱/髌腱状态良好")
    .replaceAll("只有绿色状态", "只有跟腱/髌腱状态良好")
    .replaceAll("Complete Warmup", "完整热身")
    .replaceAll("Main Training", "主训练")
    .replaceAll("Active Recovery", "主动恢复")
    .replaceAll("Evening Recovery", "晚间恢复");
}
