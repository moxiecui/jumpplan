import type { TrainingDay } from "@/types/training";

export const trainingPlan: TrainingDay[] = [
  {
    day: 1,
    title: "再校准 + 轻量弹性",
    type: "jump",
    goal: "重新建立足弓、膝盖轨迹和低冲击弹性节奏。",
    readinessRule: "如果跟腱晨僵或髌腱痛达到 3/10，取消 Pogo 和反向纵跳。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
          { exerciseId: "short-foot", sets: 2, reps: "6 次，每次保持 6 秒", side: "each", intensity: "low" },
          { exerciseId: "toe-yoga", sets: 2, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "ankle-knee-wall", sets: 2, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "band-lateral-walk", sets: 2, reps: "8 步/方向", intensity: "low" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "low-pogo", sets: 3, reps: "12 次", intensity: "low", rest: "45 秒", notes: "只做低幅、安静落地。" },
          { exerciseId: "cmj", sets: 4, reps: "2 次", intensity: "medium", rest: "75 秒", notes: "70–80%，每次落地定住。" },
          { exerciseId: "step-down", sets: 2, reps: "6 次", side: "each", intensity: "low", notes: "右膝轨迹优先。" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "easy-walk", duration: "12–20 分钟", intensity: "low" },
          { exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each", intensity: "low" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", notes: "可选；2–4/10 轻压力，不压跟腱或膝关节。" },
          { exerciseId: "legs-up-breathing", duration: "4 分钟", intensity: "low" }
        ]
      }
    ]
  },
  {
    day: 2,
    title: "篮球日 / 技术日",
    type: "basketball",
    goal: "保留篮球节奏，但把起跳量控制在低到中等。",
    readinessRule: "篮球前若黄色状态，只做投篮、脚步和低速上篮，不做冲抢和连续跳。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "short-foot", sets: 2, reps: "5 次，每次保持 5 秒", side: "each", intensity: "low" },
          { exerciseId: "ankle-knee-wall", sets: 2, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each", intensity: "low" },
          { exerciseId: "band-lateral-walk", sets: 2, reps: "8 步/方向", intensity: "low" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "approach-jump", sets: 4, reps: "2 次", intensity: "medium", rest: "60–90 秒", notes: "只做技术质量好的跳。" },
          { exerciseId: "lateral-stop-jump", sets: 3, reps: "2 次/方向", intensity: "medium", rest: "75 秒", notes: "先停稳再起跳。" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "backward-walk", duration: "5–8 分钟", intensity: "low" },
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", notes: "可选；篮球后只用轻到中等压力。" },
          { exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }
        ]
      }
    ]
  },
  {
    day: 3,
    title: "力量 + 肌腱日",
    type: "strength",
    goal: "用中等强度力量维持起跳基础，同时给髌腱和跟腱可控负荷。",
    readinessRule: "如果黄色状态，所有力量动作保持 RPE 6–7；红色状态改恢复日。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "easy-walk", duration: "6–8 分钟", intensity: "low" },
          { exerciseId: "ankle-knee-wall", sets: 2, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "band-lateral-walk", sets: 2, reps: "10 步/方向", intensity: "low" },
          { exerciseId: "step-down", sets: 1, reps: "6 次", side: "each", intensity: "low" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "trap-bar-deadlift", sets: 4, reps: "3 次", intensity: "medium", rest: "2 分钟", notes: "速度干净，不做极限重量。" },
          { exerciseId: "bulgarian-split-squat-eccentric", sets: 3, reps: "5 次", side: "each", intensity: "medium", rest: "90 秒" },
          { exerciseId: "single-leg-calf-raise", sets: 3, reps: "8 次", side: "each", intensity: "medium", rest: "60 秒" },
          { exerciseId: "spanish-squat-isometric", sets: 3, duration: "30 秒", intensity: "low", rest: "45 秒" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each", intensity: "low" },
          { exerciseId: "backward-walk", duration: "5 分钟", intensity: "low" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
          { exerciseId: "legs-up-breathing", duration: "4–6 分钟", intensity: "low" }
        ]
      }
    ]
  },
  {
    day: 4,
    title: "恢复 / Zone 2 / 倒走",
    type: "recovery",
    goal: "降低组织紧张，维持循环，给肌腱一天低冲击恢复。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
          { exerciseId: "toe-yoga", sets: 1, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "ankle-knee-wall", sets: 1, reps: "8 次", side: "each", intensity: "low" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "easy-walk", duration: "25–35 分钟", intensity: "low", notes: "保持能完整说话的强度。" },
          { exerciseId: "backward-walk", duration: "6–8 分钟", intensity: "low" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "worlds-greatest-stretch", sets: 2, reps: "4 次", side: "each", intensity: "low" },
          { exerciseId: "short-foot", sets: 2, reps: "5 次，每次保持 6 秒", side: "each", intensity: "low" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", notes: "可选；恢复日保持 2–4/10，不做疼痛深压。" },
          { exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }
        ]
      }
    ]
  },
  {
    day: 5,
    title: "PAP + 最大起跳日",
    type: "jump",
    goal: "少量高质量力量激活后测试最大起跳感觉，总最大跳量保持低。",
    readinessRule: "只有绿色状态才做最大跳；黄色取消 PAP 和最大跳，改 Day 1 低量版本。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
          { exerciseId: "short-foot", sets: 2, reps: "5 次", side: "each", intensity: "low" },
          { exerciseId: "ankle-knee-wall", sets: 2, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "band-lateral-walk", sets: 2, reps: "10 步/方向", intensity: "low" },
          { exerciseId: "low-pogo", sets: 2, reps: "10 次", intensity: "low", notes: "热身弹性，不累积疲劳。" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "trap-bar-deadlift", sets: 3, reps: "2 次", intensity: "medium", rest: "2–3 分钟", notes: "约 RPE 7，快速推地。" },
          { exerciseId: "cmj", sets: 5, reps: "1 次", intensity: "high", rest: "90–120 秒", notes: "总共 5 次最大努力，动作变形就停。" },
          { exerciseId: "approach-jump", sets: 4, reps: "1 次", intensity: "high", rest: "90–120 秒", notes: "最多 4 次，保留最佳质量。" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "backward-walk", duration: "6 分钟", intensity: "low" },
          { exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each", intensity: "low" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", notes: "可选；PAP/最大跳后保持 2–4/10 轻压力。" },
          { exerciseId: "legs-up-breathing", duration: "5–6 分钟", intensity: "low" }
        ]
      }
    ]
  },
  {
    day: 6,
    title: "篮球日",
    type: "basketball",
    goal: "通过真实篮球动作保持转化，但避免连续高冲击弹跳。",
    readinessRule: "如果前一天跳后跟腱或髌腱反应升高，只投篮和运球，不做跳跃专项。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "easy-walk", duration: "5 分钟", intensity: "low" },
          { exerciseId: "ankle-knee-wall", sets: 2, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each", intensity: "low" },
          { exerciseId: "band-lateral-walk", sets: 2, reps: "8 步/方向", intensity: "low" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "approach-jump", sets: 3, reps: "2 次", intensity: "medium", rest: "90 秒", notes: "技术跳，不追数量。" },
          { exerciseId: "lateral-stop-jump", sets: 2, reps: "2 次/方向", intensity: "medium", rest: "90 秒" },
          { exerciseId: "step-down", sets: 2, reps: "5 次", side: "each", intensity: "low", notes: "作为赛后轨迹重置。" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
          { exerciseId: "backward-walk", duration: "5 分钟", intensity: "low" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", notes: "可选；篮球后只用轻到中等压力。" },
          { exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }
        ]
      }
    ]
  },
  {
    day: 7,
    title: "完全恢复",
    type: "rest",
    goal: "不追求训练刺激，只让脚踝、膝盖和小腿恢复到安静状态。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "toe-yoga", sets: 1, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "short-foot", sets: 1, reps: "5 次", side: "each", intensity: "low" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "easy-walk", duration: "10–20 分钟，可选", intensity: "low", notes: "身体疲劳就取消。" },
          { exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
          { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", notes: "可选；休息日保持 2–4/10。" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }
        ]
      }
    ]
  },
  {
    day: 8,
    title: "反应弹性 + 单腿落地",
    type: "jump",
    goal: "在低到中等总量下训练快速反弹和单腿落地质量。",
    readinessRule: "黄色状态取消单腿弹跳，只保留低幅 Pogo 和台阶下放。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
          { exerciseId: "short-foot", sets: 2, reps: "6 次", side: "each", intensity: "low" },
          { exerciseId: "ankle-knee-wall", sets: 2, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "band-lateral-walk", sets: 2, reps: "10 步/方向", intensity: "low" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "low-pogo", sets: 4, reps: "10 次", intensity: "low", rest: "45 秒" },
          { exerciseId: "lateral-stop-jump", sets: 3, reps: "2 次/方向", intensity: "medium", rest: "90 秒", notes: "落地定住 2 秒。" },
          { exerciseId: "step-down", sets: 3, reps: "5 次", side: "each", intensity: "low" },
          { exerciseId: "single-leg-rdl-contralateral", sets: 2, reps: "6 次", side: "each", intensity: "medium" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "backward-walk", duration: "5–6 分钟", intensity: "low" },
          { exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each", intensity: "low" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", notes: "可选；弹跳日后保持轻压力，不追求疼痛。" },
          { exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }
        ]
      }
    ]
  },
  {
    day: 9,
    title: "篮球或恢复",
    type: "basketball",
    goal: "根据膝腱和跟腱状态选择低量篮球技术或恢复。",
    readinessRule: "绿色可做低量篮球；黄色或红色直接选择恢复版本。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "ankle-knee-wall", sets: 2, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each", intensity: "low" },
          { exerciseId: "band-lateral-walk", sets: 1, reps: "10 步/方向", intensity: "low" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "approach-jump", sets: 2, reps: "2 次", intensity: "medium", rest: "90 秒", notes: "只在绿色状态执行；否则跳过。" },
          { exerciseId: "easy-walk", duration: "20–30 分钟", intensity: "low", notes: "恢复版本使用这项替代篮球跳。" },
          { exerciseId: "backward-walk", duration: "6 分钟", intensity: "low" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
          { exerciseId: "short-foot", sets: 2, reps: "5 次", side: "each", intensity: "low" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", notes: "可选；若第二天肌腱更敏感，下次减半或跳过。" },
          { exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }
        ]
      }
    ]
  },
  {
    day: 10,
    title: "力量维持 + 髋主导",
    type: "strength",
    goal: "用髋主导力量和单腿稳定维持输出，不制造跳跃疲劳。",
    readinessRule: "黄色状态减少一组陷阱杠和分腿蹲；红色状态只做恢复。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "easy-walk", duration: "5–8 分钟", intensity: "low" },
          { exerciseId: "ankle-knee-wall", sets: 2, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "band-lateral-walk", sets: 2, reps: "8 步/方向", intensity: "low" },
          { exerciseId: "step-down", sets: 1, reps: "5 次", side: "each", intensity: "low" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "trap-bar-deadlift", sets: 3, reps: "3 次", intensity: "medium", rest: "2 分钟", notes: "RPE 7 左右。" },
          { exerciseId: "single-leg-rdl-contralateral", sets: 3, reps: "6 次", side: "each", intensity: "medium", rest: "75 秒" },
          { exerciseId: "bulgarian-split-squat-eccentric", sets: 2, reps: "5 次", side: "each", intensity: "medium" },
          { exerciseId: "single-leg-calf-raise", sets: 2, reps: "10 次", side: "each", intensity: "medium" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "spanish-squat-isometric", sets: 2, duration: "30 秒", intensity: "low" },
          { exerciseId: "backward-walk", duration: "5 分钟", intensity: "low" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
          { exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }
        ]
      }
    ]
  },
  {
    day: 11,
    title: "低量冲顶测试日",
    type: "test",
    goal: "在充分休息下做极少量高质量摸高，不追求疲劳堆叠。",
    readinessRule: "只有绿色状态测试；黄色改 70% 技术跳，红色只恢复。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
          { exerciseId: "short-foot", sets: 2, reps: "5 次", side: "each", intensity: "low" },
          { exerciseId: "ankle-knee-wall", sets: 2, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "band-lateral-walk", sets: 2, reps: "8 步/方向", intensity: "low" },
          { exerciseId: "low-pogo", sets: 2, reps: "8 次", intensity: "low" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "cmj", sets: 3, reps: "1 次", intensity: "high", rest: "2 分钟", notes: "最多 3 次，记录最佳感觉。" },
          { exerciseId: "approach-jump", sets: 5, reps: "1 次", intensity: "high", rest: "2 分钟", notes: "最多 5 次，不连续跳。" },
          { exerciseId: "lateral-stop-jump", sets: 2, reps: "1 次/方向", intensity: "medium", rest: "90 秒", notes: "只做转化质量，不做疲劳。" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "easy-walk", duration: "10–15 分钟", intensity: "low" },
          { exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each", intensity: "low" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", notes: "可选；测试日后保持 2–4/10 轻压力。" },
          { exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }
        ]
      }
    ]
  },
  {
    day: 12,
    title: "恢复日",
    type: "recovery",
    goal: "清理测试日后的疲劳，观察跟腱和髌腱反应。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "toe-yoga", sets: 1, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "ankle-knee-wall", sets: 1, reps: "8 次", side: "each", intensity: "low" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "easy-walk", duration: "25–40 分钟", intensity: "low" },
          { exerciseId: "backward-walk", duration: "6–8 分钟", intensity: "low" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "worlds-greatest-stretch", sets: 2, reps: "4 次", side: "each", intensity: "low" },
          { exerciseId: "short-foot", sets: 2, reps: "5 次", side: "each", intensity: "low" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
          { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", notes: "可选；恢复日保持 2–4/10。" },
          { exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }
        ]
      }
    ]
  },
  {
    day: 13,
    title: "篮球专项转化",
    type: "skill",
    goal: "把起跳质量放回篮球场景，保留低总量和清晰落地。",
    readinessRule: "黄色状态只做脚步、投篮和 70% 技术跳；红色恢复。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
          { exerciseId: "short-foot", sets: 2, reps: "5 次", side: "each", intensity: "low" },
          { exerciseId: "ankle-knee-wall", sets: 2, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "band-lateral-walk", sets: 2, reps: "10 步/方向", intensity: "low" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "approach-jump", sets: 4, reps: "1–2 次", intensity: "medium", rest: "90 秒", notes: "模拟上篮或摸板，但不连续冲跳。" },
          { exerciseId: "lateral-stop-jump", sets: 3, reps: "1–2 次/方向", intensity: "medium", rest: "90 秒" },
          { exerciseId: "cmj", sets: 3, reps: "1 次", intensity: "medium", rest: "90 秒", notes: "80–90%，用来保持垂直感觉。" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "backward-walk", duration: "6 分钟", intensity: "low" },
          { exerciseId: "step-down", sets: 2, reps: "5 次", side: "each", intensity: "low" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", notes: "可选；篮球专项后只用轻到中等压力。" },
          { exerciseId: "legs-up-breathing", duration: "5–6 分钟", intensity: "low" }
        ]
      }
    ]
  },
  {
    day: 14,
    title: "完全休息或轻松投篮",
    type: "rest",
    goal: "结束周期前保持身体新鲜，只做轻松活动和恢复。",
    readinessRule: "如果任何疼痛升高，选择完全休息，不做投篮跳起。",
    blocks: [
      {
        type: "warmup",
        title: "Complete Warmup",
        items: [
          { exerciseId: "toe-yoga", sets: 1, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "short-foot", sets: 1, reps: "5 次", side: "each", intensity: "low" },
          { exerciseId: "ankle-knee-wall", sets: 1, reps: "8 次", side: "each", intensity: "low" }
        ]
      },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "easy-walk", duration: "10–20 分钟，可选", intensity: "low" },
          { exerciseId: "approach-jump", sets: 2, reps: "1 次", intensity: "low", rest: "90 秒", notes: "只在完全无痛且想轻松投篮时做 60–70% 技术跳。" }
        ]
      },
      {
        type: "activeRecovery",
        title: "Active Recovery",
        items: [
          { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
          { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", notes: "可选；休息日保持轻压力，不压痛点。" }
        ]
      },
      {
        type: "eveningRecovery",
        title: "Evening Recovery",
        items: [
          { exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }
        ]
      }
    ]
  }
];
