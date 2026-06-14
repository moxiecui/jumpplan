export const rightSideAssessmentProtocol = {
  id: "right-side-reassessment" as const,
  title: "右侧动作质量复评",
  assessmentDays: [1, 14, 20, 21],
  tests: [
    "右侧台阶下蹲：5 次受控重复。",
    "右侧单腿落地定住：3 次低幅重复，仅在肌腱状态绿色时执行。",
    "双脚 CMJ 视频：正面或背面拍摄。",
    "可选助跑起跳视频：不要求频繁单腿最大测试。"
  ],
  consistencyRules: [
    "使用相同鞋子。",
    "使用相同地面。",
    "保持相同相机角度。",
    "使用相似热身。",
    "比较趋势，不根据一次孤立重复下结论。"
  ],
  singleLegMaxRules: [
    "疼痛不超过 1/10。",
    "落地质量良好。",
    "用户熟悉测试流程。"
  ]
};
