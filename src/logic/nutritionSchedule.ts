import type { NutritionScheduleEntry } from "@/types/nutrition";
import type { DailyTrainingAdjustment, TrainingDayType } from "@/types/training";
import { isTrainingActiveForNutrition } from "@/logic/nutrition";

function parseTrainingHour(trainingTime: string) {
  const [hour, minute] = trainingTime.split(":").map(Number);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return { hour: 18, minute: 0 };
  }

  return { hour, minute };
}

function formatTime(totalMinutes: number) {
  const minutesInDay = 24 * 60;
  const normalized = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function getNutritionScheduleForTrainingTime(
  dayType: TrainingDayType,
  trainingTime = "18:00",
  adjustment?: DailyTrainingAdjustment
): NutritionScheduleEntry[] {
  const trainingActive = isTrainingActiveForNutrition(dayType, adjustment);

  if (!trainingActive) {
    return [
      { time: "08:30", label: "早上 / 任意时间", itemIds: ["creatine"], notes: "肌酸稳定吃即可。" },
      {
        time: "正餐",
        label: "正常饮食",
        itemIds: ["whey-isolate"],
        notes: "优先用正常饮食达到蛋白目标；蛋白粉只在缺口明显时用。"
      },
      {
        time: "晚餐",
        label: "晚餐随餐",
        itemIds: ["fish-oil-epa-dha"],
        notes: "鱼油作为日常基础补剂，随正餐吃即可。"
      },
      {
        time: "晚间",
        label: "晚间 / 睡前",
        itemIds: ["magnesium-glycinate", "zinc", "glutamine"],
        notes: "镁、锌、谷氨酰胺都是按需要选择，不是必须每天全部吃。"
      }
    ];
  }

  const { hour, minute } = parseTrainingHour(trainingTime);
  const trainingMinutes = hour * 60 + minute;

  return [
    { time: "08:30", label: "早上 / 任意时间", itemIds: ["creatine"], notes: "肌酸每天稳定吃，时间不关键。" },
    {
      time: formatTime(trainingMinutes - 60),
      label: "训练前 45-60 分钟",
      itemIds: ["collagen-vitamin-c", "l-citrulline"],
      notes: "L-瓜氨酸可选；肠胃不舒服就减少剂量或跳过。"
    },
    {
      time: formatTime(trainingMinutes - 30),
      label: "训练前 15-30 分钟",
      itemIds: ["pre-training-light-carb"],
      notes: "能量低或上一餐太久时再吃，别吃太撑。"
    },
    {
      time: trainingTime,
      label: "训练中",
      itemIds: ["hydration-electrolytes"],
      notes: "水为主，出汗多或训练长时加电解质。"
    },
    {
      time: formatTime(trainingMinutes + 75),
      label: "训练后 0-2 小时",
      itemIds: ["whey-isolate", "post-training-carb-meal"],
      notes: "可用正餐替代乳清；不需要迷信精确窗口。"
    },
    {
      time: formatTime(trainingMinutes + 90),
      label: "晚餐随餐",
      itemIds: ["fish-oil-epa-dha"],
      notes: "鱼油不需要卡训练前后，随晚餐吃更稳。"
    },
    {
      time: "22:30",
      label: "晚间 / 睡前",
      itemIds: ["magnesium-glycinate", "zinc", "glutamine"],
      notes: "镁可用于晚间放松；锌 30mg 和谷氨酰胺都不是必须。"
    }
  ];
}
