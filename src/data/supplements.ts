import type { SupplementProduct } from "@/types/nutrition";

export const supplementProducts: SupplementProduct[] = [
  {
    id: "sports-research-collagen-peptides",
    name: "Sports Research Collagen Peptides",
    shortNameZh: "胶原蛋白肽",
    brand: "Sports Research",
    form: "powder",
    defaultDose: "10-15g",
    servingNote: "以产品标签为准；训练前搭配维 C 更适合肌腱负荷日。",
    userOwns: true
  },
  {
    id: "nutricost-l-citrulline-base",
    name: "Nutricost Pure L-Citrulline Base Powder",
    shortNameZh: "L-瓜氨酸",
    brand: "Nutricost",
    form: "powder",
    defaultDose: "6g，如果肠胃不适可降到 3-4g",
    servingNote: "训练前 45-60 分钟；不是每天必须。",
    userOwns: true
  },
  {
    id: "on-gold-standard-isolate",
    name: "Optimum Nutrition Gold Standard 100% Isolate",
    shortNameZh: "分离乳清蛋白",
    brand: "Optimum Nutrition",
    form: "powder",
    defaultDose: "1 勺，或按当天蛋白质缺口调整",
    servingNote: "可用水或牛奶冲；肠胃不适时用水。",
    userOwns: true
  },
  {
    id: "pure-encapsulations-zinc-30",
    name: "Pure Encapsulations Zinc 30 mg",
    shortNameZh: "锌 30mg",
    brand: "Pure Encapsulations",
    form: "capsule",
    defaultDose: "1 粒，按标签或医生建议",
    servingNote: "30mg 属于较高剂量；不建议无期限长期每天吃，注意总锌摄入。",
    userOwns: true
  },
  {
    id: "pure-encapsulations-magnesium-glycinate",
    name: "Pure Encapsulations Magnesium Glycinate",
    shortNameZh: "甘氨酸镁",
    brand: "Pure Encapsulations",
    form: "capsule",
    defaultDose: "按标签剂量；睡前或晚间",
    servingNote: "如果睡眠或肠胃不适，减少剂量或调整时间。",
    userOwns: true
  },
  {
    id: "thorne-creatine-monohydrate",
    name: "THORNE Creatine Micronized Creatine Monohydrate",
    shortNameZh: "肌酸",
    brand: "THORNE",
    form: "powder",
    defaultDose: "3-5g 每天；产品每份 5g",
    servingNote: "每天稳定摄入比具体时间更重要。",
    userOwns: true
  },
  {
    id: "thorne-super-epa",
    name: "Thorne Super EPA",
    shortNameZh: "鱼油 EPA/DHA",
    brand: "Thorne",
    form: "capsule",
    defaultDose: "每天 1-2 粒，随正餐吃；具体以产品标签为准",
    servingNote: "更适合作为日常基础补剂，不需要卡训练前后。",
    userOwns: true
  },
  {
    id: "glutamine",
    name: "Glutamine",
    shortNameZh: "谷氨酰胺",
    form: "powder",
    defaultDose: "5g，可选",
    servingNote: "不是弹跳核心补剂；想简化时可以先跳过。",
    userOwns: true
  }
];

export function getSupplementProductById(id: string): SupplementProduct | undefined {
  return supplementProducts.find((product) => product.id === id);
}
