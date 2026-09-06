import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { DayCompletionPanel } from "@/components/DayCompletionPanel";
import { BasketballLoadLogger } from "@/components/BasketballLoadLogger";
import { BodySignalsCard } from "@/components/BodySignalsCard";
import { CycleReviewCard } from "@/components/CycleReviewCard";
import { DayLoadCard } from "@/components/DayLoadCard";
import { DaySection } from "@/components/DaySection";
import { DailyNutritionCard } from "@/components/DailyNutritionCard";
import { FrenchContrastGuidanceCard } from "@/components/FrenchContrastGuidanceCard";
import { JumpTestCard } from "@/components/JumpTestCard";
import { PlanProgressControls } from "@/components/PlanProgressControls";
import { RelatedTermsSection } from "@/components/RelatedTermsSection";
import { RightSideAssessmentCard } from "@/components/RightSideAssessmentCard";
import { SingleLegStiffnessAssessmentCard } from "@/components/SingleLegStiffnessAssessmentCard";
import { TrainingLogPanel } from "@/components/TrainingLogPanel";
import { TrainingReminderCard } from "@/components/TrainingReminderCard";
import { useBodySignals } from "@/context/BodySignalsContext";
import { useReadiness } from "@/context/ReadinessContext";
import { usePerformance } from "@/context/PerformanceContext";
import { usePlanProgress } from "@/context/PlanProgressContext";
import { useSessionProgress } from "@/context/SessionProgressContext";
import { getAdaptiveDateForMacrocycleDay, resolveTrainingSessionForDate } from "@/logic/sessionSchedule";
import { getSessionUnit, weeklySessionTargets } from "@/data/adaptiveProgram";
import { getRelatedGlossaryTermsForDay } from "@/data/glossary";
import { isSingleLegStiffnessItem } from "@/data/singleLegStiffness";
import {
  applyAdvancedExerciseSubstitutions,
  getBlockedAdvancedExerciseSubstitutions
} from "@/logic/advancedExerciseGates";
import { getBasketballLoadWarning } from "@/logic/basketballLoad";
import { evaluateBasketballLoad, generateTrainingReminders } from "@/logic/bodySignalEvaluation";
import { getWeeklySessionProgress, recommendNextSession } from "@/logic/nextSessionRecommendation";
import { formatLocalDate } from "@/logic/localDate";
import { getPlanDate } from "@/logic/schedule";
import { applyAdjustmentToDay, applyDay11PapDowngrade } from "@/logic/trainingAdjustment";
import { getTrainingDayTypeLabel, normalizeTrainingCopy } from "@/logic/trainingDisplay";
import type { SessionUnitType, TrainingDay } from "@/types/training";

function todayDate() {
  return formatLocalDate();
}

const phaseLabels = {
  "control-capacity": "控制容量",
  "strength-conversion": "力量转化",
  "reactive-basketball-transfer": "篮球专项转化",
  "taper-test-review": "减量测试"
};

const priorityLabels: Record<NonNullable<TrainingDay["todayPriority"]>, string> = {
  "knee-calm": "膝部安静",
  "right-foot-control": "右脚控制",
  strength: "力量",
  elasticity: "弹性",
  "basketball-transfer": "篮球转化",
  test: "测试",
  recovery: "恢复"
};
const showDeveloperDebug = process.env.NODE_ENV !== "production";

const sessionTypeLabels: Record<SessionUnitType, string> = {
  "strength-a": "力量 A",
  "strength-b": "力量 B",
  "power-a": "爆发转化",
  "reactive-a": "反应弹性",
  "single-leg-takeoff": "单脚起跳",
  "upper-body-core": "上肢/核心",
  recovery: "恢复",
  "basketball-skill": "篮球技术",
  "pre-test-activation": "测试前激活",
  test: "测试",
  review: "复盘"
};

function getHoursSinceLast(
  entries: ReturnType<typeof useSessionProgress>["completedSessionUnits"],
  predicate: (entry: ReturnType<typeof useSessionProgress>["completedSessionUnits"][number]) => boolean
) {
  const latest = entries.find(predicate);
  if (!latest) {
    return 999;
  }

  return Math.max(0, (Date.now() - new Date(latest.completedAt).getTime()) / 3600000);
}

export default function TodayScreen() {
  const router = useRouter();
  const { currentDay: day, currentDayNumber, dayOffset } = usePlanProgress();
  const {
    completedSessionUnits,
    completeSessionUnit,
    currentAdaptiveDay,
    currentAdaptiveWeek,
    currentBlock,
    currentBlockTitle,
    getCompletedSessionUnitIdsLast14Days,
    legacyOverrideDetected,
    latestJumpReadinessResult
  } = useSessionProgress();
  const { getReadinessEntry } = useReadiness();
  const { getBodySignals, getBodySignalBaseline } = useBodySignals();
  const { getBasketballLog } = usePerformance();
  const readinessEntry = getReadinessEntry(todayDate());
  const bodySignals = getBodySignals(todayDate());
  const bodySignalBaseline = getBodySignalBaseline(todayDate());
  const subjectiveReadiness = readinessEntry?.subjective;
  const planDate = todayDate();
  const previousBasketballLog = day.day > 2 ? getBasketballLog(getPlanDate(day.day - 2)) : undefined;
  const [showAdjustedPlan, setShowAdjustedPlan] = useState(false);
  const [showRecommendedSession, setShowRecommendedSession] = useState(true);
  const resolvedSession = useMemo(
    () => resolveTrainingSessionForDate(new Date(`${planDate}T12:00:00`), dayOffset),
    [dayOffset, planDate]
  );
  const plannedUnit = resolvedSession.session;
  const adjustedDay = useMemo(
    () => (readinessEntry ? applyAdjustmentToDay(day, readinessEntry.adjustment) : day),
    [day, readinessEntry]
  );
  const papDowngradeReason =
    day.dayInCycle === 11 &&
    (previousBasketballLog?.loadLevel === "moderate" || previousBasketballLog?.loadLevel === "high")
      ? `前 48 小时篮球负荷为${previousBasketballLog.loadLevel === "high" ? "高" : "中等"}`
      : undefined;
  const baseVisibleDay = showAdjustedPlan && readinessEntry ? adjustedDay : day;
  const papVisibleDay = papDowngradeReason
    ? applyDay11PapDowngrade(baseVisibleDay, papDowngradeReason)
    : baseVisibleDay;
  const advancedSubstitutions = useMemo(
    () =>
      readinessEntry
        ? getBlockedAdvancedExerciseSubstitutions(papVisibleDay, {
            readinessLevel: readinessEntry.adjustment.level,
            anteriorKneeSoreness: subjectiveReadiness?.anteriorKneeSoreness,
            achillesStiffness: subjectiveReadiness?.achillesStiffness,
            patellarPain: subjectiveReadiness?.patellarPain,
            hamstringSoreness: subjectiveReadiness?.hamstringSoreness,
            rightFootExternalRotation: subjectiveReadiness?.rightFootExternalRotation,
            rightKneeTracking: subjectiveReadiness?.rightKneeTracking,
            landingQuality: subjectiveReadiness?.movementQualityToday,
            movementQualityToday: subjectiveReadiness?.movementQualityToday,
            basketballLoadLast24h: subjectiveReadiness?.basketballLoadLast24h ?? "none",
            basketballLoadLast48h: subjectiveReadiness?.basketballLoadLast48h ?? "none",
            userEnabledAdvancedExercise: false
          })
        : [],
    [papVisibleDay, readinessEntry, subjectiveReadiness]
  );
  const visibleDay = useMemo(
    () => applyAdvancedExerciseSubstitutions(papVisibleDay, advancedSubstitutions),
    [papVisibleDay, advancedSubstitutions]
  );
  const basketballWarning = getBasketballLoadWarning(
    readinessEntry?.subjective?.basketballLoadLast24h ?? "none",
    readinessEntry?.subjective?.basketballLoadLast48h ?? "none"
  );
  const relatedTerms = useMemo(() => getRelatedGlossaryTermsForDay(visibleDay), [visibleDay]);
  const totalActions = visibleDay.blocks.reduce((count, block) => count + block.items.length, 0);
  const hasSingleLegModule = visibleDay.blocks.some((block) =>
    block.items.some((item) => isSingleLegStiffnessItem(item))
  );
  const focusFlags = [
    day.upperBodyIncluded ? "上肢" : undefined,
    day.coreIncluded ? "核心" : undefined,
    day.isometricIncluded ? "等长" : undefined
  ].filter(Boolean) as string[];
  const bodySignalReminders = useMemo(
    () => (bodySignals ? generateTrainingReminders(bodySignals, bodySignalBaseline).slice(0, 3) : []),
    [bodySignalBaseline, bodySignals]
  );
  const basketballLoadToday = bodySignals?.basketballLoad
    ? evaluateBasketballLoad(bodySignals.basketballLoad)
    : readinessEntry?.subjective?.basketballLoadLast24h ?? "none";
  const recommendation = useMemo(
    () =>
      recommendNextSession({
        date: todayDate(),
        currentBlock,
        completedSessionUnitsLast14Days: getCompletedSessionUnitIdsLast14Days(),
        latestSessionUnit: getSessionUnit(completedSessionUnits[0]?.sessionUnitId),
        hoursSinceLastHighImpact: getHoursSinceLast(completedSessionUnits, (entry) => {
          const unit = getSessionUnit(entry.sessionUnitId);
          return unit?.impactLevel === "high";
        }),
        hoursSinceLastLowerBodyStrength: getHoursSinceLast(completedSessionUnits, (entry) =>
          entry.sessionType === "strength-a" || entry.sessionType === "strength-b"
        ),
        cmjReadiness: latestJumpReadinessResult,
        wearableSignals: bodySignals?.wearable,
        wearableBaseline: bodySignalBaseline,
        painAndMovement: bodySignals?.painAndMovement,
        basketballLoadLast24h: basketballLoadToday,
        basketballLoadLast48h: readinessEntry?.subjective?.basketballLoadLast48h ?? "none"
      }),
    [
      basketballLoadToday,
      bodySignalBaseline,
      bodySignals,
      completedSessionUnits,
      currentBlock,
      getCompletedSessionUnitIdsLast14Days,
      latestJumpReadinessResult,
      readinessEntry
    ]
  );
  const recommendedUnit = getSessionUnit(recommendation.recommendedSessionUnitId);
  const weeklyProgress = useMemo(
    () => getWeeklySessionProgress(getCompletedSessionUnitIdsLast14Days(), currentBlock, todayDate()),
    [currentBlock, getCompletedSessionUnitIdsLast14Days]
  );
  const currentWeekTarget = weeklySessionTargets.find((target) => target.weekNumber === currentAdaptiveWeek);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.navRow}>
        <Pressable style={styles.navButton} onPress={() => router.push("/plan")}>
          <Text style={styles.navButtonText}>计划</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.push("/checkin")}>
          <Text style={styles.navButtonText}>状态</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.push("/nutrition" as never)}>
          <Text style={styles.navButtonText}>营养</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.push("/body-signals" as never)}>
          <Text style={styles.navButtonText}>身体</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.push("/glossary" as never)}>
          <Text style={styles.navButtonText}>术语</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionKicker}>今日概览</Text>
      <PlanProgressControls />
      <View style={styles.recommendationCard}>
        <Text style={styles.recommendationKicker}>
          12 周自适应 · Week {currentAdaptiveWeek} · Block {currentBlock} · Day {currentAdaptiveDay}
        </Text>
        <Text style={styles.recommendationTitle}>{currentBlockTitle}</Text>
        <Text style={styles.recommendationSubtitle}>
          今日计划：{plannedUnit.title}
        </Text>
        <View style={styles.recommendationMetaRow}>
          <Text style={styles.recommendationBadge}>来源：{resolvedSession.source}</Text>
          <Text style={styles.recommendationBadge}>Session ID：{plannedUnit.id}</Text>
          <Text style={styles.recommendationBadge}>
            {recommendation.level === "normal"
              ? "正常执行"
              : recommendation.level === "modified"
                ? "降级/调整"
                : "恢复-only"}
          </Text>
          {plannedUnit ? (
            <>
              <Text style={styles.recommendationBadge}>{sessionTypeLabels[plannedUnit.type]}</Text>
              <Text style={styles.recommendationBadge}>
                冲击：{plannedUnit.impactLevel === "high" ? "高" : plannedUnit.impactLevel === "moderate" ? "中" : plannedUnit.impactLevel === "low" ? "低" : "无"}
              </Text>
              {plannedUnit.plannedElasticContacts ? (
                <Text style={styles.recommendationBadge}>
                  弹性：{plannedUnit.plannedElasticContacts.min}–{plannedUnit.plannedElasticContacts.max}
                </Text>
              ) : null}
            </>
          ) : null}
        </View>
        {recommendation.recommendedSessionUnitId !== plannedUnit.id ? (
          <Text style={styles.modificationText}>
            状态建议：{recommendedUnit?.title ?? recommendation.title}。这是临时建议，不会覆盖今日底层计划。
          </Text>
        ) : null}
        {recommendation.rationale.slice(0, 3).map((reason) => (
          <Text key={reason} style={styles.recommendationText}>• {reason}</Text>
        ))}
        {recommendation.modifications.slice(0, 3).map((modification) => (
          <Text key={modification} style={styles.modificationText}>调整：{modification}</Text>
        ))}
        <View style={styles.recommendationActions}>
          <Pressable
            style={styles.recommendationAction}
            onPress={() => setShowRecommendedSession((current) => !current)}
          >
            <Text style={styles.recommendationActionText}>
              {showRecommendedSession ? "收起今日计划" : "展开今日计划"}
            </Text>
          </Pressable>
          <Pressable style={styles.recommendationAction} onPress={() => router.push("/jump-readiness" as never)}>
            <Text style={styles.recommendationActionText}>做 Jump Readiness</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.weekProgressCard}>
        <Text style={styles.weekProgressTitle}>本周训练单元目标</Text>
        {currentWeekTarget?.deload ? <Text style={styles.weekProgressNote}>本周是微卸载/复盘周。</Text> : null}
        {weeklyProgress.map((item) => (
          <Text key={item.type} style={styles.weekProgressItem}>
            {sessionTypeLabels[item.type]}：{item.completed}/{item.targetMin}
            {item.targetMax !== item.targetMin ? `–${item.targetMax}` : ""}
            {item.optional ? "（可选）" : ""}
          </Text>
        ))}
      </View>

      {showDeveloperDebug ? (
        <View style={styles.debugCard}>
          <Text style={styles.debugTitle}>开发调试</Text>
          <Text style={styles.debugText}>当前日期：{todayDate()}</Text>
          <Text style={styles.debugText}>Resolved session ID：{plannedUnit.id}</Text>
          <Text style={styles.debugText}>Source：{resolvedSession.source}</Text>
          <Text style={styles.debugText}>Block / Week：{resolvedSession.blockNumber} / {resolvedSession.weekNumber}</Text>
          <Text style={styles.debugText}>Macro Day：{resolvedSession.macrocycleDay} · 当前显示：Day {currentDayNumber}</Text>
          <Text style={styles.debugText}>计划日期：{getAdaptiveDateForMacrocycleDay(resolvedSession.macrocycleDay)} · dayOffset：{dayOffset}</Text>
          <Text style={styles.debugText}>localStorage plan version：{resolvedSession.localStoragePlanVersion}</Text>
          <Text style={styles.debugText}>legacy override detected：{legacyOverrideDetected ? "yes" : "no"}</Text>
        </View>
      ) : null}

      {showRecommendedSession ? (
        <View style={styles.recommendedSessionCard}>
          <Text style={styles.recommendedSessionTitle}>{plannedUnit.title}</Text>
          <Text style={styles.recommendedSessionMeta}>
            预计 {plannedUnit.estimatedDurationMinutes?.min ?? 20}–{plannedUnit.estimatedDurationMinutes?.max ?? 45} 分钟
            {plannedUnit.plannedJumpContacts
              ? ` · 跳跃 ${plannedUnit.plannedJumpContacts.min}–${plannedUnit.plannedJumpContacts.max}`
              : ""}
          </Text>
          {plannedUnit.purpose ? <Text style={styles.recommendationText}>{plannedUnit.purpose}</Text> : null}
          {plannedUnit.leftAnkleModificationRules?.slice(0, 3).map((rule) => (
            <Text key={rule} style={styles.modificationText}>左踝规则：{rule}</Text>
          ))}
          {plannedUnit.substitutions?.slice(0, 2).map((substitution) => (
            <Text key={substitution.trigger} style={styles.modificationText}>
              替代：{substitution.trigger} 时，{substitution.note}
            </Text>
          ))}
          {plannedUnit.progressionMetadata?.notes.map((reason) => (
            <Text key={reason} style={styles.recommendationText}>• {reason}</Text>
          ))}
          {plannedUnit.exerciseBlocks.map((block, index) => (
            <DaySection key={`${plannedUnit.id}-${block.type}-${index}`} block={block} dayLabel={plannedUnit.title} />
          ))}
          <Pressable
            style={styles.completeSessionButton}
            onPress={() => completeSessionUnit(plannedUnit.id, recommendation.level)}
          >
            <Text style={styles.completeSessionButtonText}>标记这节训练已完成</Text>
          </Pressable>
        </View>
      ) : null}

      <Text style={styles.legacyTitle}>Legacy Fixed Plan（固定日历兼容）</Text>
      <Text style={styles.eyebrow}>
        Week {day.weekNumber} · Cycle {day.cycleNumber} · Day {day.macrocycleDay}
      </Text>
      <Text style={styles.cycleMeta}>21 天周期：第 {day.dayInCycle} 天 · {day.cycleTitle}</Text>
      <Text style={styles.title}>{day.title}</Text>
      <View style={styles.badgeRow}>
        <Text style={styles.type}>{getTrainingDayTypeLabel(day.type)}</Text>
        {day.phaseTitle ? <Text style={styles.phaseBadge}>{day.phaseTitle}</Text> : null}
        <Text style={styles.phaseBadge}>{phaseLabels[day.macrocyclePhase]}</Text>
        {day.todayPriority ? <Text style={styles.priorityBadge}>{priorityLabels[day.todayPriority]}</Text> : null}
      </View>
      <Text style={styles.goal}>{day.goal}</Text>
      {day.kneeLoadNote ? <Text style={styles.metaNote}>膝部负荷：{day.kneeLoadNote}</Text> : null}
      {day.basketballLoadDependency ? (
        <Text style={styles.metaNote}>篮球负荷会决定今天是否需要删减健身房冲击。</Text>
      ) : null}
      <DayLoadCard day={visibleDay} />

      <View style={styles.readinessCard}>
        <Text style={styles.readinessTitle}>今日 Readiness 评估</Text>
        {readinessEntry ? (
          <>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLevel}>{readinessEntry.adjustment.level.toUpperCase()}</Text>
              <Text style={styles.summaryHeadline}>{readinessEntry.adjustment.headline}</Text>
            </View>
            {readinessEntry.adjustment.modifications.slice(0, 3).map((modification) => (
              <Text key={modification} style={styles.summaryItem}>
                • {modification}
              </Text>
            ))}
            <Pressable
              style={[styles.overlayButton, showAdjustedPlan && styles.overlayButtonActive]}
              onPress={() => setShowAdjustedPlan((current) => !current)}
            >
              <Text style={[styles.overlayButtonText, showAdjustedPlan && styles.overlayButtonTextActive]}>
                {showAdjustedPlan ? "显示原计划" : "预览调整后计划"}
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.emptyText}>
              还没有今天的 Oura / readiness 数据。可以手动输入，之后再接 Oura API。
            </Text>
            <Pressable style={styles.fillButton} onPress={() => router.push("/checkin")}>
              <Text style={styles.fillButtonText}>填写今日状态</Text>
            </Pressable>
          </>
        )}
      </View>

      <View style={styles.bodyReminderCard}>
        <Text style={styles.bodyReminderTitle}>身体数据提醒</Text>
        {bodySignals ? (
          <>
            <BodySignalsCard signals={bodySignals} compact />
            {bodySignalReminders.map((reminder) => (
              <TrainingReminderCard key={reminder.id} reminder={reminder} compact />
            ))}
          </>
        ) : (
          <Text style={styles.emptyText}>
            还没有今天的 WHOOP / Oura / Withings 数据。可以手动输入，之后再接后端同步。
          </Text>
        )}
        <Pressable style={styles.fillButton} onPress={() => router.push("/body-signals" as never)}>
          <Text style={styles.fillButtonText}>查看身体数据</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>今日训练内容</Text>

      {showAdjustedPlan && readinessEntry ? (
        <View style={styles.adjustedBanner}>
          <Text style={styles.adjustedTitle}>正在预览 Readiness 调整版</Text>
          <Text style={styles.adjustedText}>这是临时 overlay，不会修改原始 84 天宏周期数据。</Text>
        </View>
      ) : null}

      {visibleDay.readinessRule ? (
        <View style={styles.warning}>
          <Text style={styles.warningTitle}>今日状态提醒</Text>
          <Text style={styles.warningText}>{normalizeTrainingCopy(visibleDay.readinessRule)}</Text>
        </View>
      ) : null}
      {basketballWarning ? (
        <View style={styles.warning}>
          <Text style={styles.warningTitle}>篮球负荷调整</Text>
          <Text style={styles.warningText}>{basketballWarning}</Text>
        </View>
      ) : null}
      {advancedSubstitutions.length ? (
        <View style={styles.substitutionCard}>
          <Text style={styles.substitutionTitle}>进阶动作替换</Text>
          {advancedSubstitutions.map((substitution) => (
            <Text key={`${substitution.exerciseId}-${substitution.alternativeExerciseId}`} style={styles.substitutionText}>
              今日不建议做{substitution.exerciseName}，已自动替换为：
              {substitution.alternativeName}
            </Text>
          ))}
        </View>
      ) : null}

      {visibleDay.blocks.map((block, index) => (
        <DaySection key={`${block.type}-${index}`} block={block} dayLabel={`第 ${visibleDay.macrocycleDay} 天`} />
      ))}

      {day.type === "basketball" ? <BasketballLoadLogger date={planDate} /> : null}
      {day.type === "test" ? <JumpTestCard date={planDate} /> : null}
      {hasSingleLegModule ? (
        <SingleLegStiffnessAssessmentCard date={planDate} dayNumber={day.day} />
      ) : null}
      {day.assessmentProtocolId ? (
        <RightSideAssessmentCard
          date={planDate}
          dayNumber={day.day as 1 | 21 | 42 | 63 | 84}
        />
      ) : null}
      {day.dayInCycle === 21 ? <CycleReviewCard /> : null}

      <DayCompletionPanel
        dayKey={`day-${visibleDay.day}`}
        dayLabel={`第 ${visibleDay.macrocycleDay} 天`}
        dayTitle={visibleDay.title}
        totalActions={totalActions}
      />
      <TrainingLogPanel />

      <DailyNutritionCard dayType={day.type} adjustment={readinessEntry?.adjustment} compact />

      {day.performanceFocus?.length ? (
        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>右侧发力 / 腘绳肌 / 核心重点</Text>
          <View style={styles.chipRow}>
            {day.performanceFocus.map((focus) => (
              <Text key={focus} style={styles.focusChip}>
                {focus}
              </Text>
            ))}
          </View>
          <Text style={styles.focusText}>右侧再平衡：右脚 tripod、右膝轨迹和安静落地优先。</Text>
          <Text style={styles.focusText}>腘绳肌重点：有酸痛时不做 Nordic、硬 RDL、冲刺或最大跳。</Text>
          {focusFlags.length ? (
            <Text style={styles.focusText}>支持模块：{focusFlags.join(" / ")}</Text>
          ) : null}
        </View>
      ) : null}

      <RelatedTermsSection terms={relatedTerms} />
      <FrenchContrastGuidanceCard day={day} readinessEntry={readinessEntry} />

      <Pressable style={styles.adaptiveLink} onPress={() => router.push("/adaptive-plan")}>
        <Text style={styles.adaptiveLinkText}>根据反馈调整计划</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    paddingBottom: 96
  },
  navRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
    alignItems: "center"
  },
  navButton: {
    minWidth: "23%",
    flexGrow: 1,
    minHeight: 40,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    backgroundColor: "#ffffff",
    alignItems: "center"
  },
  navButtonText: {
    color: "#0969da",
    fontWeight: "800",
    fontSize: 13
  },
  sectionKicker: {
    marginTop: 2,
    fontSize: 14,
    color: "#57606a",
    fontWeight: "900"
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "900",
    color: "#1f2328"
  },
  eyebrow: {
    fontSize: 13,
    color: "#57606a",
    fontWeight: "700",
    textTransform: "uppercase"
  },
  cycleMeta: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#57606a",
    fontWeight: "800"
  },
  title: {
    marginTop: 6,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    color: "#1f2328"
  },
  type: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    fontSize: 12,
    fontWeight: "800"
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10
  },
  phaseBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#dafbe1",
    color: "#116329",
    fontSize: 12,
    fontWeight: "800"
  },
  priorityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#fff8c5",
    color: "#6e5500",
    fontSize: 12,
    fontWeight: "800"
  },
  goal: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 24,
    color: "#24292f"
  },
  metaNote: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a",
    fontWeight: "700"
  },
  focusCard: {
    marginTop: 18,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  focusTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1f2328"
  },
  chipRow: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  focusChip: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#f6f8fa",
    color: "#24292f",
    fontSize: 12,
    fontWeight: "800"
  },
  focusText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a"
  },
  readinessCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  bodyReminderCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  bodyReminderTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2328"
  },
  readinessTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2328"
  },
  summaryHeader: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  summaryLevel: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#eaeef2",
    color: "#24292f",
    fontSize: 12,
    fontWeight: "900"
  },
  summaryHeadline: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2328"
  },
  summaryItem: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a"
  },
  fillButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#0969da",
    alignItems: "center"
  },
  fillButtonText: {
    color: "#ffffff",
    fontWeight: "900"
  },
  overlayButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    alignItems: "center"
  },
  overlayButtonActive: {
    backgroundColor: "#0969da"
  },
  overlayButtonText: {
    color: "#0969da",
    fontWeight: "900"
  },
  overlayButtonTextActive: {
    color: "#ffffff"
  },
  adjustedBanner: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    backgroundColor: "#ddf4ff"
  },
  adjustedTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1f2328"
  },
  adjustedText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  },
  warning: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d29922",
    backgroundColor: "#fff8c5"
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1f2328"
  },
  warningText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  },
  substitutionCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bf8700",
    backgroundColor: "#fff8c5"
  },
  substitutionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1f2328"
  },
  substitutionText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  },
  adaptiveLink: {
    minHeight: 44,
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  adaptiveLinkText: {
    color: "#0969da",
    fontSize: 14,
    fontWeight: "900"
  },
  recommendationCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    backgroundColor: "#ddf4ff"
  },
  recommendationKicker: {
    fontSize: 12,
    lineHeight: 18,
    color: "#57606a",
    fontWeight: "900"
  },
  recommendationTitle: {
    marginTop: 4,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "900",
    color: "#1f2328"
  },
  recommendationSubtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "900",
    color: "#1f2328"
  },
  recommendationMetaRow: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  recommendationBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    color: "#0969da",
    fontSize: 12,
    fontWeight: "900"
  },
  recommendationText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  },
  modificationText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#8250df",
    fontWeight: "800"
  },
  recommendationActions: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  recommendationAction: {
    minHeight: 44,
    flexGrow: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    backgroundColor: "#ffffff",
    alignItems: "center"
  },
  recommendationActionText: {
    color: "#0969da",
    fontWeight: "900"
  },
  weekProgressCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  weekProgressTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1f2328"
  },
  weekProgressNote: {
    marginTop: 6,
    fontSize: 13,
    color: "#57606a",
    fontWeight: "800"
  },
  weekProgressItem: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  },
  recommendedSessionCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  recommendedSessionTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
    color: "#1f2328"
  },
  recommendedSessionMeta: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: "#57606a",
    fontWeight: "800"
  },
  completeSessionButton: {
    minHeight: 44,
    marginTop: 16,
    paddingVertical: 13,
    borderRadius: 8,
    backgroundColor: "#0969da",
    alignItems: "center"
  },
  completeSessionButtonText: {
    color: "#ffffff",
    fontWeight: "900"
  },
  legacyTitle: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 22,
    color: "#57606a",
    fontWeight: "900"
  },
  debugCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#f6f8fa"
  },
  debugTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#57606a"
  },
  debugText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "#57606a"
  }
});
