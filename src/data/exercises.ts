import type { Exercise } from "@/types/training";

const defaultVideoNote =
  "视频只作为动作参考。实际训练时以本 app 的动作要领、疼痛规则和你的身体反馈为准。";
const highImpactVideoNote =
  "视频只作为动作参考。不要直接模仿视频里的训练量；优先保证落地安静、膝盖轨迹稳定、跟腱和髌腱没有不适。";
const strengthVideoNote =
  "视频只作为动作参考。重量选择以动作质量为准，不要为了追求重量牺牲髋膝踝对齐。";
const recoveryVideoNote =
  "视频只作为动作参考。恢复动作不需要做到疼，保持温和、可控、舒服。";

const youtubeSearchQueriesByExerciseId: Record<string, string> = {
  "short-foot": "short foot exercise foot arch activation",
  "toe-yoga": "toe yoga exercise foot intrinsic muscles",
  "ankle-knee-wall": "ankle dorsiflexion knee to wall exercise",
  "worlds-greatest-stretch": "world's greatest stretch exercise",
  "low-pogo": "low pogo jumps ankle stiffness exercise",
  "cmj": "countermovement jump technique arm swing",
  "approach-jump": "basketball approach jump technique vertical jump",
  "lateral-stop-jump": "lateral deceleration to jump basketball drill",
  "bulgarian-split-squat-eccentric": "eccentric bulgarian split squat technique",
  "single-leg-calf-raise": "single leg calf raise full range technique",
  "single-leg-rdl-contralateral": "contralateral loaded single leg RDL technique",
  "trap-bar-deadlift": "trap bar deadlift technique athletic performance",
  "spanish-squat-isometric": "spanish squat isometric patellar tendon exercise",
  "foot-ball-release": "lacrosse ball foot release plantar fascia",
  "legs-up-breathing": "legs elevated breathing recovery exercise",
  "easy-walk": "easy walk active recovery workout",
  "easy-bike": "easy bike active recovery workout",
  "backward-walk": "backward walking knees rehab exercise",
  "band-lateral-walk": "mini band lateral walk glute medius exercise",
  "step-down": "step down exercise knee control technique",
  "calf-foam-roll": "calf foam rolling technique",
  "push-up": "push up technique",
  "dumbbell-bench-press": "dumbbell bench press technique",
  "one-arm-dumbbell-row": "one arm dumbbell row technique",
  "pull-up-or-lat-pulldown": "pull up lat pulldown technique",
  "landmine-press": "landmine press technique",
  "medicine-ball-chest-pass": "medicine ball chest pass power exercise",
  "medicine-ball-overhead-slam": "medicine ball overhead slam technique",
  "band-pull-apart": "band pull apart exercise technique",
  "scapular-push-up": "scapular push up technique",
  "dead-bug": "dead bug exercise technique",
  "side-plank": "side plank technique",
  "pallof-press": "Pallof press anti rotation exercise",
  "suitcase-carry": "suitcase carry exercise technique",
  "farmer-carry": "farmer carry technique",
  "hollow-body-hold": "hollow body hold technique",
  "plank-shoulder-tap": "plank shoulder tap anti rotation",
  "calf-isometric-hold": "calf raise isometric hold Achilles exercise",
  "split-squat-isometric": "split squat isometric hold",
  "wall-sit": "wall sit exercise technique",
  "mid-thigh-pull-isometric": "isometric mid thigh pull technique",
  "overcoming-isometric-squat": "overcoming isometric squat pins technique",
  "single-leg-hamstring-bridge": "single leg hamstring bridge exercise",
  "hamstring-slider-curl": "hamstring slider curl exercise technique",
  "hamstring-walkout": "hamstring walkout exercise technique",
  "single-leg-balance-reach": "single leg balance reach exercise",
  "hurdle-hop-forward-back": "forward backward hurdle hop drill",
  "lateral-hurdle-hop": "lateral hurdle hop plyometric drill",
  "single-leg-landing-stick": "single leg landing stick drill knee control",
  "single-leg-calf-isometric-hold": "single leg calf isometric hold Achilles ankle stiffness",
  "single-leg-snap-down-stick": "single leg snap down to stick landing drill",
  "step-up-knee-drive-hold": "low box step up knee drive hold single leg takeoff",
  "single-leg-rdl-top-lock": "single leg RDL top position hold knee drive",
  "single-leg-forward-lean-isometric": "single leg forward lean isometric sprint takeoff position",
  "single-leg-low-pogo": "single leg low pogo ankle stiffness exercise",
  "forward-back-single-leg-pogo": "forward backward single leg pogo ankle stiffness",
  "lateral-single-leg-pogo": "lateral single leg pogo ankle stiffness drill",
  "penultimate-step-drill": "basketball penultimate step single leg takeoff drill",
  "two-step-single-leg-approach-jump": "two step single leg approach jump technique",
  "max-single-leg-approach-jump": "single leg approach jump test technique",
  "rdl": "Romanian deadlift technique hip hinge",
  "nordic-curl": "nordic hamstring curl technique",
  "copenhagen-plank": "copenhagen plank exercise technique",
  "hip-90-90": "90 90 hip mobility exercise",
  "defensive-slide-stop": "basketball defensive slide stop drill",
  "catch-and-jump": "basketball catch and jump footwork drill",
  "second-jump-rebound-drill": "basketball second jump rebound drill"
};

function getVideoNote(exercise: Exercise) {
  if (exercise.category === "plyometric" || exercise.category === "basketball-skill") {
    return highImpactVideoNote;
  }

  if (
    exercise.category === "strength" ||
    exercise.category === "knee-tendon" ||
    exercise.category === "upper-body" ||
    exercise.category === "core" ||
    exercise.category === "isometric"
  ) {
    return strengthVideoNote;
  }

  if (exercise.category === "recovery" || exercise.category === "mobility") {
    return recoveryVideoNote;
  }

  return defaultVideoNote;
}

function supportExercise(params: Exercise): Exercise {
  return params;
}

const exerciseDefinitions: Exercise[] = [
  {
    id: "short-foot",
    nameZh: "短足训练",
    nameEn: "Short Foot",
    category: "foot-ankle",
    purpose: "训练足弓主动支撑，让脚掌在不蜷脚趾的情况下形成稳定受力平台。",
    whyForUser: "垂直起跳和落地都需要右脚足弓保持形状；足弓塌陷时，胫骨内旋和右膝内扣更容易出现。",
    instructions: ["赤脚或穿薄底鞋站立，脚跟、第一跖骨头、第五跖骨头三点压地。", "轻轻把前脚掌向脚跟方向“缩短”，让足弓微微抬起。", "脚趾保持放松贴地，不要抓地。", "保持 5–8 秒后放松，重复时维持膝盖朝第二脚趾方向。"],
    keyCues: ["三点压地", "足弓抬起一点点", "脚趾软", "膝盖对准第二脚趾"],
    commonMistakes: ["用脚趾抓地代替足弓发力", "外侧脚掌承重过多", "膝盖跟着向内掉", "憋气或全身僵硬"],
    regressions: ["坐姿练习", "双脚站姿扶墙练习"],
    progressions: ["单脚站姿短足", "短足保持下做小幅半蹲"],
    painRules: ["足底抽筋时降低用力到 30–40%。", "足弓或跟腱疼痛超过 3/10 时停止当天单脚版本。"]
  },
  {
    id: "toe-yoga",
    nameZh: "脚趾瑜伽",
    nameEn: "Toe Yoga",
    category: "foot-ankle",
    purpose: "提升大脚趾和小脚趾分离控制，改善前脚掌稳定性。",
    whyForUser: "起跳最后离地需要大脚趾稳定传力；脚趾控制差时，右脚容易外翻或足弓塌陷。",
    instructions: ["坐姿或站姿，脚掌三点均匀压地。", "抬起大脚趾，其他四趾保持贴地。", "换成大脚趾贴地，抬起其他四趾。", "动作慢，避免脚踝翻动。"],
    keyCues: ["脚掌不离地", "脚踝安静", "慢抬慢放", "不要抓地"],
    commonMistakes: ["整只脚跟着翻动", "为了抬脚趾而失去足弓", "动作太快", "小腿前侧过度紧张"],
    regressions: ["用手辅助按住不动的脚趾", "坐姿练习"],
    progressions: ["站姿练习", "短足保持下做脚趾瑜伽"],
    painRules: ["脚趾关节刺痛时减少幅度。", "足底筋膜疼痛时改为轻柔活动，不做长时间保持。"]
  },
  {
    id: "ankle-knee-wall",
    nameZh: "踝背屈膝触墙",
    nameEn: "Knee-to-Wall Ankle Mobilization",
    category: "mobility",
    purpose: "改善踝关节背屈，让膝盖前移时脚跟仍能稳定压地。",
    whyForUser: "踝背屈不足会让落地时膝盖内扣或脚跟提前抬起，影响下蹲蓄力和安全落地。",
    instructions: ["面对墙站弓步，前脚距离墙约 5–10 厘米。", "脚跟压地，膝盖朝第二脚趾方向慢慢碰墙。", "碰到墙后停 1 秒，再回到起点。", "逐渐调整距离，保持无痛范围。"],
    keyCues: ["脚跟重", "膝盖走直线", "足弓不塌", "慢慢推"],
    commonMistakes: ["脚跟抬起", "膝盖向内绕", "前脚外八太多", "用疼痛换距离"],
    regressions: ["缩短脚到墙的距离", "坐姿弹力带踝背屈活动"],
    progressions: ["增加停留时间", "训练后加入负重弓步踝活动"],
    painRules: ["跟腱夹挤感明显时减小幅度。", "膝前疼痛超过 3/10 时停止并改做小幅活动。"]
  },
  {
    id: "worlds-greatest-stretch",
    nameZh: "世界最佳伸展",
    nameEn: "World's Greatest Stretch",
    category: "mobility",
    purpose: "同时打开髋屈肌、内收肌、胸椎旋转和踝背屈。",
    whyForUser: "更好的髋和踝活动度能让起跳前的下沉更顺，减少右膝用错误角度代偿。",
    instructions: ["进入长弓步，前脚全脚掌压地，后膝可离地或轻触地。", "同侧手肘向前脚内侧靠近，停 1 秒。", "胸口向前腿方向旋转，手臂打开指向天花板。", "回到起点后换边，保持呼吸。"],
    keyCues: ["前脚踩稳", "髋向下沉", "胸椎旋转", "不要塌腰"],
    commonMistakes: ["前脚内侧离地", "腰椎硬拧", "膝盖向内倒", "动作赶得太快"],
    regressions: ["后膝着地", "手放瑜伽砖或椅子上"],
    progressions: ["加入后腿主动伸直", "每次旋转顶部停 2–3 秒"],
    painRules: ["髋前夹痛时缩短弓步。", "膝盖压痛时垫软垫或改站姿髋活动。"]
  },
  {
    id: "low-pogo",
    nameZh: "低幅 Pogo 弹跳",
    nameEn: "Low Pogo Hops",
    category: "plyometric",
    purpose: "用低冲击反复弹跳训练踝部刚性和快速离地。",
    whyForUser: "Pogo 能培养跟腱和小腿的弹性反应，但量要低，避免跟腱或髌腱被高频刺激过度。",
    instructions: ["双脚与髋同宽站立，膝盖微弯，身体高。", "用前脚掌轻弹离地，跳高只需几厘米。", "落地后立刻安静反弹，脚跟可轻触地但不要重砸。", "每组保持节奏一致，感觉变重就停止。"],
    keyCues: ["轻、快、低", "身体高", "膝盖不内扣", "脚下安静"],
    commonMistakes: ["跳太高", "膝盖弯太多变成深蹲跳", "落地声音大", "疲劳后硬撑"],
    regressions: ["原地提踵节奏练习", "扶墙低幅弹跳"],
    progressions: ["单脚低幅 Pogo", "前后小幅 Pogo"],
    painRules: ["跟腱晨僵当天不增加组数。", "跟腱或髌腱疼痛达到 3/10 时立刻停止弹跳。"]
  },
  {
    id: "cmj",
    nameZh: "反向纵跳",
    nameEn: "Countermovement Jump",
    category: "plyometric",
    purpose: "训练从快速下沉到垂直发力的协调和爆发输出。",
    whyForUser: "这是垂直弹跳的核心模式；重点是低量高质量，同时检查右膝轨迹和落地控制。",
    instructions: ["双脚站稳，手臂自然准备。", "快速下沉到舒适深度，足弓保持，膝盖朝脚尖。", "用脚踝、膝、髋同时伸展向上跳。", "落地时安静吸收，膝盖继续对准第二脚趾。"],
    keyCues: ["下沉快", "向地面发力", "膝盖走正", "落地安静"],
    commonMistakes: ["下蹲太深太慢", "起跳时右膝内扣", "脚跟过早离地", "每次都拼到动作变形"],
    regressions: ["亚最大反向跳", "无手臂反向跳"],
    progressions: ["少量最大反向跳", "带助跑前的反向跳对比"],
    painRules: ["髌腱疼痛超过 3/10 时取消最大努力。", "落地无法保持膝盖轨迹时结束本组。"]
  },
  {
    id: "approach-jump",
    nameZh: "助跑摸高跳",
    nameEn: "Approach Jump",
    category: "basketball-skill",
    purpose: "把弹跳能力转化到篮球常见的助跑起跳节奏。",
    whyForUser: "篮球中的最高跳通常来自助跑节奏；训练重点是倒数两步、脚弓稳定和右膝不塌。",
    instructions: ["从 2–3 步助跑开始，速度只到 70–85%。", "倒数第二步稍长，最后一步快速踩稳。", "起跳脚全脚掌受力，膝盖对准脚尖。", "向上摸目标，落地后保持 2 秒稳定。"],
    keyCues: ["倒二长、最后快", "踩稳再起", "向上不是向前", "落地定住"],
    commonMistakes: ["助跑太快导致刹不住", "最后一步脚外翻", "身体过度前冲", "落地马上走掉"],
    regressions: ["原地或一步助跑摸高", "只练倒数两步节奏"],
    progressions: ["增加到 4 步助跑", "接球后助跑起跳"],
    painRules: ["膝前痛或跟腱不适当天只做 70% 技术跳。", "任何一次落地失控后减少速度或停止。"]
  },
  {
    id: "lateral-stop-jump",
    nameZh: "侧向急停起跳",
    nameEn: "Lateral Stop Jump",
    category: "basketball-skill",
    purpose: "训练侧向移动后的刹车、膝盖对线和重新垂直起跳。",
    whyForUser: "篮球转化需要从横移进入起跳；这个动作能暴露右膝内扣和落地刹车问题。",
    instructions: ["从小幅侧滑或跨步开始，速度控制在 60–75%。", "外侧脚踩稳刹车，髋向后坐一点。", "膝盖对准第二脚趾，足弓保持。", "停稳后向上小跳或中等强度起跳，落地定住。"],
    keyCues: ["先刹住", "髋向后", "膝盖别掉进去", "小量高质量"],
    commonMistakes: ["横向速度太快", "用膝盖硬顶刹车", "脚掌塌陷", "跳完落地歪掉"],
    regressions: ["侧向跨步定住不跳", "低强度侧向停步"],
    progressions: ["加入接球", "提高到 80% 速度但减少次数"],
    painRules: ["膝内侧或髌腱疼痛时取消起跳，只练停步。", "右膝无法对线时降低速度。"]
  },
  {
    id: "bulgarian-split-squat-eccentric",
    nameZh: "保加利亚分腿蹲慢下",
    nameEn: "Eccentric Bulgarian Split Squat",
    category: "strength",
    purpose: "用单腿模式强化股四头肌、臀肌和髌腱可控负荷。",
    whyForUser: "单腿力量和慢速离心能帮助右膝在起跳下沉和落地时保持轨迹。",
    instructions: ["后脚放在凳子上，前脚踩稳三点。", "用 3 秒慢慢下降，膝盖朝第二脚趾。", "到底部停 1 秒，前脚发力站起。", "保持躯干略前倾，髋和膝共同工作。"],
    keyCues: ["三秒下", "前脚踩满", "膝盖走正", "站起不弹"],
    commonMistakes: ["前脚太近导致膝前挤压", "右膝内扣", "下去很快", "用后脚蹬太多"],
    regressions: ["普通分腿蹲", "扶墙分腿蹲"],
    progressions: ["持哑铃", "底部停 2 秒"],
    painRules: ["髌腱疼痛超过 3/10 时减小深度或改西班牙深蹲等长。", "动作后疼痛第二天升高则下次减量。"]
  },
  {
    id: "single-leg-calf-raise",
    nameZh: "单腿提踵",
    nameEn: "Single-Leg Calf Raise",
    category: "strength",
    purpose: "提升小腿和跟腱的慢速力量容量。",
    whyForUser: "更好的小腿容量能支持弹跳训练，但需要逐步加载来保护跟腱。",
    instructions: ["单脚站在平地或台阶边，手轻扶保持平衡。", "用 2 秒抬高脚跟，到最高点停 1 秒。", "用 2–3 秒下降，保持足弓和膝盖方向。", "全程不要借身体晃动。"],
    keyCues: ["大脚趾根压地", "慢上慢下", "脚跟走直线", "顶端停一下"],
    commonMistakes: ["脚踝向外翻", "用弹震完成", "下降太快", "做到抽筋还继续"],
    regressions: ["双腿提踵", "坐姿提踵"],
    progressions: ["手持负重", "台阶上增加离心幅度"],
    painRules: ["跟腱晨僵明显时改双腿版本。", "跟腱疼痛超过 3/10 时停止负重版本。"]
  },
  {
    id: "single-leg-rdl-contralateral",
    nameZh: "对侧负重单腿罗马尼亚硬拉",
    nameEn: "Contralateral Single-Leg RDL",
    category: "strength",
    purpose: "训练单腿髋主导力量、足弓控制和骨盆稳定。",
    whyForUser: "髋控制不足时右膝更容易内扣；对侧负重会要求足弓和臀中肌一起稳定。",
    instructions: ["右脚站稳，左手持轻哑铃或壶铃。", "髋向后折叠，后腿自然向后伸，脊柱保持长。", "重量沿站立腿前外侧下降到小腿中段。", "用臀后侧发力回到站立，骨盆保持水平。"],
    keyCues: ["髋向后", "骨盆像车灯朝地", "足弓撑住", "膝盖微弯"],
    commonMistakes: ["弯腰找地", "骨盆打开", "站立脚塌陷", "膝盖锁死"],
    regressions: ["手扶墙单腿 RDL", "B-stance RDL"],
    progressions: ["增加负重", "底部停 2 秒"],
    painRules: ["下背疼痛时缩短幅度并减重。", "足底或膝内侧不稳时改扶墙版本。"]
  },
  {
    id: "trap-bar-deadlift",
    nameZh: "陷阱杠硬拉",
    nameEn: "Trap Bar Deadlift",
    category: "strength",
    purpose: "用相对友好的姿势训练髋膝伸展力量和全身发力。",
    whyForUser: "垂直跳需要髋、膝、踝协同伸展；陷阱杠可以作为低冲击力量刺激。",
    instructions: ["站在陷阱杠中央，脚掌三点压地。", "髋向后坐，握住把手，胸口保持打开。", "推地站起，膝盖和脚尖同向。", "顶端站高但不后仰，再控制放回地面。"],
    keyCues: ["推地", "背长", "膝盖对脚尖", "杠走直线"],
    commonMistakes: ["起拉时背圆", "膝盖内扣", "顶端后仰", "重量太重影响速度"],
    regressions: ["壶铃硬拉", "高把手陷阱杠硬拉"],
    progressions: ["中等负重多组低次数", "速度硬拉但保持技术"],
    painRules: ["下背或膝痛时减重并提高把手。", "疲劳导致膝盖内扣时结束本组。"]
  },
  {
    id: "spanish-squat-isometric",
    nameZh: "西班牙深蹲等长",
    nameEn: "Spanish Squat Isometric",
    category: "knee-tendon",
    purpose: "给髌腱和股四头肌提供可控等长负荷。",
    whyForUser: "当髌腱敏感时，它可以作为低冲击替代，帮助维持膝伸力量感觉。",
    instructions: ["弹力带或固定带绕在膝后，身体向后坐形成张力。", "双脚与髋同宽，躯干直立。", "下蹲到无痛角度，胫骨尽量接近垂直。", "保持 20–45 秒，呼吸稳定。"],
    keyCues: ["坐到带子里", "躯干高", "膝盖对脚尖", "疼痛可控"],
    commonMistakes: ["带子位置太低", "膝盖内扣", "蹲太深引发痛", "憋气"],
    regressions: ["缩短保持时间", "减小下蹲角度"],
    progressions: ["增加保持时间", "手持轻重量"],
    painRules: ["疼痛应保持在 0–3/10。", "做完后疼痛明显加重则下次减少角度或时间。"]
  },
  {
    id: "foot-ball-release",
    nameZh: "足底球放松",
    nameEn: "Foot Ball Release",
    category: "recovery",
    purpose: "降低足底软组织紧张，改善脚掌触地感。",
    whyForUser: "足底过紧会影响足弓控制和前脚掌发力，但放松应温和，不追求疼痛。",
    instructions: ["坐姿或站姿轻踩按摩球。", "从脚跟前方慢慢滚到前脚掌，不压骨点。", "在紧张点停 10–20 秒并缓慢呼吸。", "每只脚 1–2 分钟即可。"],
    keyCues: ["舒服的压力", "慢滚", "避开刺痛点", "滚完再站稳"],
    commonMistakes: ["压到很痛", "滚太久导致酸胀", "只滚足弓不检查站立感觉", "站姿用全体重硬压"],
    regressions: ["坐姿轻压", "用更软的球"],
    progressions: ["站姿增加一点压力", "滚完接短足训练"],
    painRules: ["麻木、刺痛或足底痛加重时停止。", "足底筋膜急性疼痛当天只做轻触。"]
  },
  {
    id: "legs-up-breathing",
    nameZh: "靠墙抬腿呼吸",
    nameEn: "Legs-Up Breathing",
    category: "recovery",
    purpose: "用低强度呼吸和抬腿姿势帮助身体从训练兴奋状态降下来。",
    whyForUser: "恢复质量会影响肌腱反应和第二天弹跳表现；这个动作适合晚间恢复。",
    instructions: ["仰卧，双腿放在墙上或椅子上。", "骨盆自然放松，腰背不需要用力压地。", "鼻吸 3–4 秒，慢慢呼气 5–6 秒。", "持续 3–6 分钟，注意肩颈放松。"],
    keyCues: ["慢呼气", "肩膀软", "下巴微收", "不要憋气"],
    commonMistakes: ["把腿伸得太直导致后侧紧张", "用力压腰", "呼吸太急", "边刷手机边做"],
    regressions: ["小腿放椅子上", "侧卧呼吸"],
    progressions: ["延长呼气时间", "加入轻柔脚踝泵"],
    painRules: ["腰不舒服时改小腿垫高。", "腿麻时降低高度或结束动作。"]
  },
  {
    id: "easy-walk",
    nameZh: "轻松步行",
    nameEn: "Easy Walk",
    category: "recovery",
    purpose: "用低强度循环促进恢复而不增加冲击负担。",
    whyForUser: "恢复日保持轻微活动能帮助小腿和肌腱感觉更好，同时不消耗弹跳训练资源。",
    instructions: ["选择平地，速度保持能轻松说话。", "步幅自然，不刻意大步。", "脚掌安静落地，右膝自然向前。", "结束后做 2–3 分钟轻柔活动度。"],
    keyCues: ["能聊天", "步子轻", "肩膀放松", "不追速度"],
    commonMistakes: ["走成快走训练", "上坡太多", "疼痛时硬撑距离", "穿不合适的鞋"],
    regressions: ["分成两段短走", "室内原地轻走"],
    progressions: ["延长到 30–40 分钟", "加入少量鼻呼吸"],
    painRules: ["跟腱或髌腱疼痛增加时缩短时间。", "疼痛改变步态时停止。"]
  },
  {
    id: "easy-bike",
    nameZh: "轻松骑车",
    nameEn: "Easy Bike",
    category: "recovery",
    purpose: "用低冲击有氧活动促进循环，同时避免给跟腱和髌腱增加跳跃负担。",
    whyForUser: "当今天不适合跳跃或篮球冲击时，轻松骑车可以保留一点 Zone 2 循环刺激。它不能证明你已经恢复，也不会神奇消除疲劳，只是帮助你用更低风险的方式活动身体。强度应该轻到能完整说话，膝盖轨迹保持顺畅。",
    instructions: [
      "把座椅调到踩到底时膝盖仍有轻微弯曲。",
      "先用很轻阻力骑 3–5 分钟热身。",
      "保持能完整说话的速度和阻力。",
      "膝盖朝脚尖方向，不要左右晃。",
      "结束前降低阻力轻松骑 2 分钟。"
    ],
    keyCues: ["能说话", "阻力轻", "膝盖走直线", "脚踝放松", "不冲刺"],
    commonMistakes: [
      "把恢复骑成高强度间歇。",
      "阻力太大导致膝前侧顶痛。",
      "座椅太低让膝盖过度弯曲。",
      "为了出汗硬加时间。"
    ],
    regressions: ["缩短到 8–10 分钟", "改轻松步行", "只做呼吸和活动度"],
    progressions: ["延长到 25–35 分钟", "保持鼻呼吸节奏", "加入非常轻的高踏频段"],
    painRules: [
      "膝前疼痛超过 3/10 时降低阻力或停止。",
      "跟腱或小腿紧张增加时缩短时间。",
      "任何刺痛、麻木或疼痛加重都不要硬撑。"
    ]
  },
  {
    id: "backward-walk",
    nameZh: "倒走",
    nameEn: "Backward Walk",
    category: "knee-tendon",
    purpose: "用低冲击方式训练股四头肌耐受和膝关节控制。",
    whyForUser: "倒走常用于膝前侧敏感时的恢复刺激，可帮助维持膝伸功能而不做高冲击跳。",
    instructions: ["在安全平地或关闭的跑步机上进行。", "小步向后走，脚尖先轻触，再全脚掌过渡。", "膝盖保持朝脚尖，不要内扣。", "保持可控速度，眼睛定期确认环境。"],
    keyCues: ["小步", "慢速", "膝盖走正", "安全第一"],
    commonMistakes: ["步子太大", "速度太快", "低头一直看脚", "在拥挤环境做"],
    regressions: ["扶栏倒走", "原地后撤步"],
    progressions: ["轻微上坡倒走", "增加到 8–10 分钟"],
    painRules: ["膝痛超过 3/10 时降低坡度和速度。", "不安全场地不要做。"]
  },
  {
    id: "band-lateral-walk",
    nameZh: "弹力带侧走",
    nameEn: "Band Lateral Walk",
    category: "hip",
    purpose: "激活臀中肌，提升髋外展和膝盖对线控制。",
    whyForUser: "臀中肌控制不足会让右膝在起跳和落地时内扣；侧走是简单的热身激活动作。",
    instructions: ["弹力带套在膝上或脚踝，双脚与髋同宽。", "轻微屈髋屈膝，足弓保持。", "向侧方小步移动，后脚跟上但不并拢。", "每一步都保持膝盖对准脚尖。"],
    keyCues: ["小步", "髋发力", "脚掌平", "膝盖别塌"],
    commonMistakes: ["身体左右晃", "脚尖外八太多", "膝盖被带子拉进去", "步子过大"],
    regressions: ["带子放膝上", "减少步数"],
    progressions: ["带子放脚踝", "加入侧向停步"],
    painRules: ["髋外侧刺痛时减小阻力。", "膝盖不适时把带子移到膝上。"]
  },
  {
    id: "step-down",
    nameZh: "台阶下放",
    nameEn: "Step Down",
    category: "knee-tendon",
    purpose: "训练单腿离心控制和膝盖在脚掌上的稳定轨迹。",
    whyForUser: "它直接对应落地吸收和变向刹车，对右膝内扣控制很有价值。",
    instructions: ["站在低台阶上，工作脚全脚掌踩稳。", "另一只脚脚跟向地面轻点，身体慢慢下降。", "工作腿膝盖朝第二脚趾，髋保持水平。", "轻点后用工作腿站回起点。"],
    keyCues: ["慢下", "膝盖对二趾", "髋水平", "脚掌踩满"],
    commonMistakes: ["台阶太高", "膝盖突然内扣", "骨盆掉一边", "用摆动腿蹬地"],
    regressions: ["降低台阶高度", "手扶墙"],
    progressions: ["增加下降时间", "手持轻重量"],
    painRules: ["髌腱疼痛超过 3/10 时降低高度。", "无法控制右膝轨迹时停止本组。"]
  },
  {
    id: "calf-foam-roll",
    nameZh: "小腿泡沫轴放松",
    nameEn: "Calf Foam Roll",
    category: "recovery",
    purpose: "用轻到中等压力改善小腿触感和放松感，但不把泡沫轴当成必须完成的恢复任务。",
    whyForUser: "小腿紧张会影响踝背屈和落地缓冲，但泡沫轴不是越痛越有效。尤其在重离心力量训练、高冲击弹跳、PAP 或测试日之后，小腿和肌腱周围组织已经承受了负荷，深压可能增加局部刺激或主观酸痛。目标是让你滚完感觉更轻、更安静，而不是更痛或更发炎。",
    instructions: [
      "坐在地上，把泡沫轴放在小腿肌肉肚下方，不要压在跟腱上。",
      "用手和另一条腿分担体重，先找到 2–4/10 的轻压力。",
      "沿小腿肌肉缓慢移动，避开膝关节、骨点、瘀青和尖锐疼痛区域。",
      "力量日可用 3–5/10，最多不要超过 6/10；跳跃、PAP、测试或恢复日保持 2–4/10。",
      "力量日每个肌群 45–60 秒；跳跃、PAP 或测试日每个肌群 30–45 秒即可。",
      "滚完站起来走几步，确认小腿感觉更轻、更平静，而不是更痛。"
    ],
    keyCues: [
      "可选，不是必做。",
      "轻到中等压力。",
      "滚肌肉，不滚跟腱。",
      "避开膝盖和骨点。",
      "不追求疼痛。",
      "滚完应该更轻更安静。"
    ],
    commonMistakes: [
      "把泡沫轴当成每天必须完成的任务。",
      "训练后用很深压力硬压小腿。",
      "直接压跟腱、髌腱、膝关节或骨性突起。",
      "压在瘀青、刺痛或 sharp pain 区域。",
      "滚到局部更痛、更热或第二天更僵。",
      "每个点停太久，导致组织更敏感。"
    ],
    regressions: [
      "减少体重压力，只用很轻的接触。",
      "用按摩棒轻扫小腿肌肉。",
      "只做轻松步行和靠墙抬腿呼吸。",
      "当天跳过泡沫轴。"
    ],
    progressions: [
      "在无痛和低敏感时延长到建议时长上限。",
      "力量日使用 3–5/10 的中等压力。",
      "放松后接踝背屈膝触墙。",
      "放松后做短足训练重新建立足弓控制。"
    ],
    painRules: [
      "不要直接滚跟腱、髌腱、膝关节、骨性突起、瘀青组织或尖锐疼痛点。",
      "如果疼痛超过 3/10、越来越痛、出现刺痛或麻木，立即停止。",
      "重离心力量或高冲击弹跳后只用轻到中等压力，不做疼痛深压。",
      "如果第二天跟腱晨僵或髌腱敏感增加，下次压力和时长减少 50% 或直接跳过。",
      "泡沫轴应让你感觉更轻、更平静；如果更痛或更发炎，就不是合适剂量。"
    ]
  },
  supportExercise({
    id: "push-up",
    nameZh: "俯卧撑",
    nameEn: "Push-Up",
    category: "upper-body",
    purpose: "训练上肢推力、躯干张力和肩胛控制。",
    whyForUser: "篮球弹跳不只靠下肢，抢篮板、对抗、摆臂和空中稳定都需要上肢和核心参与。俯卧撑是低设备基础动作。",
    instructions: ["双手略宽于肩，身体从头到脚保持直线。", "先轻微推开地面，让肩胛稳定。", "肘部约 30–45 度向后下降，胸口接近地面。", "推起时保持肋骨收住，不塌腰。"],
    keyCues: ["身体一条线", "肘不过度外展", "肩胛稳定", "肋骨收住"],
    commonMistakes: ["塌腰", "耸肩", "肘部完全打开", "为了数量牺牲深度和控制"],
    regressions: ["手扶高台俯卧撑", "跪姿俯卧撑"],
    progressions: ["脚抬高俯卧撑", "负重俯卧撑"],
    painRules: ["肩前侧刺痛时缩小幅度或改高台版本。", "手腕不适时用俯卧撑把手或哑铃握把。"]
  }),
  supportExercise({
    id: "dumbbell-bench-press",
    nameZh: "哑铃卧推",
    nameEn: "Dumbbell Bench Press",
    category: "upper-body",
    purpose: "训练上肢水平推力和肩部稳定。",
    whyForUser: "稳定的上肢推力能提升对抗、护球和空中身体控制，但剂量要服务篮球和弹跳，不追求胸肌疲劳。",
    instructions: ["仰卧凳上，脚踩稳地面。", "肩胛轻轻后收下沉，哑铃从胸侧下降。", "前臂接近垂直，推起时不耸肩。", "保留 1–3 次余力，不做到力竭。"],
    keyCues: ["肩胛稳", "前臂直", "脚踩稳", "不力竭"],
    commonMistakes: ["哑铃下放太深导致肩前顶痛", "推起时耸肩", "腰过度拱起", "训练到影响篮球投篮手感"],
    regressions: ["地板哑铃卧推", "俯卧撑"],
    progressions: ["增加重量", "慢速离心"],
    painRules: ["肩痛超过 3/10 时停止。", "比赛或高强度篮球前避免做到明显酸痛。"]
  }),
  supportExercise({
    id: "one-arm-dumbbell-row",
    nameZh: "单臂哑铃划船",
    nameEn: "One-Arm Dumbbell Row",
    category: "upper-body",
    purpose: "训练背部拉力、肩胛控制和左右上肢平衡。",
    whyForUser: "更好的背部拉力和肩胛控制有助于对抗、篮板卡位和摆臂回收，也能平衡推的训练量。",
    instructions: ["一手一膝或一手扶凳支撑，背部保持长。", "先让肩胛向后下方移动，再把肘拉向髋部。", "顶部停 1 秒，慢慢放下。", "躯干不要旋转借力。"],
    keyCues: ["肘拉向髋", "肩胛后下", "背长", "不扭身"],
    commonMistakes: ["耸肩", "用身体甩重量", "肘拉太高变成肩后侧代偿", "下背塌陷"],
    regressions: ["弹力带划船", "胸托划船"],
    progressions: ["增加重量", "底部停顿再拉"],
    painRules: ["下背不适时改胸托版本。", "肩夹痛时减小幅度并降低重量。"]
  }),
  supportExercise({
    id: "pull-up-or-lat-pulldown",
    nameZh: "引体向上 / 高位下拉",
    nameEn: "Pull-Up / Lat Pulldown",
    category: "upper-body",
    purpose: "训练上肢拉力和背阔肌力量，支持篮球对抗和姿势控制。",
    whyForUser: "上肢拉力帮助篮板、对抗和身体姿势控制。选择不会让肩肘过度酸痛的版本即可。",
    instructions: ["选择引体或高位下拉，握距略宽于肩。", "先下沉肩胛，再把肘向身体两侧拉。", "胸口保持打开，不用脖子去够。", "控制回到起点。"],
    keyCues: ["肩胛先动", "肘向下", "胸口打开", "不耸肩"],
    commonMistakes: ["用下巴硬够杆", "身体乱摆", "肩膀耸到耳朵", "下降失控"],
    regressions: ["弹力带辅助引体", "高位下拉"],
    progressions: ["减少辅助", "负重引体"],
    painRules: ["肩肘疼痛时改中立握或高位下拉。", "不要做到影响投篮和篮球对抗。"]
  }),
  supportExercise({
    id: "landmine-press",
    nameZh: "地雷管推举",
    nameEn: "Landmine Press",
    category: "upper-body",
    purpose: "训练斜向推力、核心稳定和肩部友好的上肢力量。",
    whyForUser: "斜向推举更接近篮球中的对抗和伸展方向，同时比完全过顶推举更容易控制肩部。",
    instructions: ["杠铃一端固定，另一端握在肩前。", "双脚站稳，肋骨收住。", "沿斜上方推起，顶部不要耸肩。", "慢慢回到肩前。"],
    keyCues: ["肋骨收住", "斜上推", "肩不耸", "核心稳"],
    commonMistakes: ["后仰借力", "腰椎代偿", "推到肩前侧疼", "重量过重"],
    regressions: ["半跪姿地雷管推", "哑铃上斜推"],
    progressions: ["站姿单臂地雷管推", "加入轻微髋转动但保持控制"],
    painRules: ["肩痛时降低重量或改俯卧撑。", "腰背代偿明显时改半跪姿。"]
  }),
  supportExercise({
    id: "medicine-ball-chest-pass",
    nameZh: "药球胸前传球",
    nameEn: "Medicine Ball Chest Pass",
    category: "upper-body",
    purpose: "训练上肢爆发和核心传力。",
    whyForUser: "低量药球爆发能帮助摆臂、对抗和上肢发力速度，但不应制造疲劳。",
    instructions: ["双手持药球在胸前，脚踩稳。", "肋骨收住，快速向墙或伙伴传出。", "每次传球后重新站稳。", "保持低次数高质量。"],
    keyCues: ["快而干净", "核心稳", "脚踩地", "每次重置"],
    commonMistakes: ["做成有氧循环", "腰背后仰", "药球太重", "传到动作变慢还继续"],
    regressions: ["轻药球胸前传", "站姿弹力带快速推"],
    progressions: ["分腿站姿传球", "轻微侧向步传球"],
    painRules: ["肩肘不适时减重或跳过。", "篮球前不要做到上肢酸胀。"]
  }),
  supportExercise({
    id: "medicine-ball-overhead-slam",
    nameZh: "药球过顶砸球",
    nameEn: "Medicine Ball Overhead Slam",
    category: "upper-body",
    purpose: "训练上肢和躯干协同爆发，但不能做到腰背代偿。",
    whyForUser: "这个动作可以训练从上肢到核心的快速传力，对篮板和对抗有帮助，但必须低量、干净。",
    instructions: ["双手持药球举到头上，肋骨保持收住。", "用上肢和躯干协同向地面砸球。", "髋膝自然弯曲吸收，不要用腰硬折。", "每次重置姿势。"],
    keyCues: ["肋骨下沉", "快砸", "髋膝吸收", "低量高质"],
    commonMistakes: ["腰椎过伸再猛弯", "药球太重", "做太多导致疲劳", "肩痛还继续"],
    regressions: ["胸前传球", "轻药球砸球"],
    progressions: ["半跪姿砸球", "轻量反应式砸球"],
    painRules: ["腰背或肩部不适时停止。", "测试或篮球前不要做到疲劳。"]
  }),
  supportExercise({
    id: "band-pull-apart",
    nameZh: "弹力带拉开",
    nameEn: "Band Pull-Apart",
    category: "upper-body",
    purpose: "训练肩胛后缩和上背激活。",
    whyForUser: "上背激活有助于姿势、肩胛控制和上肢力量平衡，适合恢复日轻量使用。",
    instructions: ["双手握弹力带，手臂抬到胸前。", "肩膀放松，向两侧拉开弹力带。", "肩胛轻轻向后收，停 1 秒。", "慢慢回到起点。"],
    keyCues: ["肩不耸", "上背发力", "慢回", "肋骨收"],
    commonMistakes: ["耸肩", "腰后仰", "弹力太大", "只用手臂甩"],
    regressions: ["减少弹力", "降低手臂高度"],
    progressions: ["增加停顿", "斜向拉开"],
    painRules: ["肩前侧疼痛时减小幅度。", "颈部紧张明显时停止。"]
  }),
  supportExercise({
    id: "scapular-push-up",
    nameZh: "肩胛俯卧撑",
    nameEn: "Scapular Push-Up",
    category: "upper-body",
    purpose: "训练肩胛控制，帮助上肢支撑和推力稳定。",
    whyForUser: "肩胛稳定能让上肢推、拉和对抗更稳，也有助于俯卧撑和药球动作质量。",
    instructions: ["进入高位平板支撑。", "手肘保持伸直，胸口轻轻下沉让肩胛靠近。", "再推开地面，让肩胛分开。", "全程保持肋骨和骨盆稳定。"],
    keyCues: ["手肘直", "肩胛滑动", "推开地面", "核心稳"],
    commonMistakes: ["弯肘变俯卧撑", "塌腰", "耸肩", "动作太快"],
    regressions: ["跪姿肩胛俯卧撑", "墙上肩胛推"],
    progressions: ["脚抬高版本", "顶部停 2 秒"],
    painRules: ["手腕或肩痛时改墙上版本。", "颈部紧张时降低次数。"]
  }),
  supportExercise({
    id: "dead-bug",
    nameZh: "死虫",
    nameEn: "Dead Bug",
    category: "core",
    purpose: "训练核心抗伸展，帮助起跳和落地时躯干保持稳定。",
    whyForUser: "躯干稳定能让下肢力量更好传到起跳，同时减少落地时腰椎和右膝代偿。",
    instructions: ["仰卧，髋膝 90 度，手臂指向天花板。", "轻轻收肋骨，让腰背保持稳定。", "对侧手脚慢慢伸远，再回到起点。", "全程保持呼吸。"],
    keyCues: ["肋骨下沉", "慢伸", "腰不拱", "能呼吸"],
    commonMistakes: ["动作太快", "腰离地明显", "憋气", "腿伸太低导致失控"],
    regressions: ["只动手臂", "只动脚跟点地"],
    progressions: ["手持轻球", "弹力带死虫"],
    painRules: ["腰不舒服时缩小幅度。", "无法呼吸时降低难度。"]
  }),
  supportExercise({
    id: "side-plank",
    nameZh: "侧桥",
    nameEn: "Side Plank",
    category: "core",
    purpose: "训练侧向核心稳定，支持单腿落地和急停变向。",
    whyForUser: "侧向稳定不足时，右膝和骨盆更容易在单腿支撑、急停和落地时掉线。",
    instructions: ["侧卧，肘在肩下，双腿伸直或屈膝。", "抬起髋部，让身体成一直线。", "保持骨盆不向前后翻。", "用鼻吸气、慢呼气维持张力。"],
    keyCues: ["髋抬高", "身体直", "不旋转", "慢呼吸"],
    commonMistakes: ["髋掉下去", "肩耸", "身体转开", "憋气硬撑"],
    regressions: ["屈膝侧桥", "短时间多组"],
    progressions: ["上腿抬起", "Copenhagen plank"],
    painRules: ["肩痛时缩短时间或改屈膝。", "腰侧抽痛时停止。"]
  }),
  supportExercise({
    id: "pallof-press",
    nameZh: "Pallof Press 抗旋转推",
    nameEn: "Pallof Press",
    category: "core",
    purpose: "训练抗旋转能力，帮助右侧单腿支撑和篮球变向。",
    whyForUser: "抗旋转能力让躯干在变向、急停和单腿发力时不乱转，帮助右膝保持轨迹。",
    instructions: ["侧对弹力带固定点站立，双手握带在胸前。", "脚踩稳，肋骨收住。", "双手向前推出，抵抗身体被拉转。", "停 1 秒后回到胸前。"],
    keyCues: ["骨盆正", "肋骨收", "手向前", "身体不转"],
    commonMistakes: ["身体跟着转", "耸肩", "腰后仰", "阻力太大"],
    regressions: ["靠近固定点", "半跪姿"],
    progressions: ["远离固定点", "分腿站姿"],
    painRules: ["腰背不适时降低阻力。", "肩不舒服时缩短推出距离。"]
  }),
  supportExercise({
    id: "suitcase-carry",
    nameZh: "单侧农夫走",
    nameEn: "Suitcase Carry",
    category: "core",
    purpose: "训练抗侧屈、握力和躯干稳定。",
    whyForUser: "单侧负重能暴露左右稳定差异，帮助右侧支撑、落地和对抗时保持身体不歪。",
    instructions: ["单手拿哑铃或壶铃，身体站高。", "肋骨和骨盆保持正，不向负重侧歪。", "小步稳定向前走。", "换边重复，比较左右控制。"],
    keyCues: ["站高", "不歪", "小步", "握紧"],
    commonMistakes: ["身体倾斜", "耸肩", "步子太大", "重量太重"],
    regressions: ["原地站立保持", "减轻重量"],
    progressions: ["增加距离", "底部停顿转身"],
    painRules: ["腰背不适时减重或停止。", "握力失败前结束。"]
  }),
  supportExercise({
    id: "farmer-carry",
    nameZh: "农夫走",
    nameEn: "Farmer Carry",
    category: "core",
    purpose: "训练全身张力、握力和躯干稳定。",
    whyForUser: "全身张力和姿势控制对篮球对抗、篮板和力量传递都有帮助，同时疲劳成本可控。",
    instructions: ["双手各拿一只哑铃或壶铃。", "站高，肩膀放松下沉。", "小步稳定行走，保持呼吸。", "结束时安全放下重量。"],
    keyCues: ["站高", "肩放松", "步子稳", "能呼吸"],
    commonMistakes: ["耸肩", "身体前倾", "重量过重", "拖着脚走"],
    regressions: ["减轻重量", "缩短距离"],
    progressions: ["增加距离", "单侧农夫走"],
    painRules: ["腰背或肩痛时减重。", "不要做到影响第二天投篮和抓握。"]
  }),
  supportExercise({
    id: "hollow-body-hold",
    nameZh: "Hollow Body Hold",
    nameEn: "Hollow Body Hold",
    category: "core",
    purpose: "训练核心抗伸展和躯干控制。",
    whyForUser: "更好的核心抗伸展能帮助起跳和落地时保持身体刚性，但不需要做到腹部力竭。",
    instructions: ["仰卧，轻轻收肋骨和骨盆。", "抬起肩胛和双腿到能控制的位置。", "保持腰背稳定贴近地面。", "短时间保持并呼吸。"],
    keyCues: ["肋骨收", "腰稳", "短而稳", "不憋气"],
    commonMistakes: ["腰拱起", "腿放太低", "脖子紧", "保持太久导致失控"],
    regressions: ["屈膝保持", "单腿伸直"],
    progressions: ["手臂过头", "轻微 rocking"],
    painRules: ["腰不舒服时立即降级。", "颈部紧张时支撑头部或停止。"]
  }),
  supportExercise({
    id: "plank-shoulder-tap",
    nameZh: "平板支撑摸肩",
    nameEn: "Plank Shoulder Tap",
    category: "core",
    purpose: "训练核心抗旋转和肩部支撑。",
    whyForUser: "抗旋转支撑能帮助急停、单腿落地和上肢对抗时身体不乱晃。",
    instructions: ["进入高位平板支撑，双脚略宽。", "慢慢抬一只手摸对侧肩。", "骨盆尽量不左右晃。", "左右交替，保持呼吸。"],
    keyCues: ["骨盆稳", "慢摸肩", "推开地面", "不憋气"],
    commonMistakes: ["髋大幅摇摆", "塌腰", "摸得太快", "手腕疼还硬撑"],
    regressions: ["双脚更宽", "手扶高台"],
    progressions: ["双脚更窄", "增加停顿"],
    painRules: ["手腕或肩痛时改高台版本。", "腰不稳时降低次数。"]
  }),
  supportExercise({
    id: "calf-isometric-hold",
    nameZh: "提踵等长保持",
    nameEn: "Calf Isometric Hold",
    category: "isometric",
    purpose: "训练小腿和跟腱可控负荷，作为低冲击跟腱容量维护。",
    whyForUser: "当不适合弹跳时，提踵等长可以用更低冲击的方式保留小腿和跟腱负荷感觉。",
    instructions: ["选择双腿或单腿版本。", "抬到中高位提踵位置。", "保持 20–45 秒，脚踝不外翻。", "慢慢放下，观察跟腱反应。"],
    keyCues: ["中高位", "脚踝正", "稳定呼吸", "疼痛可控"],
    commonMistakes: ["顶到极限抽筋", "脚踝外翻", "硬撑尖锐痛", "保持时间过长"],
    regressions: ["双腿版本", "扶墙减重"],
    progressions: ["单腿版本", "手持轻重量"],
    painRules: ["不能有尖锐跟腱痛。", "跟腱晨僵 > 3/10 时用双腿版本或跳过。"]
  }),
  supportExercise({
    id: "split-squat-isometric",
    nameZh: "分腿蹲等长保持",
    nameEn: "Split Squat Isometric",
    category: "isometric",
    purpose: "训练下肢位置控制、股四头肌和髌腱可控负荷。",
    whyForUser: "分腿蹲等长能帮助右膝轨迹和髌腱耐受，适合作为动态力量或跳跃的低冲击替代。",
    instructions: ["进入分腿蹲姿势，前脚三点踩稳。", "下降到无痛角度。", "保持 20–40 秒，膝盖对准第二脚趾。", "站起后换边。"],
    keyCues: ["前脚踩满", "膝盖走正", "髋稳定", "疼痛可控"],
    commonMistakes: ["前脚太近", "膝盖内扣", "蹲太深顶痛", "憋气"],
    regressions: ["缩短保持时间", "扶墙辅助"],
    progressions: ["手持轻重量", "增加保持时间"],
    painRules: ["髌腱疼痛超过 3/10 时减小角度或停止。", "第二天敏感升高则下次减量。"]
  }),
  supportExercise({
    id: "wall-sit",
    nameZh: "靠墙静蹲",
    nameEn: "Wall Sit",
    category: "isometric",
    purpose: "训练股四头肌等长耐受和膝关节位置控制。",
    whyForUser: "靠墙静蹲是简单可控的膝伸等长选择，可在恢复或降级训练中保留一点股四头肌负荷。",
    instructions: ["背靠墙，脚在身体前方。", "下滑到无痛角度。", "膝盖对准脚尖，保持 20–45 秒。", "用手扶墙慢慢站起。"],
    keyCues: ["膝盖走正", "无痛角度", "脚踩稳", "慢呼吸"],
    commonMistakes: ["蹲太深", "膝盖内扣", "脚太近", "硬撑疼痛"],
    regressions: ["更高角度", "缩短时间"],
    progressions: ["增加时间", "手持轻重量"],
    painRules: ["膝前痛超过 3/10 时停止。", "不要为了燃烧感硬撑。"]
  }),
  supportExercise({
    id: "mid-thigh-pull-isometric",
    nameZh: "大腿中段等长拉",
    nameEn: "Isometric Mid-Thigh Pull",
    category: "isometric",
    purpose: "训练高张力发力位置和全身用力协调。",
    whyForUser: "这是进阶等长力量选择，只有在安全固定设置下才考虑，用来练习全身张力而不是日常必须项目。",
    instructions: ["只在固定架、固定杠或专业设备安全可靠时做。", "站到大腿中段拉力位置。", "逐渐发力到目标强度，保持 2–5 秒。", "完全放松后再重复。"],
    keyCues: ["安全固定", "逐渐发力", "全身绷紧", "短时间"],
    commonMistakes: ["临时找不安全设备", "猛拉", "腰背代偿", "做太多组"],
    regressions: ["陷阱杠硬拉速度组", "农夫走"],
    progressions: ["提高发力意图", "更精确角度设置"],
    painRules: ["没有安全设置就不做。", "腰背、膝或跟腱不适时跳过。"]
  }),
  supportExercise({
    id: "overcoming-isometric-squat",
    nameZh: "克服式深蹲等长",
    nameEn: "Overcoming Isometric Squat",
    category: "isometric",
    purpose: "训练特定角度的高张力发力。",
    whyForUser: "这是进阶选项，可能帮助特定角度发力，但不是 MVP 必需；安全设置比训练刺激更重要。",
    instructions: ["只在固定安全销或专业架上做。", "站到目标深蹲角度，脚掌三点踩稳。", "逐渐向固定销发力 2–5 秒。", "放松并检查膝盖轨迹。"],
    keyCues: ["固定安全", "脚掌三点", "膝盖走正", "短时间"],
    commonMistakes: ["设备不安全", "猛顶", "膝盖内扣", "疲劳后继续"],
    regressions: ["分腿蹲等长", "靠墙静蹲"],
    progressions: ["改变角度", "提高发力意图"],
    painRules: ["没有安全固定设置就不做。", "肌腱疼痛或动作变形时停止。"]
  }),
  supportExercise({
    id: "single-leg-hamstring-bridge",
    nameZh: "单腿腘绳肌桥",
    nameEn: "Single-Leg Hamstring Bridge",
    category: "strength",
    purpose: "激活腘绳肌和臀部后链，帮助起跳髋伸展和落地控制。",
    whyForUser: "右侧力量不平衡和腘绳肌不足会影响起跳下沉、髋伸展和膝盖控制，这个动作疲劳成本低。",
    instructions: ["仰卧，一脚踩地，另一腿抬起。", "脚跟压地，把髋部抬起。", "顶部停 1 秒，感受臀部和腘绳肌。", "慢慢放下，不用腰顶。"],
    keyCues: ["脚跟压地", "髋抬起", "肋骨收", "慢下"],
    commonMistakes: ["用腰顶", "脚离身体太远导致抽筋", "骨盆旋转", "做太快"],
    regressions: ["双腿桥", "短杠杆单腿桥"],
    progressions: ["脚跟放高", "增加停顿"],
    painRules: ["腘绳肌抽筋时缩短距离。", "腰背不适时改双腿版本。"]
  }),
  supportExercise({
    id: "hamstring-slider-curl",
    nameZh: "腘绳肌滑盘弯曲",
    nameEn: "Hamstring Slider Curl",
    category: "strength",
    purpose: "训练腘绳肌离心和膝屈力量。",
    whyForUser: "腘绳肌强度支持冲跳、刹车和膝关节控制，但要避免在测试前制造过大酸痛。",
    instructions: ["仰卧，脚跟踩滑盘或毛巾。", "抬起髋部，慢慢把脚跟滑远。", "在可控范围内拉回。", "保持骨盆稳定。"],
    keyCues: ["髋保持高", "慢滑远", "脚跟拉回", "骨盆稳"],
    commonMistakes: ["髋掉下去", "离心太快", "抽筋后硬撑", "测试前做太多"],
    regressions: ["只做离心滑远", "双腿版本"],
    progressions: ["单腿离心", "增加慢速时间"],
    painRules: ["腘绳肌拉扯痛时停止。", "测试前 48 小时不做高强度版本。"]
  }),
  supportExercise({
    id: "hamstring-walkout",
    nameZh: "腘绳肌走出",
    nameEn: "Hamstring Walkout",
    category: "strength",
    purpose: "用低到中等强度激活腘绳肌，维持后链感觉。",
    whyForUser: "恢复日和测试前需要一点腘绳肌激活，但不能制造离心酸痛；走出比 Nordic 更温和。",
    instructions: ["仰卧做臀桥。", "脚跟一步一步向外走。", "走到能控制的位置后再走回。", "髋部尽量保持稳定。"],
    keyCues: ["小步", "髋不掉", "慢走", "不抽筋"],
    commonMistakes: ["步子太大", "髋掉下去", "走太远", "做成力竭"],
    regressions: ["双腿桥保持", "缩短距离"],
    progressions: ["增加步数", "顶部停顿"],
    painRules: ["腘绳肌抽筋或刺痛时停止。", "测试前只做轻量。"]
  }),
  supportExercise({
    id: "single-leg-balance-reach",
    nameZh: "单腿平衡触地",
    nameEn: "Single-Leg Balance Reach",
    category: "foot-ankle",
    purpose: "训练右脚三点支撑、髋控制和膝盖轨迹。",
    whyForUser: "右脚外旋和右膝轨迹问题常在单腿支撑中暴露，这个动作能低冲击地检查和修正。",
    instructions: ["单脚站稳，脚跟、第一和第五跖骨头压地。", "另一脚向前或斜前方轻触地。", "工作腿膝盖对准第二脚趾。", "慢慢回到站立。"],
    keyCues: ["三点踩地", "膝盖走正", "髋稳定", "慢触地"],
    commonMistakes: ["足弓塌陷", "右脚外旋失控", "膝盖内扣", "身体歪倒"],
    regressions: ["手扶墙", "缩短触地距离"],
    progressions: ["多方向触地", "轻负重"],
    painRules: ["膝或足底疼痛超过 3/10 时停止。", "无法保持足弓时降低难度。"]
  }),
  supportExercise({
    id: "hurdle-hop-forward-back",
    nameZh: "前后跨栏小跳",
    nameEn: "Forward/Backward Hurdle Hop",
    category: "plyometric",
    purpose: "低到中等剂量训练前后方向反应弹性。",
    whyForUser: "反应弹性有助于篮球二次起跳和脚踝刚性，但总量必须控制，跟腱反应优先。",
    instructions: ["使用低障碍或地面线。", "双脚轻跳过线再跳回。", "保持低幅、安静、快速。", "每组在质量下降前停止。"],
    keyCues: ["低幅", "脚下安静", "身体高", "膝盖不塌"],
    commonMistakes: ["障碍太高", "落地声音大", "疲劳后硬撑", "膝盖内扣"],
    regressions: ["原地低 pogo", "跨线步伐"],
    progressions: ["轻微提高障碍", "减少触地时间"],
    painRules: ["跟腱或髌腱不适时取消。", "落地变重时停止。"]
  }),
  supportExercise({
    id: "lateral-hurdle-hop",
    nameZh: "侧向跨栏小跳",
    nameEn: "Lateral Hurdle Hop",
    category: "plyometric",
    purpose: "训练侧向反应弹性和髋膝踝对齐。",
    whyForUser: "篮球急停、横移和二次起跳需要侧向控制；这个动作必须低量高质量。",
    instructions: ["站在低障碍或线的一侧。", "双脚侧向轻跳过去再回来。", "保持脚掌安静，膝盖对准脚尖。", "每组结束前保留质量。"],
    keyCues: ["侧向轻", "膝盖正", "足弓撑", "不追数量"],
    commonMistakes: ["跳太高", "身体左右甩", "右膝内扣", "落地声音大"],
    regressions: ["侧向跨步定住", "低幅侧向 pogo"],
    progressions: ["低栏", "单次反应跳"],
    painRules: ["跟腱或髌腱 >= 3/10 时取消。", "右膝轨迹失控时停止。"]
  }),
  supportExercise({
    id: "single-leg-landing-stick",
    nameZh: "单腿落地定住",
    nameEn: "Single-Leg Landing Stick",
    category: "plyometric",
    purpose: "训练单腿落地控制、足弓支撑和右膝轨迹。",
    whyForUser: "右侧落地质量直接影响弹跳训练安全和篮球急停表现；低量定住比疲劳跳更有价值。",
    instructions: ["从小幅双脚或单脚起跳开始。", "落到单腿后定住 2 秒。", "脚掌三点踩稳，膝盖对准第二脚趾。", "每次都重置。"],
    keyCues: ["落地定住", "膝盖走正", "足弓撑", "安静"],
    commonMistakes: ["落地后晃动", "膝盖内扣", "脚外旋失控", "连续做成疲劳"],
    regressions: ["台阶下放", "小幅跨步定住"],
    progressions: ["增加起跳距离", "侧向落地"],
    painRules: ["疼痛或落地失控时停止。", "跟腱/髌腱 >= 3/10 时跳过。"]
  }),
  supportExercise({
    id: "single-leg-calf-isometric-hold",
    nameZh: "单脚提踵等长保持",
    nameEn: "Single-Leg Calf Isometric Hold",
    category: "isometric",
    purpose: "训练单脚足踝刚性、小腿持续张力和跟腱可控负荷，为单脚起跳提供稳定的末端支撑。",
    whyForUser:
      "单脚起跳需要支撑脚在很短时间内保持稳定，避免脚踝塌陷和力量从足弓、膝盖或骨盆处泄掉。这个动作可以先建立右侧足踝的静态支撑能力，再进阶到单脚 Pogo 和助跑单脚起跳。",
    instructions: [
      "扶墙或扶固定物站立。",
      "单脚站立，脚跟、大脚趾根、小脚趾根保持三点支撑。",
      "缓慢提踵到中高位。",
      "保持脚跟垂直向上，不向内或向外偏。",
      "保持 20–40 秒，正常呼吸。",
      "缓慢放下并完全重置。"
    ],
    keyCues: ["大脚趾根压地。", "脚跟直上直下。", "足弓保持。", "膝盖对准第二、三脚趾。", "身体不要左右晃。"],
    commonMistakes: ["重心滚到脚外侧。", "右脚明显外旋。", "脚跟向内或向外偏。", "用脚趾抓地。", "为了时间忍着尖锐跟腱疼痛。"],
    regressions: ["双脚提踵等长保持。", "扶墙单脚低位保持。", "缩短到 10–20 秒。"],
    progressions: ["增加到 40–45 秒。", "手持轻哑铃。", "顶部加入轻微摆动腿提膝。", "进阶到单脚低幅 Pogo。"],
    painRules: ["跟腱晨僵或疼痛 >=3/10 时改双脚版本或跳过。", "出现尖锐跟腱、足底或小腿疼痛时停止。", "第二天晨僵明显增加时，下次减少时间或组数。"],
    glossaryTermIds: ["single-leg-stiffness", "ankle-stiffness", "tripod-foot", "plant-leg"],
    trackingFields: ["durationSec", "painScore", "rightFootControl", "rightKneeTracking", "rpe"],
    progressionCriteria: ["疼痛 <=1–2/10。", "右脚控制 >=4/5。", "右膝轨迹 >=4/5。", "骨盆稳定 >=4/5。"],
    regressionCriteria: ["跟腱或髌腱症状 >=3/10。", "右脚控制 <=2/5。", "右脚外旋变明显。", "第二天晨僵增加。"]
  }),
  supportExercise({
    id: "single-leg-snap-down-stick",
    nameZh: "单腿快速下沉定住",
    nameEn: "Single-Leg Snap Down to Stick",
    category: "plyometric",
    purpose: "训练单腿快速建立全腿刚性，并在落地瞬间控制足弓、膝盖和骨盆。",
    whyForUser:
      "你的右脚容易外旋、右侧发力偏弱。这个动作可以在低跳跃高度下观察右脚落地角度、右膝轨迹和骨盆稳定，比直接做最大单腿跳更容易控制。",
    instructions: [
      "先从双脚站立或脚尖轻提开始。",
      "快速向下进入单腿支撑位。",
      "落到目标腿后，髋和膝轻微弯曲吸收冲击。",
      "保持足弓和脚三点支撑。",
      "定住 2–3 秒。",
      "每次完全重置后再做下一次。"
    ],
    keyCues: ["快下沉，稳住。", "落地声音轻。", "膝盖对准脚尖。", "骨盆保持水平。", "右脚不要外八逃避。"],
    commonMistakes: ["膝盖锁死。", "落地过深变成单腿深蹲。", "右脚外旋。", "膝盖内扣。", "落地后晃动很大仍继续做。"],
    regressions: ["双脚 Snap Down 定住。", "跨步到单腿定住。", "扶墙单腿下沉定住。"],
    progressions: ["小幅跳起后单腿落地定住。", "侧向小跳到单腿定住。", "低箱跳深单腿落地，仅在动作稳定后。"],
    painRules: ["跟腱或髌腱疼痛 >=3/10 时取消。", "落地无法安静或膝盖明显内扣时退阶。", "不要为了增加高度牺牲落地质量。"],
    glossaryTermIds: ["single-leg-stiffness", "tripod-foot", "pelvis-stability", "plant-leg"],
    trackingFields: ["landingQuality", "rightFootExternalRotation", "rightKneeTracking", "pelvisStability", "holdTwoSeconds", "painScore"],
    progressionCriteria: ["落地安静。", "定住 2 秒。", "右脚外旋没有增加。", "右膝轨迹 >=4/5。"],
    regressionCriteria: ["落地质量 <=2/5。", "右脚控制 <=2/5。", "右膝轨迹 <=2/5。", "动作变慢、变响或疼痛出现。"]
  }),
  supportExercise({
    id: "step-up-knee-drive-hold",
    nameZh: "低箱上步提膝保持",
    nameEn: "Low Box Step-Up Knee Drive Hold",
    category: "strength",
    purpose: "训练支撑腿髋膝踝协同伸展、摆动腿驱动和单腿顶部稳定。",
    whyForUser:
      "这个动作与单脚起跳的发力位置接近，但冲击比实际跳跃低。它可以帮助右侧在脚三点支撑、膝盖对线和骨盆稳定的前提下完成向上发力。",
    instructions: [
      "一只脚完整踩在低箱上。",
      "前脚保持脚三点支撑。",
      "身体轻微前倾，核心稳定。",
      "用箱上的腿把身体推上去。",
      "对侧膝盖快速向上提。",
      "顶部提踵并保持 1–2 秒。",
      "缓慢下放并完全重置。"
    ],
    keyCues: ["前脚推箱。", "后脚不偷力。", "摆动腿主动提膝。", "顶部站高、站稳。", "膝盖不内扣。"],
    commonMistakes: ["箱子太高。", "后脚蹬地太多。", "右脚外旋。", "顶部身体歪向一侧。", "为了速度失去控制。"],
    regressions: ["普通低箱上步。", "扶墙上步提膝。", "降低箱高。"],
    progressions: ["手持轻哑铃。", "增加顶部停顿。", "低箱上步提膝跳。", "与倒数第二步技术连接。"],
    painRules: ["髌腱疼痛 >=3/10 时降低箱高或改等长分腿蹲。", "右脚或右膝控制不住时停止加重量。", "不要把后脚蹬地当作主要动力。"],
    glossaryTermIds: ["plant-leg", "swing-leg-drive", "force-transfer", "tripod-foot"],
    trackingFields: ["weight", "reps", "rpe", "rightFootControl", "rightKneeTracking", "topPositionStability"],
    progressionCriteria: ["顶部稳定 >=4/5。", "右脚控制 >=4/5。", "右膝轨迹 >=4/5。", "髌腱反应安静。"],
    regressionCriteria: ["髌腱疼痛 >=3/10。", "顶部身体歪斜明显。", "后脚蹬地变成主要动力。", "右脚外旋增加。"]
  }),
  supportExercise({
    id: "single-leg-rdl-top-lock",
    nameZh: "单腿 RDL 顶部锁定",
    nameEn: "Single-Leg RDL with Top Position Lock",
    category: "strength",
    purpose: "训练单腿后侧链、髋稳定、骨盆抗旋转和顶部支撑能力。",
    whyForUser:
      "单脚起跳效率不仅取决于小腿，还依赖臀肌、腘绳肌和骨盆能否在单腿支撑时稳定传力。这个动作可以改善右侧髋控制，减少起跳时骨盆旋转和身体向左侧转移。",
    instructions: [
      "单脚站立，支撑脚保持三点支撑。",
      "髋向后推，躯干向前倾。",
      "非支撑腿向后延伸。",
      "保持骨盆朝向地面，不打开。",
      "支撑腿臀部和腘绳肌发力回到站立。",
      "顶部提膝或保持单腿站立 1–2 秒。",
      "完全稳定后开始下一次。"
    ],
    keyCues: ["髋向后。", "骨盆保持正。", "脚三点支撑。", "回到顶部后站稳。", "右脚不要外旋。"],
    commonMistakes: ["骨盆打开。", "右膝内扣。", "下背代偿。", "回到顶部时失去平衡。", "重量太大导致动作旋转。"],
    regressions: ["Kickstand RDL。", "扶墙单腿 RDL。", "徒手单腿髋铰链。"],
    progressions: ["对侧手持哑铃。", "增加顶部提膝。", "底部停顿 1 秒。", "与上步提膝保持组合。"],
    painRules: ["腰部或腘绳肌出现尖锐疼痛时停止。", "右脚控制不住时降低重量。", "腘绳肌酸痛 >=4/10 时改轻量或跳过。"],
    glossaryTermIds: ["anti-rotation", "pelvis-stability", "force-transfer", "tripod-foot"],
    trackingFields: ["weight", "reps", "rpe", "rightFootControl", "pelvisStability", "balanceQuality"],
    progressionCriteria: ["骨盆稳定 >=4/5。", "右脚控制 >=4/5。", "顶部能稳定 1–2 秒。", "腘绳肌无明显酸痛。"],
    regressionCriteria: ["腘绳肌酸痛 >=4/10。", "腰部刺痛。", "骨盆打开或身体旋转明显。", "右脚控制 <=2/5。"]
  }),
  supportExercise({
    id: "single-leg-forward-lean-isometric",
    nameZh: "单脚前倾等长支撑",
    nameEn: "Single-Leg Forward-Lean Isometric",
    category: "isometric",
    purpose: "训练助跑单脚起跳接地角度下的足踝、膝髋和躯干稳定。",
    whyForUser:
      "单脚助跑起跳时，支撑腿需要在轻微前倾和较短触地时间内快速建立稳定。这个动作可以低冲击地练习接地姿势和整条腿的支撑刚性。",
    instructions: [
      "单脚站立，另一脚轻轻离地。",
      "身体从脚踝开始轻微前倾。",
      "支撑膝轻微弯曲。",
      "保持脚三点支撑和足弓。",
      "骨盆保持水平，躯干保持一条线。",
      "保持 15–25 秒。"
    ],
    keyCues: ["从脚踝前倾，不是弯腰。", "脚掌压稳。", "膝盖对准脚尖。", "骨盆不转。", "身体像一个稳定支柱。"],
    commonMistakes: ["腰部前屈。", "脚跟抬起过多。", "右脚外旋。", "膝盖内扣。", "身体左右晃动。"],
    regressions: ["扶墙单脚前倾保持。", "双脚分腿站姿前倾保持。", "缩短保持时间。"],
    progressions: ["增加摆动腿提膝。", "加入双臂上摆位置。", "进阶到低速度单脚起跳节奏练习。"],
    painRules: ["跟腱、足底或膝盖出现尖锐疼痛时停止。", "无法保持脚三点支撑时退阶。"],
    glossaryTermIds: ["single-leg-stiffness", "plant-leg", "ankle-stiffness", "ground-contact-time"],
    trackingFields: ["durationSec", "rightFootControl", "rightKneeTracking", "pelvisStability", "painScore"],
    progressionCriteria: ["脚三点支撑稳定。", "骨盆稳定 >=4/5。", "右膝轨迹 >=4/5。", "保持后第二天无晨僵增加。"],
    regressionCriteria: ["跟腱、足底或膝盖刺痛。", "无法从脚踝前倾。", "右脚外旋明显。", "身体左右晃动。"]
  }),
  supportExercise({
    id: "single-leg-low-pogo",
    nameZh: "单脚低幅 Pogo",
    nameEn: "Single-Leg Low Pogo",
    category: "plyometric",
    purpose: "把静态单腿刚性转化为低幅动态足踝反应能力。",
    whyForUser:
      "单脚起跳需要支撑脚快速、安静、短触地。这个动作只用低幅、低接触次数练节奏，帮助右侧从等长支撑过渡到动态起跳。",
    instructions: [
      "扶墙或自由单脚站立，先建立脚三点支撑。",
      "用很低的幅度轻弹离地。",
      "每侧从 2 组 x 6–8 次接触开始。",
      "组间充分休息，不做连续疲劳跳。",
      "节奏变慢、落地变响或右脚外旋增加时停止。"
    ],
    keyCues: ["安静落地。", "触地短。", "脚三点支撑。", "膝微弯。", "右脚不向外转。"],
    commonMistakes: ["跳太高。", "连续跳到疲劳。", "膝盖锁死。", "重心滚到脚外侧。", "节奏慢了还硬撑。"],
    regressions: ["双脚低幅 Pogo。", "扶墙踝弹。", "提踵等长保持。"],
    progressions: ["前后单脚 Pogo。", "侧向单脚 Pogo。", "稳定耐受后再做低栏单脚跳。"],
    painRules: ["跟腱晨僵 >=3/10 时取消。", "出现髌腱、小腿、足底或跟腱尖锐痛时取消。", "第二天晨僵增加时，下次减少 50% 接触次数或跳过。"],
    glossaryTermIds: ["single-leg-stiffness", "ankle-stiffness", "ground-contact-time", "tripod-foot"],
    trackingFields: ["jumpContacts", "landingQuietness", "contactRhythm", "rightFootExternalRotation", "painScore"],
    progressionCriteria: ["落地安静。", "接触节奏保持快速。", "第二天跟腱晨僵没有增加。", "右脚外旋没有增加。"],
    regressionCriteria: ["肌腱症状 >=3/10。", "落地质量 <=2/5。", "右脚控制 <=2/5。", "节奏变慢或声音变重。"]
  }),
  supportExercise({
    id: "forward-back-single-leg-pogo",
    nameZh: "前后单脚 Pogo",
    nameEn: "Forward/Back Single-Leg Pogo",
    category: "plyometric",
    purpose: "在单脚低幅 Pogo 稳定后，小幅加入前后方向的足踝反应控制。",
    whyForUser:
      "单脚起跳和篮球脚步需要支撑脚在轻微前后位移中仍保持足弓、膝盖和骨盆稳定。这个动作只作为进阶，不是当前每周必做项目。",
    instructions: ["先完成单脚低幅 Pogo 热身。", "用很小幅度向前、向后轻弹。", "每组 4–6 次总接触即可。", "每次保持右脚不外旋、落地安静。"],
    keyCues: ["幅度小。", "触地轻。", "脚三点。", "右膝走正。", "节奏不变慢。"],
    commonMistakes: ["向前跳太远。", "右脚外旋。", "落地声音变大。", "连续跳到疲劳。"],
    regressions: ["单脚低幅 Pogo。", "提踵等长保持。", "单脚前倾等长支撑。"],
    progressions: ["侧向单脚 Pogo。", "低栏单脚跳。", "两步单脚助跑起跳。"],
    painRules: ["跟腱或髌腱 >=3/10 时取消。", "篮球高负荷后 24 小时内不做。", "第二天晨僵增加时下次减半或跳过。"],
    glossaryTermIds: ["single-leg-stiffness", "ankle-stiffness", "ground-contact-time", "tripod-foot"],
    trackingFields: ["jumpContacts", "landingQuietness", "contactRhythm", "rightFootExternalRotation", "painScore"],
    progressionCriteria: ["单脚低幅 Pogo 落地安静。", "右脚控制 >=4/5。", "接触节奏稳定。", "没有第二天跟腱晨僵增加。"],
    regressionCriteria: ["肌腱症状 >=3/10。", "右脚外旋 >=2。", "落地质量 <=2/5。", "节奏变慢。"]
  }),
  supportExercise({
    id: "lateral-single-leg-pogo",
    nameZh: "侧向单脚 Pogo",
    nameEn: "Lateral Single-Leg Pogo",
    category: "plyometric",
    purpose: "在单脚刚性稳定后，低量训练侧向小幅反应和膝脚对线。",
    whyForUser:
      "篮球横移和急停会给右脚、右膝和髋部侧向挑战。这个动作只有在静态和前后动态质量稳定后才使用。",
    instructions: ["从单脚站稳开始。", "向左右小幅轻弹，幅度只需几厘米。", "每组 4–6 次总接触。", "每组后完全休息并检查右脚角度。"],
    keyCues: ["小幅侧移。", "膝盖对脚尖。", "骨盆平。", "落地安静。", "不追数量。"],
    commonMistakes: ["跳幅太大。", "膝盖内扣。", "骨盆左右甩。", "疲劳后继续。"],
    regressions: ["侧向跨步定住。", "单脚低幅 Pogo。", "单腿快速下沉定住。"],
    progressions: ["低栏侧向单脚跳。", "侧向停步到起跳。", "篮球急停转化。"],
    painRules: ["跟腱、髌腱、足底或膝盖刺痛时停止。", "右膝轨迹 <=2/5 时取消。"],
    glossaryTermIds: ["single-leg-stiffness", "pelvis-stability", "ground-contact-time", "tripod-foot"],
    trackingFields: ["jumpContacts", "landingQuietness", "contactRhythm", "rightKneeTracking", "pelvisStability", "painScore"],
    progressionCriteria: ["前后单脚 Pogo 稳定。", "右膝轨迹 >=4/5。", "骨盆稳定 >=4/5。", "肌腱反应安静。"],
    regressionCriteria: ["落地声音变重。", "膝盖内扣。", "骨盆晃动明显。", "肌腱症状 >=3/10。"]
  }),
  supportExercise({
    id: "penultimate-step-drill",
    nameZh: "倒数第二步技术练习",
    nameEn: "Penultimate Step Drill",
    category: "basketball-skill",
    purpose: "训练助跑单脚起跳前的倒数第二步节奏、身体角度和支撑腿准备。",
    whyForUser:
      "单脚起跳效率不只看最后一步。倒数第二步如果过大、过重或身体失控，最后支撑脚容易外旋、右膝更难对线。",
    instructions: ["用 50–70% 速度助跑 2–3 步。", "倒数第二步保持可控，不要跨太大。", "最后一步踩稳后可以只定住，不一定起跳。", "每次记录右脚角度和右膝轨迹。"],
    keyCues: ["倒二步可控。", "最后一步踩稳。", "身体向上组织。", "右脚不外八。", "先质量后高度。"],
    commonMistakes: ["倒数第二步过大。", "身体向前冲。", "最后一步外旋。", "为了跳高忽略膝盖轨迹。"],
    regressions: ["上步提膝保持。", "单脚前倾等长支撑。", "走步节奏不跳。"],
    progressions: ["两步单脚助跑起跳。", "加入摸高目标。", "测试日低次数最大尝试。"],
    painRules: ["跟腱或髌腱 >=3/10 时不做起跳版本。", "右膝轨迹 <=2/5 时只做走步定住。"],
    glossaryTermIds: ["plant-leg", "swing-leg-drive", "leverage-efficiency", "force-transfer"],
    trackingFields: ["rightFootExternalRotation", "rightKneeTracking", "pelvisStability", "takeoffLeg", "painScore"],
    progressionCriteria: ["最后一步脚三点稳定。", "右膝轨迹 >=4/5。", "前 24–48 小时无高篮球负荷。", "热身感觉轻快。"],
    regressionCriteria: ["右脚外旋 >=2。", "右膝轨迹 <=2/5。", "助跑节奏变重。", "肌腱症状 >=3/10。"]
  }),
  supportExercise({
    id: "two-step-single-leg-approach-jump",
    nameZh: "两步单脚助跑起跳",
    nameEn: "Two-Step Single-Leg Approach Jump",
    category: "basketball-skill",
    purpose: "把支撑腿刚性、摆动腿提膝和摆臂整合到低量单脚起跳。",
    whyForUser:
      "这是单脚起跳转化动作，不是体能训练。它帮助你把右脚三点支撑、右膝轨迹和摆动腿驱动放进真实助跑节奏。",
    instructions: [
      "从两步慢速助跑开始。",
      "倒数第二步保持身体可控，最后一步脚三点踩稳。",
      "摆动腿主动提膝，双臂配合上摆。",
      "起跳强度先控制在 75–85%。",
      "每次落地后完全重置，记录右脚角度和右膝轨迹。"
    ],
    keyCues: ["最后一步踩稳。", "摆动腿主动提。", "向上跳。", "落地安静。", "右脚不外八。"],
    commonMistakes: ["为了跳高牺牲支撑脚角度。", "倒数第二步过大。", "右膝内扣。", "连续做成疲劳跳。", "高篮球负荷后还硬测。"],
    regressions: ["上步提膝保持。", "单脚前倾等长支撑。", "70% 技术起跳。"],
    progressions: ["提高到 85–90%。", "加入摸高目标。", "测试日做正式单脚起跳尝试。"],
    painRules: ["跟腱或髌腱 >=3/10 时取消。", "右膝轨迹 <=2/5 时取消最大版本。", "前 24–48 小时篮球负荷高时不做最大起跳。"],
    glossaryTermIds: ["plant-leg", "swing-leg-drive", "force-transfer", "leverage-efficiency"],
    trackingFields: ["jumpContacts", "takeoffLeg", "jumpHeightCm", "reachHeightCm", "rightFootExternalRotation", "rightKneeTracking", "painScore"],
    progressionCriteria: ["支撑脚控制 >=4/5。", "右膝轨迹 >=4/5。", "前 24–48 小时没有高篮球负荷。", "Readiness 为绿色或稳定。"],
    regressionCriteria: ["肌腱症状 >=3/10。", "右脚外旋 >=2。", "右膝轨迹 <=2/5。", "触地变慢或落地变响。"]
  }),
  supportExercise({
    id: "max-single-leg-approach-jump",
    nameZh: "单脚助跑最大测试跳",
    nameEn: "Max Single-Leg Approach Jump",
    category: "basketball-skill",
    purpose: "在测试日低次数评估左右单脚起跳表现差异。",
    whyForUser:
      "你右侧单脚起跳偏弱。正式测试只在疼痛低、动作质量好、篮球负荷不高时进行，用来判断下一周期是否能进阶，而不是额外训练量。",
    instructions: [
      "完成完整动态热身和低强度技术跳。",
      "每条起跳腿最多 3 次正式尝试。",
      "每次间充分休息，记录摸高或跳高。",
      "连续两次下降、落地变重或右膝轨迹变差就停止。",
      "测试后不再加入刚性训练或额外跳跃。"
    ],
    keyCues: ["次数少。", "质量先于高度。", "支撑脚踩稳。", "摆动腿主动。", "疲劳前停止。"],
    commonMistakes: ["把测试做成训练。", "疼痛时硬测。", "篮球高负荷后测试。", "落地变差还继续。"],
    regressions: ["两步单脚助跑 75–85%。", "上步提膝保持。", "恢复-only。"],
    progressions: ["下一周期增加技术一致性。", "只在连续几次质量稳定后提高强度。"],
    painRules: ["疼痛 >1/10 不做正式最大测试。", "右脚控制或右膝轨迹 <4/5 不测最大。", "前 48 小时篮球高负荷时取消。"],
    glossaryTermIds: ["plant-leg", "swing-leg-drive", "leverage-efficiency", "ground-contact-time"],
    trackingFields: ["takeoffLeg", "jumpHeightCm", "reachHeightCm", "rightFootExternalRotation", "rightKneeTracking", "landingQuietness", "painScore"],
    progressionCriteria: ["疼痛 <=1/10。", "右脚控制 >=4/5。", "右膝轨迹 >=4/5。", "热身感觉轻快。"],
    regressionCriteria: ["疼痛出现。", "连续两次表现下降。", "落地变重。", "右脚外旋或右膝内扣增加。"]
  }),
  supportExercise({
    id: "rdl",
    nameZh: "罗马尼亚硬拉",
    nameEn: "Romanian Deadlift",
    category: "strength",
    purpose: "训练髋主导力量、腘绳肌和臀部后链。",
    whyForUser: "后链力量支持起跳髋伸展和刹车控制，但强离心要避开测试前。",
    instructions: ["双脚与髋同宽，手持杠铃或哑铃。", "膝盖微弯，髋向后折叠。", "背部保持长，重量贴近腿。", "感到腘绳肌拉伸后用髋伸展站起。"],
    keyCues: ["髋向后", "背长", "重量贴腿", "脚踩稳"],
    commonMistakes: ["弯腰找地", "膝盖锁死", "重量离身太远", "下放太深失控"],
    regressions: ["哑铃 RDL", "B-stance RDL"],
    progressions: ["增加重量", "慢速离心"],
    painRules: ["腘绳肌刺痛时停止。", "测试前 48 小时不做重离心版本。"]
  }),
  supportExercise({
    id: "nordic-curl",
    nameZh: "Nordic 腘绳肌弯举",
    nameEn: "Nordic Hamstring Curl",
    category: "strength",
    purpose: "进阶训练腘绳肌离心力量。",
    whyForUser: "Nordic 对腘绳肌很强，但酸痛风险高，只适合 readiness 好且远离测试/高强度篮球时少量使用。",
    instructions: ["膝盖跪垫，脚踝固定安全。", "身体从膝到肩保持直线。", "慢慢向前下降，用手接住。", "推回起点或只做离心。"],
    keyCues: ["身体直", "慢下降", "髋不折", "低量"],
    commonMistakes: ["腰折叠", "下降太快", "做太多导致酸痛", "测试前使用"],
    regressions: ["短幅 Nordic", "腘绳肌滑盘弯曲"],
    progressions: ["增加下降幅度", "减少手辅助"],
    painRules: ["腘绳肌 soreness 高时不做。", "测试前 72 小时避免高强度 Nordic。"]
  }),
  supportExercise({
    id: "copenhagen-plank",
    nameZh: "Copenhagen Plank",
    nameEn: "Copenhagen Plank",
    category: "core",
    purpose: "训练内收肌、侧向核心和骨盆控制。",
    whyForUser: "内收肌和侧向核心支持横移、急停和单腿落地，对篮球变向很重要。",
    instructions: ["侧卧，上腿放在凳子上。", "肘在肩下，抬起髋部。", "保持骨盆正，不向前后转。", "短时间保持并换边。"],
    keyCues: ["髋抬高", "骨盆正", "内侧腿发力", "短保持"],
    commonMistakes: ["凳子太高", "髋掉下去", "肩耸", "内收肌拉扯痛还硬撑"],
    regressions: ["膝盖支撑版本", "侧桥"],
    progressions: ["脚踝支撑版本", "增加保持时间"],
    painRules: ["腹股沟疼痛时降级或停止。", "不要在高强度篮球前做到酸痛。"]
  }),
  supportExercise({
    id: "hip-90-90",
    nameZh: "髋 90/90 活动",
    nameEn: "Hip 90/90",
    category: "mobility",
    purpose: "改善髋内外旋控制，帮助下肢对线。",
    whyForUser: "右脚外旋和右膝轨迹问题常与髋控制有关，90/90 能温和练习髋旋转。",
    instructions: ["坐姿摆成前后腿 90/90。", "身体坐高，前腿髋外旋、后腿髋内旋。", "在无痛范围前倾或转换方向。", "动作慢，保持呼吸。"],
    keyCues: ["坐高", "髋转动", "慢", "无痛"],
    commonMistakes: ["腰背硬拧", "膝盖疼还压", "动作太快", "只追求幅度"],
    regressions: ["手放身后支撑", "垫高臀部"],
    progressions: ["主动转换", "前倾停顿"],
    painRules: ["髋或膝夹痛时减小幅度。", "麻木或刺痛时停止。"]
  }),
  supportExercise({
    id: "defensive-slide-stop",
    nameZh: "防守滑步急停",
    nameEn: "Defensive Slide Stop",
    category: "basketball-skill",
    purpose: "训练篮球横移后的刹车、髋膝踝对线和右脚角度控制。",
    whyForUser: "防守滑步和急停会暴露右脚外旋、右膝内扣和落地刹车问题，是篮球转化的重要检查动作。",
    instructions: ["低强度防守姿势开始。", "侧向滑步 2–3 步。", "急停时脚掌踩稳，膝盖对准脚尖。", "定住 1–2 秒再返回。"],
    keyCues: ["髋低", "脚踩稳", "膝盖正", "先定住"],
    commonMistakes: ["速度太快", "脚外旋失控", "膝盖内扣", "停不住还起跳"],
    regressions: ["慢速侧滑定住", "无跳版本"],
    progressions: ["加入低幅起跳", "加入接球"],
    painRules: ["膝内侧或髌腱不适时只做慢速停步。", "右膝轨迹失控时停止。"]
  }),
  supportExercise({
    id: "catch-and-jump",
    nameZh: "接球起跳",
    nameEn: "Catch and Jump",
    category: "basketball-skill",
    purpose: "训练接球后快速组织脚步和垂直起跳。",
    whyForUser: "篮球弹跳需要把力量转化到真实接球节奏，但总次数要少，质量优先。",
    instructions: ["从轻松传球或自抛接球开始。", "接球同时整理脚步。", "足弓撑住，膝盖对准脚尖。", "低到中等强度起跳并安静落地。"],
    keyCues: ["接球稳", "脚步快", "向上跳", "落地定住"],
    commonMistakes: ["接球后脚乱", "向前冲", "连续跳太多", "落地膝盖内扣"],
    regressions: ["接球定住不跳", "原地 CMJ"],
    progressions: ["加入一步移动", "提高到 85% 强度"],
    painRules: ["跟腱或髌腱不适时不跳。", "落地变重时停止。"]
  }),
  supportExercise({
    id: "second-jump-rebound-drill",
    nameZh: "二次起跳篮板练习",
    nameEn: "Second Jump Rebound Drill",
    category: "basketball-skill",
    purpose: "训练篮板后的低量二次起跳和落地再组织能力。",
    whyForUser: "二次起跳对篮球表现重要，但很容易变成高冲击疲劳训练；这里强调少量高质量。",
    instructions: ["模拟抢篮板落地。", "落地稳定后做第二次中等强度起跳。", "每次之间充分休息。", "记录右脚角度和右膝轨迹。"],
    keyCues: ["先落稳", "再起跳", "少量", "膝盖正"],
    commonMistakes: ["连续弹到疲劳", "落地没稳就跳", "膝盖内扣", "追数量"],
    regressions: ["落地定住不二跳", "低强度 CMJ"],
    progressions: ["加入接球", "增加到比赛节奏但减少次数"],
    painRules: ["任何肌腱不适时取消。", "落地变重或高度下降时停止。"]
  })
];

type MenuExerciseParams = {
  id: string;
  nameZh: string;
  nameEn: string;
  category: Exercise["category"];
  purpose: string;
  youtubeSearchQuery: string;
  highImpact?: boolean;
  advanced?: boolean;
};

function createMenuExercise({
  id,
  nameZh,
  nameEn,
  category,
  purpose,
  youtubeSearchQuery,
  highImpact,
  advanced
}: MenuExerciseParams): Exercise {
  const isJump = category === "plyometric" || category === "basketball-skill";
  const isStrength = category === "strength" || category === "isometric";
  const isCore = category === "core";
  const sourceNote = "来自训练菜单动作库";

  return {
    id,
    nameZh,
    nameEn,
    category,
    purpose,
    whyForUser: isJump
      ? "这个动作来自训练菜单动作库，但 JumpPlan 会按你的膝前侧、跟腱、髌腱和篮球负荷重新控制剂量。它用于提高弹跳质量，不用于体能消耗。"
      : isStrength
        ? "这个动作来自训练菜单动作库，用来支持右侧力量、膝脚对线、腘绳肌和小腿容量，而不是制造 bodybuilding 式疲劳。"
        : isCore
          ? "这个动作来自训练菜单动作库，用来提高起跳、落地和篮球对抗时的躯干传力。"
          : "这个动作来自训练菜单动作库，用来改善动作控制和恢复质量。",
    instructions: isJump
      ? [
          "先完成完整热身，并确认膝前侧、跟腱和髌腱疼痛不超过 1–2/10。",
          "每组次数少，组间充分休息，保持每次起跳和落地质量。",
          "落地要安静，右脚保持三点支撑，右膝对准第二、三脚趾。",
          "高度、速度或连续次数下降时停止，不用完成预设总量。"
        ]
      : [
          "先用轻重量或自重找到稳定动作轨迹。",
          "保持脚三点支撑、骨盆稳定和自然呼吸。",
          "用 RPE 6–8 完成，避免力竭和动作变形。",
          "如果右脚外旋、右膝内扣或膝前侧不适增加，立刻降级。"
        ],
    keyCues: isJump
      ? ["少量高质量。", "落地安静。", "右脚不外八。", "膝盖对脚尖。", "疲劳前停止。"]
      : ["脚三点支撑。", "膝盖走正。", "骨盆稳定。", "动作慢而可控。", "不要憋气。"],
    commonMistakes: isJump
      ? ["把动作做成 conditioning。", "连续跳到落地变响。", "膝盖内扣还继续。", "篮球高负荷后硬加跳跃。", "用截图里的训练量直接照搬。"]
      : ["重量太重导致动作变形。", "右脚外旋逃避。", "膝盖向内掉。", "为了完成次数忍痛。", "做到明显酸痛影响篮球或弹跳。"],
    regressions: isJump
      ? ["低幅 Pogo。", "Snap-down 定住。", "低箱版本。", "70–85% 技术跳。", "膝敏感时改等长或恢复。"]
      : ["自重版本。", "扶墙或降低幅度。", "减少组数。", "改等长保持。", "改双侧版本。"],
    progressions: isJump
      ? ["增加到计划内接触次数上限。", "提高到 85–90% 强度。", "加入助跑或方向变化。", "只在动作质量稳定后进入单脚或连续版本。"]
      : ["增加 2.5–5% 负重。", "增加顶部或底部停顿。", "增加一组低到中等技术组。", "进阶到单腿或轻爆发版本。"],
    painRules: [
      "膝前侧、跟腱或髌腱疼痛 >=3/10 时取消动态跳跃或深膝角版本。",
      "疼痛在热身中变差时，当天降级为恢复或受控力量。",
      highImpact ? "这是高冲击动作，只能在后续周期低量使用，不能做成高次数体能训练。" : "保持低到中等刺激，第二天症状增加就减半或跳过。",
      advanced ? "这是进阶动作；疼痛 <=1/10、右膝轨迹和落地质量 >=4/5、前 48 小时无高篮球负荷才考虑。" : "动作质量不稳定时先退阶。"
    ],
    glossaryTermIds: isJump
      ? ["plyometric", "ground-contact-time", "tripod-foot", "readiness"]
      : ["rpe", "force-transfer", "tripod-foot", "readiness"],
    trackingFields: isJump
      ? ["jumpContacts", "landingQuietness", "rightFootExternalRotation", "rightKneeTracking", "painScore"]
      : ["reps", "rpe", "rightFootControl", "rightKneeTracking", "painScore"],
    progressionCriteria: isJump
      ? ["疼痛 <=1–2/10。", "落地安静 >=4/5。", "右膝轨迹 >=4/5。", "前 24–48 小时没有高篮球负荷。"]
      : ["所有组动作完成且 RPE <=7–8。", "右脚和右膝控制稳定。", "第二天膝部或肌腱没有加重。"],
    regressionCriteria: isJump
      ? ["膝前侧或肌腱 >=3/10。", "落地声音变重。", "右脚外旋 >=2/3。", "右膝轨迹 <=2/5。", "篮球负荷高。"]
      : ["疼痛升高。", "动作轨迹变形。", "右脚外旋明显。", "第二天酸痛影响篮球或弹跳。"],
    youtubeSearchQuery,
    sourceNote
  };
}

const screenshotMenuExercises: Exercise[] = [
  createMenuExercise({ id: "tuck-jump", nameZh: "屈膝跳", nameEn: "Tuck Jump", category: "plyometric", purpose: "训练快速向上起跳和空中收膝协调。", youtubeSearchQuery: "tuck jump technique", highImpact: true }),
  createMenuExercise({ id: "continuous-tuck-jump", nameZh: "连续屈膝跳", nameEn: "Continuous Tuck Jump", category: "plyometric", purpose: "低量训练连续弹跳节奏和落地再组织能力。", youtubeSearchQuery: "continuous tuck jump technique", highImpact: true, advanced: true }),
  createMenuExercise({ id: "lunge-jump", nameZh: "弓步跳", nameEn: "Lunge Jump", category: "plyometric", purpose: "训练分腿姿势下的垂直发力和落地对线。", youtubeSearchQuery: "lunge jump technique", highImpact: true }),
  createMenuExercise({ id: "continuous-lunge-jump", nameZh: "连续弓步跳", nameEn: "Continuous Lunge Jump", category: "plyometric", purpose: "训练连续分腿弹跳，但只作为后期低量高质量刺激。", youtubeSearchQuery: "continuous lunge jump technique", highImpact: true, advanced: true }),
  createMenuExercise({ id: "box-jump", nameZh: "跳箱", nameEn: "Box Jump", category: "plyometric", purpose: "用较低落地冲击练习向上发力和起跳协调。", youtubeSearchQuery: "box jump technique safe landing" }),
  createMenuExercise({ id: "squat-jump", nameZh: "蹲跳", nameEn: "Squat Jump", category: "plyometric", purpose: "训练静止下蹲位向上发力和躯干稳定。", youtubeSearchQuery: "squat jump technique" }),
  createMenuExercise({ id: "continuous-squat-jump", nameZh: "连续蹲跳", nameEn: "Continuous Squat Jump", category: "plyometric", purpose: "低量训练重复垂直发力，不作为体能循环。", youtubeSearchQuery: "continuous squat jump technique", highImpact: true, advanced: true }),
  createMenuExercise({ id: "depth-drop", nameZh: "失重落地", nameEn: "Depth Drop", category: "plyometric", purpose: "训练从低高度下落后的安静落地和膝脚对线。", youtubeSearchQuery: "depth drop landing technique" }),
  createMenuExercise({ id: "single-leg-depth-drop", nameZh: "单脚失重落地", nameEn: "Single-Leg Depth Drop", category: "plyometric", purpose: "进阶训练单脚落地刚性、骨盆稳定和缓冲质量。", youtubeSearchQuery: "single leg depth drop landing technique", highImpact: true, advanced: true }),
  createMenuExercise({ id: "single-leg-hurdle-jump-to-squat-jump", nameZh: "单脚跨栏蹲跳", nameEn: "Single-Leg Hurdle Jump to Squat Jump", category: "plyometric", purpose: "高级组合动作，训练单脚越障后重新组织双脚发力。", youtubeSearchQuery: "single leg hurdle hop to squat jump drill", highImpact: true, advanced: true }),
  createMenuExercise({ id: "bulgarian-split-squat", nameZh: "保加利亚分腿蹲", nameEn: "Bulgarian Split Squat", category: "strength", purpose: "训练单腿力量、髋膝控制和左右力量平衡。", youtubeSearchQuery: "Bulgarian split squat technique" }),
  createMenuExercise({ id: "bulgarian-split-squat-with-heel-up", nameZh: "保加利亚分腿蹲提踵", nameEn: "Bulgarian Split Squat with Heel Up", category: "strength", purpose: "把分腿蹲力量和小腿末端支撑结合。", youtubeSearchQuery: "Bulgarian split squat calf raise technique" }),
  createMenuExercise({ id: "reverse-lunge", nameZh: "反向弓箭步", nameEn: "Reverse Lunge", category: "strength", purpose: "训练下肢力量和膝盖可控前移，膝前侧负荷通常比前弓步更温和。", youtubeSearchQuery: "reverse lunge technique" }),
  createMenuExercise({ id: "reverse-lunge-with-height", nameZh: "负重反向弓箭步", nameEn: "Weighted Reverse Lunge", category: "strength", purpose: "在控制右膝轨迹前提下增加分腿力量刺激。", youtubeSearchQuery: "weighted reverse lunge technique" }),
  createMenuExercise({ id: "lunge-with-heel-up", nameZh: "脚跟离地弓箭步", nameEn: "Lunge with Heel Up", category: "strength", purpose: "训练前脚掌支撑、小腿张力和分腿位置控制。", youtubeSearchQuery: "heel elevated lunge technique" }),
  createMenuExercise({ id: "front-squat", nameZh: "前蹲举", nameEn: "Front Squat", category: "strength", purpose: "训练直立躯干下的下肢力量和核心支撑。", youtubeSearchQuery: "front squat technique" }),
  createMenuExercise({ id: "goblet-squat", nameZh: "高脚杯深蹲", nameEn: "Goblet Squat", category: "strength", purpose: "用较容易控制的负重训练深蹲模式和膝脚对线。", youtubeSearchQuery: "goblet squat technique" }),
  createMenuExercise({ id: "side-lunge", nameZh: "侧弓箭步", nameEn: "Side Lunge", category: "strength", purpose: "训练侧向髋控制、内收肌容量和篮球横移支撑。", youtubeSearchQuery: "side lunge technique" }),
  createMenuExercise({ id: "single-leg-good-morning", nameZh: "单脚早安式", nameEn: "Single-Leg Good Morning", category: "strength", purpose: "训练单腿髋铰链、腘绳肌和骨盆抗旋转。", youtubeSearchQuery: "single leg good morning exercise technique" }),
  createMenuExercise({ id: "eccentric-single-leg-squat", nameZh: "单脚深蹲离心控制", nameEn: "Eccentric Single-Leg Squat", category: "strength", purpose: "训练单腿下放控制和膝盖轨迹。", youtubeSearchQuery: "eccentric single leg squat technique" }),
  createMenuExercise({ id: "calf-raise-with-plate-under-front-foot", nameZh: "前脚掌垫高提踵", nameEn: "Calf Raise with Plate Under Forefoot", category: "strength", purpose: "训练小腿和足踝末端支撑容量。", youtubeSearchQuery: "calf raise with forefoot elevated technique" }),
  createMenuExercise({ id: "single-leg-calf-raise-with-plate-under-front-foot", nameZh: "单脚前脚掌垫高提踵", nameEn: "Single-Leg Calf Raise with Plate Under Forefoot", category: "strength", purpose: "训练单脚小腿容量和足弓控制。", youtubeSearchQuery: "single leg calf raise forefoot elevated technique" }),
  createMenuExercise({ id: "tibialis-raise", nameZh: "胫骨前肌上提", nameEn: "Tibialis Raise", category: "foot-ankle", purpose: "训练胫骨前肌容量，支持踝控制和落地缓冲。", youtubeSearchQuery: "tibialis raise technique" }),
  createMenuExercise({ id: "cable-core-exercises", nameZh: "弹力绳核心训练", nameEn: "Cable Core Exercises", category: "core", purpose: "训练抗旋转、抗伸展和传力能力。", youtubeSearchQuery: "cable core anti rotation exercises" }),
  createMenuExercise({ id: "plank", nameZh: "棒式 / 平板支撑", nameEn: "Plank", category: "core", purpose: "训练核心抗伸展和呼吸控制。", youtubeSearchQuery: "plank exercise technique" }),
  createMenuExercise({ id: "side-plank-with-knee-drive-hold", nameZh: "侧棒式加膝关节保持90度", nameEn: "Side Plank with Knee Drive Hold", category: "core", purpose: "训练侧向核心、骨盆稳定和摆动腿提膝位置。", youtubeSearchQuery: "side plank knee drive hold exercise" }),
  createMenuExercise({ id: "hip-90-90-seated-rotation", nameZh: "90/90坐姿髋关节内外旋", nameEn: "Seated 90/90 Hip Rotation", category: "mobility", purpose: "改善髋内外旋活动和控制。", youtubeSearchQuery: "seated 90 90 hip rotation technique" }),
  createMenuExercise({ id: "hip-90-90-standing-rotation", nameZh: "90/90站姿髋关节内外旋", nameEn: "Standing 90/90 Hip Rotation", category: "mobility", purpose: "在站姿中练习髋旋转和骨盆控制。", youtubeSearchQuery: "standing 90 90 hip rotation exercise" }),
  createMenuExercise({ id: "single-leg-weight-exchange", nameZh: "单脚姿势重量转换", nameEn: "Single-Leg Weight Exchange", category: "foot-ankle", purpose: "训练单脚支撑时的足弓、骨盆和躯干稳定。", youtubeSearchQuery: "single leg weight exchange balance exercise" }),
  createMenuExercise({ id: "single-leg-weight-exchange-with-row", nameZh: "单脚姿势重量转换加划船", nameEn: "Single-Leg Weight Exchange with Row", category: "strength", purpose: "结合单腿支撑、抗旋转和上肢拉力。", youtubeSearchQuery: "single leg balance row exercise" }),
  createMenuExercise({ id: "lunge-hold", nameZh: "弓箭步保持", nameEn: "Lunge Hold", category: "isometric", purpose: "训练分腿位置下的膝脚对线和等长耐受。", youtubeSearchQuery: "lunge hold isometric technique" }),
  createMenuExercise({ id: "bulgarian-squat-hold", nameZh: "保加利亚分腿蹲保持", nameEn: "Bulgarian Squat Hold", category: "isometric", purpose: "训练单腿分腿姿势下的等长控制。", youtubeSearchQuery: "Bulgarian split squat isometric hold" }),
  createMenuExercise({ id: "single-leg-bridge", nameZh: "单脚桥式", nameEn: "Single-Leg Bridge", category: "strength", purpose: "训练臀肌和腘绳肌基础激活。", youtubeSearchQuery: "single leg bridge exercise technique" }),
  createMenuExercise({ id: "bridge", nameZh: "桥式", nameEn: "Bridge", category: "strength", purpose: "训练臀部和腘绳肌低负荷激活。", youtubeSearchQuery: "glute bridge technique" })
];

const allExerciseDefinitions = [...exerciseDefinitions, ...screenshotMenuExercises];

export const exercises: Exercise[] = allExerciseDefinitions.map((exercise) => ({
  ...exercise,
  youtubeSearchQuery: exercise.youtubeSearchQuery ?? youtubeSearchQueriesByExerciseId[exercise.id],
  videoNote: getVideoNote(exercise)
}));

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((exercise) => exercise.id === id);
}
