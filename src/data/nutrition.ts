import type { DailyNutritionPlan, NutritionItem } from "@/types/nutrition";

export const nutritionItems: NutritionItem[] = [
  {
    id: "collagen-vitamin-c",
    productId: "sports-research-collagen-peptides",
    nameZh: "胶原蛋白肽 + 维 C",
    category: "supplement",
    priority: "useful",
    timing: "preTraining45To60",
    dose: "胶原蛋白肽 10-15g + 维 C 50-100mg，或半个/一个橙子",
    purpose: "在肌腱负荷训练前提供胶原相关氨基酸和维 C 支持。",
    whyForUser:
      "你的目标包括弹跳、跟腱/髌腱负荷管理和篮球起跳转化。胶原蛋白肽更适合放在弹跳、力量、PAP、测试或高强度篮球前 45-60 分钟。它不是即时修复工具，只是让训练前营养准备更完整。",
    instructions: [
      "在弹跳、力量、PAP、测试或高强度篮球前 45-60 分钟摄入。",
      "用水冲泡 Sports Research Collagen Peptides。",
      "搭配少量维 C，例如橙子、维 C 片或其他水果。",
      "如果训练前肠胃不舒服，减少剂量或提前到 60-90 分钟。",
      "如果错过训练前，也可以当天其他时间补，不需要焦虑。"
    ],
    cautions: [
      "不要把它理解为马上修复跟腱或髌腱。",
      "如果肠胃不适，减少剂量或和少量食物一起吃。",
      "恢复日不是必须吃。",
      "总蛋白、睡眠和训练负荷仍然更重要。"
    ]
  },
  {
    id: "l-citrulline",
    productId: "nutricost-l-citrulline-base",
    nameZh: "L-瓜氨酸",
    category: "supplement",
    priority: "optional",
    timing: "preTraining45To60",
    dose: "6g；如果肠胃不舒服，降到 3-4g",
    purpose: "训练前支持血流和训练表现。",
    whyForUser:
      "它适合放在弹跳、力量、PAP 或篮球日前，尤其是你想要更好的训练状态时。它不是必须每天吃，也不能替代热身、碳水和睡眠。",
    instructions: [
      "训练前 45-60 分钟用水冲服。",
      "第一次或肠胃敏感时从 3-4g 开始。",
      "如果和胶原一起吃不舒服，可以分开或减少剂量。",
      "恢复日通常不需要。"
    ],
    cautions: [
      "可能造成胃胀、腹泻或反酸。",
      "不要为了追求感觉而超量。",
      "如果当天只做恢复、休息或轻松投篮，可以跳过。"
    ],
    optional: true
  },
  {
    id: "whey-isolate",
    productId: "on-gold-standard-isolate",
    nameZh: "分离乳清蛋白 / 正餐",
    category: "protein",
    priority: "core",
    timing: "postTraining0To2h",
    dose: "1 勺，或根据当天蛋白质缺口调整",
    purpose: "帮助补足每日蛋白质摄入，支持力量和恢复。",
    whyForUser:
      "力量、弹跳和篮球训练都需要足够蛋白质来支持恢复。分离乳清是方便方案，重点是补足全天蛋白，不是必须卡在训练后 30 分钟内。",
    instructions: [
      "训练后 0-2 小时内可以用水或牛奶冲。",
      "如果训练后马上能正常吃饭，可以用正餐替代。",
      "如果用牛奶肠胃不舒服，改用水或无乳糖奶。",
      "恢复日只有在当天蛋白质不够时再补。"
    ],
    cautions: [
      "不要认为牛奶会阻断乳清吸收。",
      "如果胃胀或腹泻，减少剂量或换水冲。",
      "蛋白粉是方便食品，不是必须补剂。"
    ]
  },
  {
    id: "creatine",
    productId: "thorne-creatine-monohydrate",
    nameZh: "肌酸",
    category: "supplement",
    priority: "core",
    timing: "anytime",
    dose: "3-5g 每天；你的 THORNE 每份 5g，可以每天 1 份",
    purpose: "长期支持力量、爆发力和高强度训练能力。",
    whyForUser:
      "肌酸对力量和短时间高强度输出更相关，适合弹跳和篮球训练。关键是每天稳定摄入，不是必须睡前或训练后。",
    instructions: [
      "每天 3-5g，选一个容易坚持的时间。",
      "可以和早餐、午餐、训练后 shake 或水一起吃。",
      "如果肠胃不舒服，分成 2 次或随餐吃。",
      "训练日和休息日都可以吃。"
    ],
    cautions: [
      "不需要加载期。",
      "不要空腹硬灌导致胃不舒服。",
      "注意日常饮水，但不用过量喝水。"
    ]
  },
  {
    id: "fish-oil-epa-dha",
    productId: "thorne-super-epa",
    nameZh: "鱼油 EPA/DHA",
    nameEn: "Fish Oil EPA/DHA",
    category: "omega3",
    priority: "useful",
    timing: "dinner",
    dose: "每天 1-2 粒，随午餐或晚餐吃；先从每天 1 粒开始",
    purpose: "作为日常基础 omega-3 补充，支持整体健康、关节舒适度和训练恢复环境。",
    whyForUser:
      "鱼油不是直接提高弹跳的补剂，也不能代替训练、睡眠或疼痛管理。对篮球、力量和弹跳训练频率较高的人，它更适合作为日常基础补充，帮助维持更好的整体营养状态。它不需要卡在训练前后，随含脂肪的正餐吃更容易坚持，也更适合减少反酸或鱼腥味。",
    instructions: [
      "从每天 1 粒开始，随午餐或晚餐吃。",
      "如果没有反酸、鱼腥味或胃不舒服，可以增加到每天 2 粒。",
      "如果吃 2 粒，可以午餐 1 粒、晚餐 1 粒。",
      "不需要训练前吃，也不需要训练后立刻吃。",
      "如果当天不训练，也可以照常吃。"
    ],
    keyPoints: [
      "鱼油是日常基础补剂，不是训练前兴奋剂。",
      "重点看长期稳定摄入，不是单次时间点。",
      "随正餐吃通常更舒服。",
      "不要因为吃了鱼油就增加弹跳或篮球冲击量。",
      "如果已经经常吃高脂鱼，可以根据饮食情况减少补充频率。"
    ],
    commonMistakes: [
      "空腹吃导致反酸或鱼腥味。",
      "以为鱼油能直接提高弹跳。",
      "把鱼油当成修复跟腱或髌腱的工具。",
      "剂量加太快导致胃不舒服。",
      "和太多补剂堆在睡前一起吃，增加肠胃负担。"
    ],
    cautions: [
      "如果正在使用抗凝药、抗血小板药、阿司匹林，或有出血风险，先咨询医生。",
      "如果近期要手术、拔牙或有出血倾向，先咨询医生。",
      "如果对鱼类或海鲜过敏，不要自行使用。",
      "如果出现明显反酸、恶心、腹泻或鱼腥味，减少剂量、随餐吃或暂停。",
      "高剂量鱼油不一定更好，不要自行长期大剂量使用。"
    ],
    skipOrReduceWhen: [
      "空腹吃会反酸时，改成随餐或减少剂量。",
      "胃不舒服时，先降到每天 1 粒或隔天吃。",
      "如果当天已经吃了较多鱼类，可以选择跳过。",
      "如果医生提醒你限制鱼油或 omega-3 摄入，按医生建议。"
    ],
    optional: true
  },
  {
    id: "glutamine",
    productId: "glutamine",
    nameZh: "谷氨酰胺",
    category: "optional",
    priority: "optional",
    timing: "evening",
    dose: "5g，可选",
    purpose: "可作为恢复或肠胃支持的可选补充。",
    whyForUser:
      "谷氨酰胺不是提高弹跳的核心补剂。如果你已经习惯吃且肠胃舒服，可以保留；如果想简化，优先保留蛋白质、肌酸、训练前胶原和必要碳水。",
    instructions: ["可放在训练后、晚间或睡前。", "可以用水冲。", "如果当天补剂太多，可以跳过。"],
    cautions: ["不要把它当作弹跳核心。", "如果胃不舒服，停止或减少剂量。"],
    optional: true
  },
  {
    id: "zinc",
    productId: "pure-encapsulations-zinc-30",
    nameZh: "锌 30mg",
    category: "mineral",
    priority: "optional",
    timing: "evening",
    dose: "30mg，按标签或医生建议",
    purpose: "补充锌，支持正常营养状态。",
    whyForUser:
      "锌不是弹跳专项补剂。你这个产品是 30mg，剂量不低，更适合在确实需要补充时使用，而不是无限期默认每天吃。",
    instructions: [
      "随晚餐或睡前较早时间吃，减少胃不舒服风险。",
      "如果空腹恶心，改为随餐。",
      "如果同时吃镁，可以一起放晚间，但不必强行卡精确时间。"
    ],
    cautions: [
      "30mg 锌不建议无期限长期每天吃，除非医生或检测结果支持。",
      "长期高锌可能影响铜状态。",
      "如果恶心、胃痛，停止空腹吃。",
      "不要把补剂时间复杂化到影响执行。"
    ],
    optional: true
  },
  {
    id: "magnesium-glycinate",
    productId: "pure-encapsulations-magnesium-glycinate",
    nameZh: "甘氨酸镁",
    category: "mineral",
    priority: "useful",
    timing: "beforeBed",
    dose: "按产品标签；可从较低剂量开始",
    purpose: "支持放松、睡眠和肌肉神经功能。",
    whyForUser: "对你来说，镁的价值主要是帮助晚间放松和睡眠质量。睡眠质量比多数恢复补剂更重要。",
    instructions: [
      "晚间或睡前 30-60 分钟吃。",
      "如果睡前吃影响胃，改到晚饭后。",
      "如果和锌一起吃不舒服，可以分开。"
    ],
    cautions: [
      "如果腹泻、胃胀或睡眠变差，减少剂量或停止。",
      "不要把镁当作镇静药。"
    ]
  },
  {
    id: "hydration-electrolytes",
    nameZh: "水分 / 电解质",
    category: "hydration",
    priority: "core",
    timing: "duringTraining",
    dose: "根据出汗量；水为主，长时间或大量出汗时加电解质",
    purpose: "维持训练中的水分和电解质状态。",
    whyForUser:
      "篮球和弹跳训练出汗多，缺水会影响主观状态、起跳质量和恢复。长时间篮球或炎热环境下，电解质比只喝大量白水更实用。",
    instructions: [
      "训练前正常喝水。",
      "训练中小口喝，不要一次灌太多。",
      "如果训练超过 60-90 分钟、出汗很多或天气热，加入电解质。"
    ],
    cautions: [
      "不要为了补水过量喝白水。",
      "如果有高血压、肾脏问题或医生限制钠摄入，电解质使用要更谨慎。"
    ]
  },
  {
    id: "pre-training-light-carb",
    nameZh: "训练前易消化碳水",
    category: "carb",
    priority: "useful",
    timing: "preTraining15To30",
    dose: "少量易消化碳水，例如香蕉、吐司、米饭、燕麦、水果",
    purpose: "给高强度训练提供更稳定的能量。",
    whyForUser:
      "弹跳、PAP、篮球都依赖高强度输出。如果训练前空腹或能量低，少量碳水比再加一个补剂更直接。",
    instructions: [
      "训练前 30-90 分钟吃少量易消化碳水。",
      "如果训练前容易胃胀，提前到 60-90 分钟。",
      "如果上一餐很近，可以跳过。"
    ],
    cautions: ["不要训练前吃太油或太撑。", "测试日不要尝试新食物。"],
    optional: true
  },
  {
    id: "post-training-carb-meal",
    nameZh: "训练后碳水正餐",
    category: "carb",
    priority: "useful",
    timing: "postTraining0To2h",
    dose: "根据训练强度和下一次训练时间调整",
    purpose: "帮助补充糖原，支持下一次篮球或训练。",
    whyForUser:
      "如果 24 小时内还有篮球或力量/弹跳训练，训练后补一些碳水更重要。如果只是轻恢复日，就不需要特别加。",
    instructions: [
      "训练后正餐中加入米饭、面、土豆、水果或其他主食。",
      "如果训练很晚，可以吃容易消化的碳水和蛋白组合。"
    ],
    cautions: ["不需要每次恢复日都额外加大量碳水。", "根据体重、训练量和胃口调整。"]
  }
];

function items(ids: string[]): NutritionItem[] {
  return ids.map((id) => nutritionItems.find((item) => item.id === id)).filter(Boolean) as NutritionItem[];
}

export const dailyNutritionPlans: DailyNutritionPlan[] = [
  {
    id: "jump-day-nutrition",
    dayType: "jump",
    title: "弹跳 / PAP 日营养时间表",
    summary: "训练前优先胶原 + 维 C；L-瓜氨酸和训练前碳水按肠胃与能量状态选择。",
    items: items([
      "collagen-vitamin-c",
      "l-citrulline",
      "pre-training-light-carb",
      "hydration-electrolytes",
      "whey-isolate",
      "post-training-carb-meal",
      "creatine",
      "fish-oil-epa-dha",
      "magnesium-glycinate",
      "zinc",
      "glutamine"
    ]),
    notes: [
      "训练前 45-60 分钟优先安排胶原 + 维 C。",
      "L-瓜氨酸可选，如果肠胃舒服再用。",
      "训练后优先正常吃饭或补乳清，不需要迷信 30 分钟窗口。",
      "弹跳日不要因为补剂齐全就增加跳跃量。"
    ]
  },
  {
    id: "strength-day-nutrition",
    dayType: "strength",
    title: "大力量 / 肌腱日营养时间表",
    summary: "慢离心和下肢力量日前适合胶原 + 维 C；训练后用正餐或乳清补足蛋白。",
    items: items([
      "collagen-vitamin-c",
      "l-citrulline",
      "pre-training-light-carb",
      "hydration-electrolytes",
      "whey-isolate",
      "post-training-carb-meal",
      "creatine",
      "fish-oil-epa-dha",
      "magnesium-glycinate",
      "zinc",
      "glutamine"
    ]),
    notes: ["慢离心和下肢力量日之前适合胶原 + 维 C。", "训练后蛋白质和碳水比复杂补剂更重要。", "肌酸每天稳定吃即可。"]
  },
  {
    id: "basketball-day-nutrition",
    dayType: "basketball",
    title: "篮球日营养时间表",
    summary: "高强度篮球重视水分、电解质和碳水；轻松投篮时跳过复杂训练前补剂。",
    items: items([
      "l-citrulline",
      "collagen-vitamin-c",
      "pre-training-light-carb",
      "hydration-electrolytes",
      "whey-isolate",
      "post-training-carb-meal",
      "creatine",
      "fish-oil-epa-dha",
      "magnesium-glycinate",
      "zinc",
      "glutamine"
    ]),
    notes: [
      "如果只是轻松投篮，L-瓜氨酸和胶原都可以跳过。",
      "如果是高强度对抗或很多起跳，训练前胶原 + 维 C 可以保留。",
      "篮球日最重要的是水分、电解质、碳水和训练后正餐。"
    ]
  },
  {
    id: "recovery-day-nutrition",
    dayType: "recovery",
    title: "恢复日营养时间表",
    summary: "恢复日不需要复杂训练前补剂；正常饮食、睡眠和轻活动更重要。",
    items: items(["creatine", "fish-oil-epa-dha", "whey-isolate", "hydration-electrolytes", "magnesium-glycinate", "zinc", "glutamine"]),
    notes: [
      "恢复日不需要复杂训练前补剂。",
      "不需要 L-瓜氨酸。",
      "胶原可选，但不是必须。",
      "正常吃饭、睡眠和轻活动更重要。"
    ]
  },
  {
    id: "test-day-nutrition",
    dayType: "test",
    title: "测试日营养时间表",
    summary: "测试日目标是状态稳定；不要尝试新补剂或新食物。",
    items: items([
      "collagen-vitamin-c",
      "l-citrulline",
      "pre-training-light-carb",
      "hydration-electrolytes",
      "whey-isolate",
      "creatine",
      "fish-oil-epa-dha",
      "magnesium-glycinate"
    ]),
    notes: [
      "测试日不要尝试新补剂或新食物。",
      "如果 L-瓜氨酸之前没吃过，不要测试当天第一次用。",
      "测试前不要吃太撑。",
      "目标是状态稳定，不是把补剂堆满。"
    ]
  },
  {
    id: "rest-day-nutrition",
    dayType: "rest",
    title: "休息日营养时间表",
    summary: "休息日以正常饮食为主；肌酸可以继续稳定吃。",
    items: items(["creatine", "fish-oil-epa-dha", "whey-isolate", "magnesium-glycinate", "zinc", "glutamine"]),
    notes: ["休息日以正常饮食为主。", "肌酸继续每天稳定吃。", "不需要 L-瓜氨酸。", "蛋白粉只在蛋白质不够时使用。"]
  }
];

export function getNutritionItemById(id: string): NutritionItem | undefined {
  return nutritionItems.find((item) => item.id === id);
}

export function getNutritionPlanById(id: string): DailyNutritionPlan | undefined {
  return dailyNutritionPlans.find((plan) => plan.id === id);
}
