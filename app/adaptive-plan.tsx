import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { AdaptivePlanPreview } from "@/components/AdaptivePlanPreview";
import { usePerformance } from "@/context/PerformanceContext";
import { useReadiness } from "@/context/ReadinessContext";
import { useTrainingLog } from "@/context/TrainingLogContext";
import { trainingPlan } from "@/data/plan";
import { mockPlanGenerationService } from "@/services/mockPlanGenerationService";
import type {
  GeneratedAdaptivePlan,
  PlanGenerationRequest,
  PlanGenerationTrigger,
  PlanLength,
  TrainingFeedback
} from "@/types/adaptivePlan";

const triggerOptions: Array<{ value: PlanGenerationTrigger; label: string }> = [
  { value: "mid-cycle-adjustment", label: "训练中微调" },
  { value: "end-of-cycle-regeneration", label: "周期结束后生成" },
  { value: "manual-request", label: "手动生成" }
];

const lengthOptions: Array<{ value: PlanLength; label: string }> = [
  { value: "3-days", label: "3 天" },
  { value: "7-days", label: "7 天" },
  { value: "10-days", label: "10 天" },
  { value: "21-days", label: "21 天" },
  { value: "4-weeks", label: "4 周" }
];

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseOptionalNumber(value: string) {
  if (!value.trim()) {
    return undefined;
  }

  const next = Number(value.replace(/[^\d.]/g, ""));
  return Number.isNaN(next) ? undefined : next;
}

function ToggleButton({
  active,
  label,
  onPress
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.toggle, active && styles.toggleActive]} onPress={onPress}>
      <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function AdaptivePlanScreen() {
  const { basketballLogs, assessments, jumpTests } = usePerformance();
  const { entriesByDate } = useReadiness();
  const { entries, dayCompletions } = useTrainingLog();
  const [trigger, setTrigger] = useState<PlanGenerationTrigger>("mid-cycle-adjustment");
  const [requestedLength, setRequestedLength] = useState<PlanLength>("21-days");
  const [completedExerciseIds, setCompletedExerciseIds] = useState("");
  const [skippedExerciseIds, setSkippedExerciseIds] = useState("");
  const [difficultExerciseIds, setDifficultExerciseIds] = useState("");
  const [achillesPain, setAchillesPain] = useState("0");
  const [patellarPain, setPatellarPain] = useState("0");
  const [calfTightness, setCalfTightness] = useState("0");
  const [rightKneeValgusObserved, setRightKneeValgusObserved] = useState(false);
  const [landingFeltHeavy, setLandingFeltHeavy] = useState(false);
  const [extraBasketball, setExtraBasketball] = useState(false);
  const [subjectiveEnergy, setSubjectiveEnergy] = useState("3");
  const [basketballSessionsPerWeek, setBasketballSessionsPerWeek] = useState("3");
  const [notes, setNotes] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedAdaptivePlan | undefined>();
  const [adoptedPlan, setAdoptedPlan] = useState<GeneratedAdaptivePlan | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  const buildRequest = (): PlanGenerationRequest => {
    const feedback: TrainingFeedback = {
      date: todayDate(),
      completedExerciseIds: parseList(completedExerciseIds),
      skippedExerciseIds: parseList(skippedExerciseIds),
      difficultExerciseIds: parseList(difficultExerciseIds),
      achillesPain: parseOptionalNumber(achillesPain),
      patellarPain: parseOptionalNumber(patellarPain),
      calfTightness: parseOptionalNumber(calfTightness),
      rightKneeValgusObserved,
      landingFeltHeavy,
      extraBasketball,
      subjectiveEnergy: parseOptionalNumber(subjectiveEnergy),
      notes
    };

    return {
      trigger,
      requestedLength,
      currentPlanTitle: "JumpPlan 21-day vertical jump performance plan",
      recentFeedback: [feedback],
      readinessContext: Object.values(entriesByDate).map((entry) => entry.adjustment),
      performanceContext: {
        jumpContacts: [
          {
            plannedContacts: 0,
            completedContacts: entries.reduce(
              (total, entry) => total + (entry.actualJumpContacts ?? 0),
              0
            ),
            maxIntentContacts: entries.reduce(
              (total, entry) => total + (entry.maxIntentContacts ?? 0),
              0
            ),
            landingOnlyContacts: entries.reduce(
              (total, entry) => total + (entry.landingOnlyContacts ?? 0),
              0
            ),
            estimatedBasketballContacts: basketballLogs.reduce(
              (total, log) => total + (log.estimatedJumpContacts ?? 0),
              0
            )
          }
        ],
        basketballLogs,
        jumpTests,
        rightSideAssessments: assessments,
        highImpactDayCount: dayCompletions.filter((completion) => {
          const dayNumber = Number(completion.dayLabel.replace(/[^\d]/g, ""));
          return trainingPlan.find((day) => day.day === dayNumber)?.impactLevel === "high";
        }).length,
        hamstringSorenessTrend: Object.values(entriesByDate)
          .map((entry) => entry.subjective?.hamstringSoreness)
          .filter((value): value is number => typeof value === "number"),
        skippedExerciseIds: entries
          .filter((entry) => entry.status === "skipped")
          .map((entry) => entry.exerciseId),
        regressedExerciseIds: entries
          .filter((entry) => entry.status === "regressed")
          .map((entry) => entry.exerciseId)
      },
      cycleSummary:
        trigger === "end-of-cycle-regeneration"
          ? {
              startDate: todayDate(),
              endDate: todayDate(),
              completedDays: 21,
              plannedDays: 21,
              completionRate: 1,
              achillesPainTrend: "unknown",
              patellarPainTrend: "unknown",
              mainUserNotes: notes
            }
          : undefined,
      constraints: {
        basketballSessionsPerWeek: parseOptionalNumber(basketballSessionsPerWeek) ?? 3,
        maxHighImpactDaysPerWeek: 2,
        prioritizeTendonSafety: true,
        rightKneeTrackingFocus: true,
        allowPAP: false,
        allowMaxJumpTesting: false,
        equipmentAvailable: ["trap-bar", "bands", "foam-roller", "bike"]
      },
      userGoal: "篮球垂直弹跳提升，同时保护跟腱、髌腱、右脚足弓和右膝力线。"
    };
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    const plan = await mockPlanGenerationService.generateAdaptivePlan(buildRequest());
    setGeneratedPlan(plan);
    setIsGenerating(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>生成新计划</Text>
      <Text style={styles.subtitle}>
        现在使用本地 mock 规则生成。未来可以把同样请求发到你自己的后端，不在手机端放 API key。
      </Text>

      <Text style={styles.sectionTitle}>Trigger</Text>
      <View style={styles.toggleRow}>
        {triggerOptions.map((option) => (
          <ToggleButton
            key={option.value}
            label={option.label}
            active={trigger === option.value}
            onPress={() => setTrigger(option.value)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>计划长度</Text>
      <View style={styles.toggleRow}>
        {lengthOptions.map((option) => (
          <ToggleButton
            key={option.value}
            label={option.label}
            active={requestedLength === option.value}
            onPress={() => setRequestedLength(option.value)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Feedback</Text>
      <TextInput
        style={styles.input}
        value={completedExerciseIds}
        onChangeText={setCompletedExerciseIds}
        placeholder="今天完成了哪些训练，用逗号分隔 exerciseId"
      />
      <TextInput
        style={styles.input}
        value={skippedExerciseIds}
        onChangeText={setSkippedExerciseIds}
        placeholder="哪些动作跳过，用逗号分隔"
      />
      <TextInput
        style={styles.input}
        value={difficultExerciseIds}
        onChangeText={setDifficultExerciseIds}
        placeholder="哪些动作很难，用逗号分隔"
      />

      <View style={styles.grid}>
        <TextInput style={styles.gridInput} value={achillesPain} onChangeText={setAchillesPain} keyboardType="numeric" placeholder="跟腱疼痛 0–10" />
        <TextInput style={styles.gridInput} value={patellarPain} onChangeText={setPatellarPain} keyboardType="numeric" placeholder="髌腱疼痛 0–10" />
        <TextInput style={styles.gridInput} value={calfTightness} onChangeText={setCalfTightness} keyboardType="numeric" placeholder="小腿紧绷 0–10" />
        <TextInput style={styles.gridInput} value={subjectiveEnergy} onChangeText={setSubjectiveEnergy} keyboardType="numeric" placeholder="主观能量 1–5" />
        <TextInput style={styles.gridInput} value={basketballSessionsPerWeek} onChangeText={setBasketballSessionsPerWeek} keyboardType="numeric" placeholder="每周篮球次数" />
      </View>

      <View style={styles.toggleRow}>
        <ToggleButton
          label="右膝内扣"
          active={rightKneeValgusObserved}
          onPress={() => setRightKneeValgusObserved((value) => !value)}
        />
        <ToggleButton
          label="落地很重"
          active={landingFeltHeavy}
          onPress={() => setLandingFeltHeavy((value) => !value)}
        />
        <ToggleButton
          label="额外篮球"
          active={extraBasketball}
          onPress={() => setExtraBasketball((value) => !value)}
        />
      </View>

      <TextInput
        style={[styles.input, styles.textArea]}
        value={notes}
        onChangeText={setNotes}
        placeholder="notes"
        multiline
      />

      <Pressable style={styles.primaryButton} onPress={generatePlan} disabled={isGenerating}>
        <Text style={styles.primaryButtonText}>
          {isGenerating ? "生成中..." : "生成调整计划"}
        </Text>
      </Pressable>

      {generatedPlan ? (
        <>
          <AdaptivePlanPreview plan={generatedPlan} />
          <Pressable style={styles.secondaryButton} onPress={() => setAdoptedPlan(generatedPlan)}>
            <Text style={styles.secondaryButtonText}>采用这个计划</Text>
          </Pressable>
        </>
      ) : null}

      {adoptedPlan ? (
        <Text style={styles.adoptedText}>已在本页面采用：{adoptedPlan.metadata.title}</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 36
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#1f2328"
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#57606a"
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2328"
  },
  toggleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  toggle: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#ffffff"
  },
  toggleActive: {
    backgroundColor: "#0969da",
    borderColor: "#0969da"
  },
  toggleText: {
    color: "#24292f",
    fontWeight: "800"
  },
  toggleTextActive: {
    color: "#ffffff"
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d0d7de",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: "#1f2328",
    backgroundColor: "#ffffff"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  gridInput: {
    width: "47%",
    borderWidth: 1,
    borderColor: "#d0d7de",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: "#1f2328",
    backgroundColor: "#ffffff"
  },
  textArea: {
    minHeight: 90,
    marginTop: 12,
    textAlignVertical: "top"
  },
  primaryButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#0969da",
    alignItems: "center"
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16
  },
  secondaryButton: {
    marginTop: 14,
    paddingVertical: 13,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    alignItems: "center"
  },
  secondaryButtonText: {
    color: "#0969da",
    fontWeight: "900"
  },
  adoptedText: {
    marginTop: 12,
    color: "#116329",
    fontWeight: "900"
  }
});
