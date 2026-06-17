import type { GlossaryEntry } from "@/types/glossary";
import type { TrainingDay } from "@/types/training";

export const glossaryEntries: GlossaryEntry[] = [
  {
    id: "cmj",
    term: "CMJ",
    fullName: "Countermovement Jump",
    category: "jump-training",
    shortDefinition: "反向动作纵跳，也就是先快速下蹲再向上跳。",
    detailedExplanation:
      "CMJ 是测试和训练弹跳常用动作。它利用快速下蹲产生的离心加载，再通过伸髋、伸膝、伸踝和摆臂向上起跳。它比完全静止起跳更接近篮球中的很多起跳方式。",
    whyItMattersForUser:
      "你的目标是提高篮球弹跳，CMJ 可以用来观察下肢力量、反应速度、摆臂协调和起跳质量。",
    practicalUse: ["每周最多正式测试 1 次。", "训练中每组 1-3 次即可，重质量不重数量。", "观察右膝是否内扣、落地是否安静。"],
    watchOut: ["不要把 CMJ 做成高次数耐力训练。", "如果跳高下降、落地变重或髌腱/跟腱不适，停止测试。"],
    relatedTerms: ["rfd", "ssc", "plyometric", "rsi"]
  },
  {
    id: "doms",
    term: "DOMS",
    fullName: "Delayed Onset Muscle Soreness",
    category: "recovery",
    shortDefinition: "延迟性肌肉酸痛，通常在训练后 12-72 小时明显。",
    detailedExplanation:
      "DOMS 常出现在高强度离心训练、新动作、大训练量或大量落地之后。它通常表现为一大片肌肉酸、胀、僵硬，而不是某一个点的锐痛。",
    whyItMattersForUser:
      "你做慢离心分腿蹲、RDL、提踵、Pogo 和篮球落地后，都可能出现 DOMS。它会影响第二天的起跳质量和落地控制。",
    practicalUse: ["轻微 DOMS 可以做低强度恢复、散步、Zone 2 或轻活动。", "严重 DOMS 时不要做最大跳、PAP 或高冲击训练。", "用晨起僵硬和动作质量判断是否降级。"],
    watchOut: ["跟腱、髌腱或膝盖某一点刺痛，不要当成普通 DOMS。", "如果疼痛影响走路、下楼或跳跃，要降级训练。"],
    relatedTerms: ["eccentric", "zone2"]
  },
  {
    id: "rpe",
    term: "RPE",
    fullName: "Rate of Perceived Exertion",
    category: "strength-training",
    shortDefinition: "主观用力程度评分，通常用 1-10 表示。",
    detailedExplanation:
      "RPE 用来描述一组动作有多累。RPE 10 代表已经到极限，RPE 7-8 通常表示还可以再做 2-3 次。",
    whyItMattersForUser:
      "你的弹跳训练需要保持神经输出和动作质量，不适合经常练到力竭。用 RPE 可以避免力量训练影响后续弹跳和篮球表现。",
    practicalUse: ["力量主课通常控制在 RPE 7-8。", "Readiness 黄灯时控制在 RPE 6-7。", "弹跳转化日不要做 grind reps。"],
    watchOut: ["不要为了重量牺牲右膝轨迹或髋膝踝对齐。", "如果速度明显变慢，通常已经太重或太累。"],
    relatedTerms: ["rir", "readiness"]
  },
  {
    id: "rir",
    term: "RIR",
    fullName: "Reps in Reserve",
    category: "strength-training",
    shortDefinition: "还剩几次余力。",
    detailedExplanation: "RIR 表示一组结束后，你大概还能再做几次。例如 RIR 2 表示还剩 2 次余力。",
    whyItMattersForUser:
      "用 RIR 可以帮助你避免力量训练练到力竭，从而保留弹跳训练需要的速度和神经状态。",
    practicalUse: ["弹跳相关力量训练多保持 RIR 2-3。", "Readiness 一般时保持 RIR 3-4。"],
    watchOut: ["如果每组都做到 RIR 0，后面的跳跃质量通常会下降。"],
    relatedTerms: ["rpe"]
  },
  {
    id: "pap",
    term: "PAP",
    fullName: "Post-Activation Potentiation",
    category: "jump-training",
    shortDefinition: "重力量刺激后短时间内提高爆发输出的现象。",
    detailedExplanation:
      "PAP 通常指在重力量动作后，经过合适休息，再做爆发动作，例如硬拉后接纵跳。实际训练中也常和 PAPE 混用。",
    whyItMattersForUser:
      "你的目标是把力量转化成篮球起跳。PAP/对比训练可以作为低剂量转化模块，但需要在状态好、肌腱无警告时做。",
    practicalUse: ["每 7-10 天 1 次即可。", "重动作 2-3 次，休息 2.5-4 分钟，再做 1-2 次高质量跳。", "如果跳高没提升或动作变差，就不继续加量。"],
    watchOut: ["跟腱或髌腱疼痛 >= 3/10 时不要做。", "不要把 PAP 做成体能训练。", "篮球频率高时要减少 PAP 频率。"],
    relatedTerms: ["pape", "complex-training", "french-contrast", "rpe"]
  },
  {
    id: "pape",
    term: "PAPE",
    fullName: "Post-Activation Performance Enhancement",
    category: "jump-training",
    shortDefinition: "激活后表现增强，更偏向实际运动表现的短期提升。",
    detailedExplanation:
      "PAPE 和 PAP 很接近，但更强调重力量或爆发刺激后，实际跳跃、冲刺等表现可能短时间变好。训练中常用重力量 + 弹跳来利用这个效果。",
    whyItMattersForUser: "你的法式对比组和重力量后接弹跳训练，本质上就是希望利用 PAPE。",
    practicalUse: ["只在 readiness 好、动作质量高时使用。", "休息时间要足够，不能刚做完重力量就马上疲劳跳。"],
    watchOut: ["如果休息不足，PAPE 可能变成疲劳叠加。"],
    relatedTerms: ["pap", "french-contrast"]
  },
  {
    id: "rfd",
    term: "RFD",
    fullName: "Rate of Force Development",
    category: "jump-training",
    shortDefinition: "发力率，也就是多快产生力量。",
    detailedExplanation:
      "RFD 不是最大力量本身，而是力量产生的速度。弹跳和篮球起跳时间很短，所以能不能快速用力很关键。",
    whyItMattersForUser:
      "你不只是需要深蹲或硬拉更强，还需要把力量在很短时间内用出来。Pogo、CMJ、Approach Jump、PAP 都和 RFD 有关。",
    practicalUse: ["跳跃训练要重质量、速度和触地反应。", "力量训练不要长期只做慢速高疲劳。"],
    watchOut: ["疲劳状态下练 RFD，动作质量容易变差。"],
    relatedTerms: ["cmj", "pap", "ssc"]
  },
  {
    id: "ssc",
    term: "SSC",
    fullName: "Stretch-Shortening Cycle",
    category: "jump-training",
    shortDefinition: "拉长-缩短循环，也就是肌肉肌腱先被快速拉长再快速收缩。",
    detailedExplanation:
      "SSC 是弹跳和跑跳中的核心机制。比如 CMJ 先下蹲再起跳，Pogo 落地后马上弹起，都在利用 SSC。",
    whyItMattersForUser: "篮球中的二次起跳、急停后起跳、篮板连续跳都依赖 SSC。",
    practicalUse: ["Pogo 练短触地和踝弹。", "CMJ 练下蹲蓄力到起跳。", "落地安静和膝盖轨迹稳定是前提。"],
    watchOut: ["跟腱晨僵明显时不要做高强度 SSC 训练。"],
    relatedTerms: ["plyometric", "rsi", "cmj"]
  },
  {
    id: "rsi",
    term: "RSI",
    fullName: "Reactive Strength Index",
    category: "jump-training",
    shortDefinition: "反应力量指数，常用于衡量跳得高和触地快的综合能力。",
    detailedExplanation:
      "RSI 通常和跳高、触地时间有关。简单理解就是在很短触地时间内产生有效弹跳的能力。",
    whyItMattersForUser: "篮球中的连续起跳、急停后反弹、抢篮板二次跳都需要较好的反应力量。",
    practicalUse: ["用 Pogo、小栏跳、低量反应跳训练。", "观察触地是否越来越重。"],
    watchOut: ["不要在疲劳或肌腱不适时追求触地快。"],
    relatedTerms: ["ssc", "plyometric"]
  },
  {
    id: "rom",
    term: "ROM",
    fullName: "Range of Motion",
    category: "general",
    shortDefinition: "关节活动范围。",
    detailedExplanation:
      "ROM 表示一个关节可以活动到多大范围。例如脚踝背屈 ROM 会影响深蹲、落地和起跳准备。",
    whyItMattersForUser: "你的弹跳和篮球急停需要足够踝、髋活动度，但活动度必须和控制能力一起出现。",
    practicalUse: ["训练前用动态活动度。", "训练后用温和拉伸和恢复。"],
    watchOut: ["不是 ROM 越大越好。没有控制的活动范围对弹跳帮助有限。"]
  },
  {
    id: "hrv",
    term: "HRV",
    fullName: "Heart Rate Variability",
    category: "readiness",
    shortDefinition: "心率变异性，常作为恢复和压力状态的参考指标。",
    detailedExplanation:
      "HRV 反映心跳间隔变化。很多 wearable 会用它辅助判断恢复状态。HRV 低于个人基线时，可能代表压力、疲劳、睡眠不足或恢复不足。",
    whyItMattersForUser:
      "你想用 Oura 数据微调训练。HRV 可以作为参考，但不能替代疼痛、动作质量和主观感受。",
    practicalUse: ["HRV 明显低于基线时，降低神经和冲击负荷。", "结合静息心率、睡眠、疼痛和训练表现判断。"],
    watchOut: ["不要只看一天 HRV。", "Oura 分数高也不能覆盖跟腱/髌腱疼痛。"],
    relatedTerms: ["rhr", "readiness"]
  },
  {
    id: "rhr",
    term: "RHR",
    fullName: "Resting Heart Rate",
    category: "readiness",
    shortDefinition: "静息心率。",
    detailedExplanation:
      "RHR 是安静状态下的心率。相对个人基线升高，可能提示疲劳、压力、睡眠不足、脱水或身体正在应对其他负担。",
    whyItMattersForUser: "如果静息心率明显高于基线，PAP、最大跳和高冲击训练更应该谨慎。",
    practicalUse: ["比基线高 5 bpm 以上时加 caution。", "比基线高 8 bpm 以上时更倾向降级训练。"],
    watchOut: ["看趋势，不要只看单日。"],
    relatedTerms: ["hrv", "readiness"]
  },
  {
    id: "vo2max",
    term: "VO2 Max",
    fullName: "Maximal Oxygen Uptake",
    category: "general",
    shortDefinition: "最大摄氧量，反映有氧能力上限。",
    detailedExplanation: "VO2 Max 主要和耐力能力相关，不是弹跳高度的直接指标。",
    whyItMattersForUser:
      "你打篮球需要一定有氧基础帮助恢复回合间体能，但弹跳提升更依赖力量、RFD、SSC、技术和负荷管理。",
    practicalUse: ["用 Zone 2 或轻有氧支持恢复。"],
    watchOut: ["不要为了提高 VO2 Max 牺牲弹跳训练恢复。"],
    relatedTerms: ["zone2"]
  },
  {
    id: "zone2",
    term: "Zone 2",
    fullName: "Zone 2 Cardio",
    category: "recovery",
    shortDefinition: "低到中等强度有氧，通常能说完整句子但不能轻松唱歌。",
    detailedExplanation:
      "Zone 2 常用于建立有氧基础和主动恢复。对弹跳训练来说，它的作用是帮助恢复和体能基础，而不是直接增加爆发力。",
    whyItMattersForUser: "你可以用快走、自行车、游泳作为恢复日选择，避免额外下肢冲击。",
    practicalUse: ["恢复日 20-35 分钟即可。", "强度保持轻松，不要做成间歇训练。"],
    watchOut: ["篮球已经很累时，不要再额外堆高强度有氧。"]
  },
  {
    id: "epa",
    term: "EPA",
    fullName: "Eicosapentaenoic Acid",
    category: "nutrition",
    shortDefinition: "鱼油中的一种 omega-3 脂肪酸。",
    detailedExplanation:
      "EPA 是鱼油里的主要活性脂肪酸之一。它更适合作为长期基础营养的一部分，不是训练前补剂。",
    whyItMattersForUser:
      "你计划使用 Thorne Super EPA。它可以作为日常基础补充，但不能直接提高弹跳，也不能替代恢复和训练管理。",
    practicalUse: ["随午餐或晚餐吃。", "和 DHA 一起看总 EPA+DHA 摄入。"],
    watchOut: ["有出血风险、使用抗凝药或鱼类过敏时先咨询医生。"],
    relatedTerms: ["dha"]
  },
  {
    id: "dha",
    term: "DHA",
    fullName: "Docosahexaenoic Acid",
    category: "nutrition",
    shortDefinition: "鱼油中的另一种 omega-3 脂肪酸。",
    detailedExplanation: "DHA 是 omega-3 脂肪酸之一，常和 EPA 一起出现在鱼油补剂中。",
    whyItMattersForUser: "它属于日常基础营养，不是弹跳专项补剂。",
    practicalUse: ["随正餐吃，减少反酸。"],
    watchOut: ["不要长期自行大剂量使用鱼油。"],
    relatedTerms: ["epa"]
  },
  {
    id: "zma",
    term: "ZMA",
    fullName: "Zinc Magnesium Aspartate",
    category: "nutrition",
    shortDefinition: "锌、镁和维 B6 的组合补剂。",
    detailedExplanation:
      "ZMA 通常作为睡前补剂使用。你现在实际使用的是单独的锌和甘氨酸镁，不一定是标准 ZMA。",
    whyItMattersForUser:
      "对你来说，镁可能更偏睡眠和放松支持；锌不是弹跳专项补剂，30mg 剂量也不适合无脑长期每天吃。",
    practicalUse: ["镁可放晚间或睡前。", "锌空腹不舒服时随餐。"],
    watchOut: ["长期高锌需要注意总摄入和铜状态。", "如果影响睡眠或胃不舒服，调整或停止。"]
  },
  {
    id: "l-citrulline",
    term: "L-Citrulline",
    fullName: "L-Citrulline",
    category: "nutrition",
    shortDefinition: "瓜氨酸，常用于训练前支持血流和训练状态。",
    detailedExplanation: "L-瓜氨酸通常在训练前 45-60 分钟使用。它是可选补剂，不是恢复或弹跳的核心。",
    whyItMattersForUser: "你有 Nutricost Pure L-Citrulline，可以在力量、弹跳、PAP 或篮球日前使用。",
    practicalUse: ["常见剂量 6g，如果肠胃不适降到 3-4g。"],
    watchOut: ["恢复日通常不需要。", "胃不舒服就减少或跳过。"]
  },
  {
    id: "creatine",
    term: "Creatine",
    fullName: "Creatine Monohydrate",
    category: "nutrition",
    shortDefinition: "肌酸，一种长期支持力量和高强度输出的补剂。",
    detailedExplanation: "肌酸的关键是每天稳定摄入，而不是卡某个时间点。",
    whyItMattersForUser: "弹跳和篮球中的短时间高强度输出与肌酸更相关。",
    practicalUse: ["每天 3-5g。", "训练日和休息日都可以吃。"],
    watchOut: ["空腹不舒服就随餐或分次。"]
  },
  {
    id: "whey",
    term: "Whey",
    fullName: "Whey Protein",
    category: "nutrition",
    shortDefinition: "乳清蛋白，用来方便补足每日蛋白质。",
    detailedExplanation: "乳清是方便的蛋白质来源，不是必须补剂。训练后 0-2 小时吃正餐或乳清都可以。",
    whyItMattersForUser: "你的力量、篮球和弹跳训练需要足够蛋白质支持恢复和适应。",
    practicalUse: ["训练后或任何蛋白质不够的时候用。"],
    watchOut: ["牛奶不会阻断乳清吸收，但如果胃胀可以改水冲。"]
  },
  {
    id: "collagen",
    term: "Collagen",
    fullName: "Hydrolyzed Collagen Peptides",
    category: "nutrition",
    shortDefinition: "水解胶原蛋白肽。",
    detailedExplanation: "胶原蛋白肽可以作为肌腱负荷训练前的营养准备，通常搭配少量维 C。",
    whyItMattersForUser: "你关注跟腱、髌腱和弹跳负荷管理。胶原 + 维 C 更适合放在训练前 45-60 分钟。",
    practicalUse: ["训练前 45-60 分钟：10-15g 胶原 + 维 C。"],
    watchOut: ["不要理解成即时修复肌腱。", "胃不舒服就减少剂量。"]
  },
  {
    id: "eccentric",
    term: "Eccentric",
    fullName: "Eccentric Contraction",
    category: "strength-training",
    shortDefinition: "离心收缩，肌肉在受力时被拉长。",
    detailedExplanation: "比如分腿蹲下放、RDL 下放、小腿提踵下放，都是离心控制。",
    whyItMattersForUser: "慢离心可以提高控制能力和组织负荷耐受，但也更容易造成 DOMS。",
    practicalUse: ["常用 3 秒下放。", "控制质量优先于重量。"],
    watchOut: ["高离心量后不要马上堆高冲击弹跳。"],
    relatedTerms: ["doms", "rdl"]
  },
  {
    id: "isometric",
    term: "Isometric",
    fullName: "Isometric Contraction",
    category: "strength-training",
    shortDefinition: "等长收缩，肌肉发力但关节角度基本不变。",
    detailedExplanation: "例如西班牙深蹲等长、墙蹲、提踵保持。",
    whyItMattersForUser: "等长动作可用于力量控制、肌腱负荷管理和疼痛较轻时的降级方案。",
    practicalUse: ["常见 30-45 秒保持。"],
    watchOut: ["应该是可控酸胀，不是尖锐疼痛。"],
    relatedTerms: ["yielding-isometric", "overcoming-isometric"]
  },
  {
    id: "plyometric",
    term: "Plyometric",
    fullName: "Plyometric Training",
    category: "jump-training",
    shortDefinition: "增强式训练，利用快速拉长-缩短循环提升爆发和反应能力。",
    detailedExplanation: "Pogo、CMJ、小栏跳、助跑摸高都属于或接近 plyometric 训练。",
    whyItMattersForUser: "这是弹跳训练核心之一，但必须控制接触次数、落地质量和恢复。",
    practicalUse: ["每周高强度增强式训练最多 1-2 次。"],
    watchOut: ["跟腱/髌腱不适时不要硬做。", "质量下降就停止。"],
    relatedTerms: ["ssc", "rsi", "cmj"]
  },
  {
    id: "french-contrast",
    term: "French Contrast",
    fullName: "French Contrast Training",
    category: "jump-training",
    shortDefinition: "一种把重力量、增强式跳跃和爆发动作组合在一起的高强度训练法。",
    detailedExplanation:
      "完整 French Contrast 通常包括重力量动作、增强式跳跃、轻负重爆发动作和辅助弹性动作。你之前做的重深蹲/硬拉后接跳跃，更接近低剂量 complex training。",
    whyItMattersForUser: "它可以帮助力量向弹跳转化，但神经和肌腱负荷较高。",
    practicalUse: ["你更适合每 7-10 天一次低剂量版本。", "例如 Trap Bar Deadlift 3x2 + CMJ 3x2。"],
    watchOut: ["不要在篮球高频周频繁使用。", "跟腱/髌腱 >= 3/10 时取消。"],
    relatedTerms: ["pap", "pape", "complex-training"]
  },
  {
    id: "complex-training",
    term: "Complex Training",
    fullName: "Complex Training",
    category: "jump-training",
    shortDefinition: "重力量动作后接相似爆发动作的训练方法。",
    detailedExplanation: "例如硬拉后接 CMJ，深蹲后接箱跳。目标是把力量输出转化成爆发动作。",
    whyItMattersForUser: "它比完整 French Contrast 更适合你目前篮球和弹跳训练并行的情况。",
    practicalUse: ["低剂量、低频率、状态好时做。"],
    watchOut: ["不是体能训练，不要堆量。"],
    relatedTerms: ["pap", "pape"]
  },
  {
    id: "nsf-certified-for-sport",
    term: "NSF",
    fullName: "NSF Certified for Sport",
    category: "nutrition",
    shortDefinition: "一种运动补剂第三方检测认证。",
    detailedExplanation: "该认证通常用于降低运动员误用污染补剂的风险，尤其关注违禁成分检测。",
    whyItMattersForUser: "你在选 Thorne 等高端补剂时，这类认证可以作为品牌质量参考。",
    practicalUse: ["选择补剂时可作为加分项。"],
    watchOut: ["有认证不代表补剂一定适合你，也不代表可以超量。"]
  },
  {
    id: "rdl",
    term: "RDL",
    fullName: "Romanian Deadlift",
    category: "strength-training",
    shortDefinition: "罗马尼亚硬拉，偏髋主导和腘绳肌控制的力量动作。",
    detailedExplanation:
      "RDL 主要训练髋折叠、臀腿后侧力量和腘绳肌离心控制。它不是从地面硬拉到极限重量，而是用稳定脊柱和髋部后移来加载后链。",
    whyItMattersForUser: "腘绳肌力量和髋主导能力会影响起跳、落地缓冲和右侧力量平衡。",
    practicalUse: ["常用 RPE 6-8，保持背部稳定。", "测试前或腘绳肌酸痛明显时降低或取消。"],
    watchOut: ["不要把 RDL 做成腰背代偿。", "腘绳肌高酸痛时不要硬做重 RDL。"],
    relatedTerms: ["eccentric", "rpe"]
  },
  {
    id: "hr",
    term: "HR",
    fullName: "Heart Rate",
    category: "readiness",
    shortDefinition: "心率，是每分钟心跳次数。",
    detailedExplanation:
      "HR 本身只是一个基础生理指标。训练中和恢复中都可以参考心率，但 JumpPlan 更重视个人基线、疼痛和动作质量。",
    whyItMattersForUser: "静息 HR 升高可能提示恢复不足，训练 HR 可以帮助 Zone 2 不做过头。",
    practicalUse: ["结合 RHR、HRV、睡眠和主观状态看。"],
    watchOut: ["不要只靠单个心率数字决定是否加量。"],
    relatedTerms: ["rhr", "hrv", "zone2"]
  },
  {
    id: "b6",
    term: "B6",
    fullName: "Vitamin B6",
    category: "nutrition",
    shortDefinition: "维生素 B6，常见于 ZMA 类组合补剂。",
    detailedExplanation:
      "B6 是一种维生素，和很多代谢过程有关。这里主要用于解释 ZMA 里的组成，不代表它是弹跳专项补剂。",
    whyItMattersForUser: "你实际使用的是锌和甘氨酸镁，不一定需要标准 ZMA 或额外 B6。",
    practicalUse: ["看总补剂标签，不重复堆同类营养素。"],
    watchOut: ["不要长期自行高剂量叠加 B6。"],
    relatedTerms: ["zma"]
  },
  {
    id: "anti-rotation",
    term: "抗旋转",
    fullName: "Anti-Rotation",
    category: "strength-training",
    shortDefinition: "躯干抵抗被拉转的能力。",
    detailedExplanation: "Pallof Press、单侧支撑和很多变向落地都需要抗旋转，让身体在单腿支撑时不被带歪。",
    whyItMattersForUser: "右侧支撑和右膝轨迹控制需要核心不乱转。",
    practicalUse: ["少量高质量核心训练即可。"],
    watchOut: ["不要做成长时间疲劳腹肌训练。"]
  },
  {
    id: "anti-extension",
    term: "抗伸展",
    fullName: "Anti-Extension",
    category: "strength-training",
    shortDefinition: "核心抵抗腰椎过度后仰的能力。",
    detailedExplanation: "死虫、Hollow Hold 等动作帮助你在起跳、落地和对抗时保持肋骨和骨盆位置。",
    whyItMattersForUser: "更好的躯干位置可以帮助力量传递和落地控制。",
    practicalUse: ["用短组数、可呼吸的核心训练。"],
    watchOut: ["不要憋气到影响后续弹跳。"]
  },
  {
    id: "anti-lateral-flexion",
    term: "抗侧屈",
    fullName: "Anti-Lateral Flexion",
    category: "strength-training",
    shortDefinition: "身体抵抗向一侧塌掉的能力。",
    detailedExplanation: "单侧农夫走和侧桥训练这一能力，对急停、单脚落地和空中对抗很重要。",
    whyItMattersForUser: "它能帮助右侧支撑更稳，不让躯干把膝盖带歪。",
    practicalUse: ["用 suitcase carry、side plank 等低量动作。"],
    watchOut: ["重量不要大到走路姿势变形。"]
  },
  {
    id: "overcoming-isometric",
    term: "克服式等长",
    fullName: "Overcoming Isometric",
    category: "strength-training",
    shortDefinition: "对固定物体尽力发力但不产生位移。",
    detailedExplanation: "它属于进阶高张力方法，通常需要安全架、固定 pins 或可靠设备。",
    whyItMattersForUser: "可用于特定角度发力训练，但不是当前 MVP 必需动作。",
    practicalUse: ["只在安全设置明确时使用。"],
    watchOut: ["不要用不稳定器械临时搭建。"]
  },
  {
    id: "yielding-isometric",
    term: "承让式等长",
    fullName: "Yielding Isometric",
    category: "strength-training",
    shortDefinition: "在负重或自身体重下保持位置不动。",
    detailedExplanation: "分腿蹲保持、靠墙静蹲、提踵保持都属于常见承让式等长。",
    whyItMattersForUser: "它更适合作为肌腱友好、低冲击的力量和位置控制选择。",
    practicalUse: ["20-45 秒保持，疼痛不超过 3/10。"],
    watchOut: ["尖锐疼痛时跳过。"],
    relatedTerms: ["isometric"]
  },
  {
    id: "upper-body",
    term: "上肢训练",
    fullName: "Upper Body",
    category: "strength-training",
    shortDefinition: "服务篮球对抗、抢板、摆臂和姿势控制的上肢训练。",
    detailedExplanation: "JumpPlan 里的上肢训练不是 bodybuilding，而是保持推拉平衡、肩胛控制和接触耐受。",
    whyItMattersForUser: "更好的上肢和肩胛控制能帮助抢板、空中稳定和摆臂发力。",
    practicalUse: ["每周 1-2 次，避免篮球前明显酸痛。"],
    watchOut: ["不要让上肢训练抢走恢复资源。"]
  },
  {
    id: "core-stiffness",
    term: "核心刚性",
    fullName: "Core Stiffness",
    category: "strength-training",
    shortDefinition: "起跳和落地瞬间躯干能稳定传力。",
    detailedExplanation: "核心刚性不是一直绷死，而是在需要发力或落地时能让躯干保持结构。",
    whyItMattersForUser: "它帮助下肢力量、摆臂和落地控制连接起来。",
    practicalUse: ["用抗旋转、抗伸展、抗侧屈和 carry。"],
    watchOut: ["不要做高疲劳腹肌循环。"],
    relatedTerms: ["anti-rotation", "anti-extension", "anti-lateral-flexion"]
  },
  {
    id: "single-leg-stiffness",
    term: "单腿刚性",
    fullName: "Single-Leg Stiffness",
    category: "jump-training",
    shortDefinition: "单腿支撑时，足弓、踝、膝、髋快速形成稳定支柱的能力。",
    detailedExplanation:
      "单腿刚性不是把膝盖锁死，而是在触地和发力时快速稳定，减少足弓塌陷、膝盖内扣、骨盆侧晃和力量泄漏，同时落地时仍保留正常缓冲。",
    whyItMattersForUser:
      "你的右侧单脚起跳偏弱，右脚容易外旋。提高单腿刚性可以让支撑脚更稳、触地更短、力量更容易传到地面。",
    practicalUse: ["先做静态等长和上步控制，再进阶到单脚 Pogo 和助跑单脚起跳。", "只在疼痛低、动作质量好时进阶动态动作。"],
    watchOut: ["跟腱或髌腱 >=3/10 时不做动态单腿刚性训练。", "不要同时增加跳跃强度和接触次数。"],
    relatedTerms: ["ankle-stiffness", "tripod-foot", "plant-leg", "ground-contact-time"]
  },
  {
    id: "ankle-stiffness",
    term: "踝部刚性",
    fullName: "Ankle Stiffness",
    category: "jump-training",
    shortDefinition: "踝和小腿在短触地中快速支撑并反弹的能力。",
    detailedExplanation: "踝部刚性帮助单脚起跳时减少脚踝塌陷和触地时间，但它必须建立在无痛跟腱和良好足弓控制上。",
    whyItMattersForUser: "右脚如果外旋或足弓掉下去，踝部刚性会变成代偿而不是传力。",
    practicalUse: ["用提踵等长、单脚前倾等长和低幅 Pogo 逐步建立。"],
    watchOut: ["晨起跟腱僵硬增加时，下次减少 50% 或跳过动态弹跳。"],
    relatedTerms: ["single-leg-stiffness", "ground-contact-time"]
  },
  {
    id: "plant-leg",
    term: "支撑腿",
    fullName: "Plant Leg",
    category: "jump-training",
    shortDefinition: "助跑起跳最后踩地并把力量传向地面的腿。",
    detailedExplanation: "支撑腿需要在很短时间内完成踩地、制动、稳定和向上发力。足弓、踝、膝、髋和骨盆都要协同。",
    whyItMattersForUser: "右侧支撑腿越稳定，单脚起跳越不容易把力量漏到右脚外旋、膝盖内扣或骨盆旋转里。",
    practicalUse: ["观察最后一步是否踩稳、膝盖是否对准脚尖、摆动腿是否主动提膝。"],
    watchOut: ["支撑脚控制差时不要做最大单脚起跳。"],
    relatedTerms: ["swing-leg-drive", "tripod-foot", "force-transfer"]
  },
  {
    id: "tripod-foot",
    term: "脚三点支撑",
    fullName: "Tripod Foot",
    category: "jump-training",
    shortDefinition: "脚跟、大脚趾根、小脚趾根三点稳定压地。",
    detailedExplanation: "脚三点支撑让足弓保持形状，帮助膝盖对准脚尖，并让起跳力量更稳定地通过脚传到地面。",
    whyItMattersForUser: "右脚外旋时常会丢掉大脚趾根压力，导致膝盖和骨盆连锁代偿。",
    practicalUse: ["短足、上步提膝、单脚等长和落地定住时都先找三点支撑。"],
    watchOut: ["不要用脚趾抓地代替足弓控制。"],
    relatedTerms: ["single-leg-stiffness", "ankle-stiffness"]
  },
  {
    id: "swing-leg-drive",
    term: "摆动腿驱动",
    fullName: "Swing-Leg Drive",
    category: "jump-training",
    shortDefinition: "非支撑腿主动提膝，帮助助跑单脚起跳向上转化。",
    detailedExplanation: "摆动腿提膝配合摆臂和支撑腿伸展，可以让单脚起跳更像向上发力，而不是向前冲或侧向泄力。",
    whyItMattersForUser: "右侧单脚起跳弱时，支撑腿稳定和摆动腿提膝需要一起练，不只是多跳右腿。",
    practicalUse: ["用低箱上步提膝保持和两步单脚助跑起跳练节奏。"],
    watchOut: ["摆动腿用力不应换来支撑脚外旋或膝盖内扣。"],
    relatedTerms: ["plant-leg", "force-transfer"]
  },
  {
    id: "pelvis-stability",
    term: "骨盆稳定",
    fullName: "Pelvis Stability",
    category: "strength-training",
    shortDefinition: "单腿支撑时骨盆不明显侧倾、旋转或塌陷。",
    detailedExplanation: "骨盆稳定连接髋、核心和膝盖轨迹。骨盆不稳时，单腿起跳容易向一侧漏力，右膝轨迹也更难保持。",
    whyItMattersForUser: "你的右侧力量和膝脚控制都需要骨盆稳定参与，尤其在单腿 RDL、上步提膝和单脚落地中。",
    practicalUse: ["用单腿 RDL 顶部锁定、Pallof Press、侧桥和上步提膝保持观察。"],
    watchOut: ["骨盆晃动明显时先退阶，不要加速度或加跳高。"],
    relatedTerms: ["anti-rotation", "single-leg-stiffness"]
  },
  {
    id: "ground-contact-time",
    term: "触地时间",
    fullName: "Ground Contact Time",
    category: "jump-training",
    shortDefinition: "脚接触地面的时间。",
    detailedExplanation: "单脚起跳和反应弹性需要在合适触地时间内快速稳定并发力。触地越短不一定越好，前提是落地安静、方向正确、肌腱无痛。",
    whyItMattersForUser: "如果右脚外旋、落地变响或节奏变慢，说明触地质量下降，不应继续进阶。",
    practicalUse: ["Pogo 看节奏是否轻快，两步助跑看最后一步是否短而稳。"],
    watchOut: ["疲劳时追求短触地会增加肌腱和膝盖风险。"],
    relatedTerms: ["ankle-stiffness", "single-leg-stiffness", "rsi"]
  },
  {
    id: "leverage-efficiency",
    term: "杠杆效率",
    fullName: "Leverage Efficiency",
    category: "jump-training",
    shortDefinition: "身体各关节位置能否把助跑和力量有效转成向上起跳。",
    detailedExplanation: "单脚起跳的效率来自支撑脚位置、身体前倾角度、摆动腿、摆臂和骨盆控制的组合，不是单纯多练右腿次数。",
    whyItMattersForUser: "右脚外旋和右膝轨迹问题会降低杠杆效率，让同样的力量跳不高。",
    practicalUse: ["用低箱上步提膝、前倾等长和两步单脚助跑起跳练位置。"],
    watchOut: ["动作质量差时不要用更多接触次数弥补。"],
    relatedTerms: ["plant-leg", "swing-leg-drive", "force-transfer"]
  },
  {
    id: "force-transfer",
    term: "传力",
    fullName: "Force Transfer",
    category: "jump-training",
    shortDefinition: "把下肢力量、躯干稳定和摆臂整合成起跳输出。",
    detailedExplanation: "弹跳不只是腿部单独发力。脚、膝、髋、躯干和手臂越协调，力量越容易转成向上速度。",
    whyItMattersForUser: "右侧不平衡会影响传力，所以计划里保留右脚、右膝、核心和上肢支持。",
    practicalUse: ["保持动作质量，避免疲劳后硬跳。"],
    watchOut: ["传力差时不要只靠加重量解决。"]
  },
  {
    id: "medicine-ball",
    term: "药球",
    fullName: "Medicine Ball",
    category: "strength-training",
    shortDefinition: "低量、高质量的上肢和躯干爆发工具。",
    detailedExplanation: "药球传球或砸球可以训练上肢爆发和核心传力，但不是体能消耗训练。",
    whyItMattersForUser: "它能支持摆臂、空中对抗和躯干发力协调。",
    practicalUse: ["每组少次数，速度高、动作干净。"],
    watchOut: ["腰背代偿或疲劳变形就停。"]
  },
  {
    id: "carry",
    term: "负重行走",
    fullName: "Carry",
    category: "strength-training",
    shortDefinition: "用行走训练握力、躯干张力和姿势控制。",
    detailedExplanation: "农夫走和单侧农夫走能训练全身张力、抗侧屈和肩胛稳定。",
    whyItMattersForUser: "它对篮球对抗、落地稳定和右侧支撑都有帮助。",
    practicalUse: ["短距离、姿势稳定、呼吸自然。"],
    watchOut: ["身体歪斜明显时减重。"]
  },
  {
    id: "shoulder-scapula",
    term: "肩胛控制",
    fullName: "Shoulder Scapula Control",
    category: "strength-training",
    shortDefinition: "肩胛稳定和上背控制。",
    detailedExplanation: "肩胛控制能让推、拉、抢板和空中对抗更稳定，也降低上肢动作代偿。",
    whyItMattersForUser: "上肢力量要支持篮球表现，而不是制造无意义酸痛。",
    practicalUse: ["用 band pull-apart、scapular push-up 和划船。"],
    watchOut: ["肩痛或耸肩代偿时降级。"]
  },
  {
    id: "readiness",
    term: "Readiness",
    fullName: "Daily Readiness",
    category: "readiness",
    shortDefinition: "当天训练准备状态的综合判断。",
    detailedExplanation: "Readiness 可以包含睡眠、HRV、RHR、主观能量、疼痛和动作质量。它是训练调整信号，不是强迫加量的理由。",
    whyItMattersForUser: "你用它决定今天是否按计划、减冲击、力量降级或恢复-only。",
    practicalUse: ["穿戴设备只是参考。", "疼痛和动作质量优先。"],
    watchOut: ["Oura 分数高不能覆盖跟腱或髌腱疼痛。"],
    relatedTerms: ["hrv", "rhr"]
  }
];

export const glossaryTerms = glossaryEntries;

export function getRelatedGlossaryTermsForDay(day: TrainingDay): GlossaryEntry[] {
  const text = [
    day.title,
    day.goal,
    day.phaseTitle,
    ...(day.performanceFocus ?? []),
    day.readinessRule,
    ...day.blocks.flatMap((block) => [
      block.title,
      ...block.items.flatMap((item) => [item.exerciseId, item.notes ?? ""])
    ])
  ]
    .filter(Boolean)
    .join(" ");

  return glossaryEntries.filter((entry) => {
    const terms = [entry.term, entry.fullName, entry.id].filter(Boolean) as string[];
    return terms.some((term) => text.toLowerCase().includes(term.toLowerCase()));
  });
}
