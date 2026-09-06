import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { BodySignalsCard } from "@/components/BodySignalsCard";
import { TrainingReminderCard } from "@/components/TrainingReminderCard";
import { useBodySignals } from "@/context/BodySignalsContext";
import { generateTrainingReminders } from "@/logic/bodySignalEvaluation";
import { formatLocalDate } from "@/logic/localDate";
import { mockOuraService, mockWhoopService, mockWithingsService } from "@/services/wearableIntegrations";
import type {
  BasketballLoadSignals,
  BodySignalBaseline,
  DailyBodySignals,
  DailyPainAndMovementSignals,
  DailyWearableSignals,
  WithingsBodySignals
} from "@/types/bodySignals";

type WearableField =
  | "ouraReadiness"
  | "ouraSleepScore"
  | "ouraHrvMs"
  | "ouraRestingHr"
  | "whoopRecovery"
  | "whoopStrain"
  | "whoopHrvMs"
  | "whoopRestingHr";
type PainField =
  | "anteriorKneeSoreness"
  | "achillesStiffness"
  | "patellarPain"
  | "leftMedialAnklePain"
  | "pogoPainRepThreshold"
  | "hamstringSoreness"
  | "movementQualityToday";
type BasketballField = "durationMinutes" | "sessionRpe";
type WithingsField = "weightKg" | "muscleMassKg" | "leftRightLegMuscleDifferencePercent";
type BaselineField = "hrvMsBaseline" | "restingHrBaseline" | "weightKgBaseline" | "muscleMassKgBaseline";

const wearableLabels: Record<WearableField, string> = {
  ouraReadiness: "Oura readiness",
  ouraSleepScore: "Oura sleep",
  ouraHrvMs: "Oura HRV",
  ouraRestingHr: "Oura RHR",
  whoopRecovery: "WHOOP recovery",
  whoopStrain: "WHOOP strain",
  whoopHrvMs: "WHOOP HRV",
  whoopRestingHr: "WHOOP RHR"
};

const painLabels: Record<PainField, string> = {
  anteriorKneeSoreness: "膝前侧 / 髌骨上方酸痛",
  achillesStiffness: "跟腱晨僵",
  patellarPain: "髌腱疼痛",
  leftMedialAnklePain: "左内侧踝疼痛",
  pogoPainRepThreshold: "Pogo 疼痛阈值（第几次）",
  hamstringSoreness: "腘绳肌酸痛",
  movementQualityToday: "今日动作质量"
};

const withingsLabels: Record<WithingsField, string> = {
  weightKg: "体重 kg",
  muscleMassKg: "肌肉量 kg",
  leftRightLegMuscleDifferencePercent: "左右腿肌肉差 %"
};

const baselineLabels: Record<BaselineField, string> = {
  hrvMsBaseline: "HRV baseline",
  restingHrBaseline: "RHR baseline",
  weightKgBaseline: "体重 baseline",
  muscleMassKgBaseline: "肌肉量 baseline"
};

function todayDate() {
  return formatLocalDate();
}

function parseOptional(rawValue: string): number | undefined {
  if (!rawValue.trim()) {
    return undefined;
  }

  const value = Number(rawValue.replace(/[^\d.]/g, ""));
  return Number.isFinite(value) ? value : undefined;
}

function toScore(value: number | undefined, min: number, max: number) {
  if (value === undefined) {
    return undefined;
  }

  return Math.min(Math.max(Math.round(value), min), max);
}

function InputRow({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.inputRow}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        keyboardType="numeric"
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? "可选"}
        style={styles.input}
      />
    </View>
  );
}

export default function BodySignalsScreen() {
  const { saveBodySignals } = useBodySignals();
  const [savedMessage, setSavedMessage] = useState("");
  const [wearableValues, setWearableValues] = useState<Record<WearableField, string>>({
    ouraReadiness: "",
    ouraSleepScore: "",
    ouraHrvMs: "",
    ouraRestingHr: "",
    whoopRecovery: "",
    whoopStrain: "",
    whoopHrvMs: "",
    whoopRestingHr: ""
  });
  const [painValues, setPainValues] = useState<Record<PainField, string>>({
    anteriorKneeSoreness: "0",
    achillesStiffness: "0",
    patellarPain: "0",
    leftMedialAnklePain: "0",
    pogoPainRepThreshold: "",
    hamstringSoreness: "0",
    movementQualityToday: "4"
  });
  const [basketballValues, setBasketballValues] = useState<Record<BasketballField, string>>({
    durationMinutes: "",
    sessionRpe: ""
  });
  const [playedBasketball, setPlayedBasketball] = useState(false);
  const [repeatedMaxJumps, setRepeatedMaxJumps] = useState(false);
  const [withingsValues, setWithingsValues] = useState<Record<WithingsField, string>>({
    weightKg: "",
    muscleMassKg: "",
    leftRightLegMuscleDifferencePercent: ""
  });
  const [baselineValues, setBaselineValues] = useState<Record<BaselineField, string>>({
    hrvMsBaseline: "",
    restingHrBaseline: "",
    weightKgBaseline: "",
    muscleMassKgBaseline: ""
  });

  const date = todayDate();
  const bodySignals = useMemo<DailyBodySignals>(() => {
    const wearable: DailyWearableSignals = {
      date,
      source: "manual",
      ouraReadiness: toScore(parseOptional(wearableValues.ouraReadiness), 0, 100),
      ouraSleepScore: toScore(parseOptional(wearableValues.ouraSleepScore), 0, 100),
      ouraHrvMs: parseOptional(wearableValues.ouraHrvMs),
      ouraRestingHr: parseOptional(wearableValues.ouraRestingHr),
      whoopRecovery: toScore(parseOptional(wearableValues.whoopRecovery), 0, 100),
      whoopStrain: parseOptional(wearableValues.whoopStrain),
      whoopHrvMs: parseOptional(wearableValues.whoopHrvMs),
      whoopRestingHr: parseOptional(wearableValues.whoopRestingHr)
    };
    const painAndMovement: DailyPainAndMovementSignals = {
      date,
      anteriorKneeSoreness: parseOptional(painValues.anteriorKneeSoreness) ?? 0,
      achillesStiffness: parseOptional(painValues.achillesStiffness) ?? 0,
      patellarPain: parseOptional(painValues.patellarPain) ?? 0,
      leftMedialAnklePain: parseOptional(painValues.leftMedialAnklePain) ?? 0,
      pogoPainRepThreshold: parseOptional(painValues.pogoPainRepThreshold),
      hamstringSoreness: parseOptional(painValues.hamstringSoreness) ?? 0,
      movementQualityToday: toScore(parseOptional(painValues.movementQualityToday), 1, 5) as 1 | 2 | 3 | 4 | 5
    };
    const basketballLoad: BasketballLoadSignals = {
      date,
      playedBasketball,
      durationMinutes: parseOptional(basketballValues.durationMinutes),
      sessionRpe: parseOptional(basketballValues.sessionRpe),
      repeatedMaxJumps
    };
    const withings: WithingsBodySignals = {
      date,
      weightKg: parseOptional(withingsValues.weightKg),
      muscleMassKg: parseOptional(withingsValues.muscleMassKg),
      leftRightLegMuscleDifferencePercent: parseOptional(withingsValues.leftRightLegMuscleDifferencePercent)
    };

    return {
      date,
      wearable,
      painAndMovement,
      basketballLoad,
      withings
    };
  }, [basketballValues, date, painValues, playedBasketball, repeatedMaxJumps, wearableValues, withingsValues]);

  const baseline = useMemo<BodySignalBaseline>(
    () => ({
      hrvMsBaseline: parseOptional(baselineValues.hrvMsBaseline),
      restingHrBaseline: parseOptional(baselineValues.restingHrBaseline),
      weightKgBaseline: parseOptional(baselineValues.weightKgBaseline),
      muscleMassKgBaseline: parseOptional(baselineValues.muscleMassKgBaseline)
    }),
    [baselineValues]
  );
  const reminders = useMemo(
    () => generateTrainingReminders(bodySignals, baseline),
    [baseline, bodySignals]
  );

  const updateValue = <T extends string>(
    setter: React.Dispatch<React.SetStateAction<Record<T, string>>>,
    field: T,
    value: string
  ) => {
    setter((current) => ({ ...current, [field]: value }));
    setSavedMessage("");
  };

  const loadMockData = async () => {
    const [oura, whoop, withings] = await Promise.all([
      mockOuraService.getDailyWearableSignals(date),
      mockWhoopService.getDailyWearableSignals(date),
      mockWithingsService.getWithingsBodySignals(date)
    ]);
    setWearableValues((current) => ({
      ...current,
      ouraReadiness: String(oura?.ouraReadiness ?? ""),
      ouraSleepScore: String(oura?.ouraSleepScore ?? ""),
      ouraHrvMs: String(oura?.ouraHrvMs ?? ""),
      ouraRestingHr: String(oura?.ouraRestingHr ?? ""),
      whoopRecovery: String(whoop?.whoopRecovery ?? ""),
      whoopStrain: String(whoop?.whoopStrain ?? ""),
      whoopHrvMs: String(whoop?.whoopHrvMs ?? ""),
      whoopRestingHr: String(whoop?.whoopRestingHr ?? "")
    }));
    setWithingsValues({
      weightKg: String(withings?.weightKg ?? ""),
      muscleMassKg: String(withings?.muscleMassKg ?? ""),
      leftRightLegMuscleDifferencePercent: String(withings?.leftRightLegMuscleDifferencePercent ?? "")
    });
    setSavedMessage("已载入 mock 设备数据。");
  };

  const save = () => {
    saveBodySignals(bodySignals, baseline);
    setSavedMessage("已保存今天的身体数据提醒。");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>身体数据提醒</Text>
      <Text style={styles.subtitle}>
        手动记录 WHOOP、Oura、Withings 和疼痛/篮球负荷。可穿戴设备不覆盖疼痛和动作质量；Withings 只做趋势复盘。
      </Text>

      <Pressable style={styles.secondaryButton} onPress={loadMockData}>
        <Text style={styles.secondaryButtonText}>载入 mock 设备数据</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>今日设备数据</Text>
      <BodySignalsCard signals={bodySignals} />

      <Text style={styles.sectionTitle}>手动输入</Text>
      <View style={styles.card}>
        {(Object.keys(wearableLabels) as WearableField[]).map((field) => (
          <InputRow
            key={field}
            label={wearableLabels[field]}
            value={wearableValues[field]}
            onChange={(value) => updateValue(setWearableValues, field, value)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>篮球负荷</Text>
      <View style={styles.card}>
        <Pressable style={[styles.toggle, playedBasketball && styles.toggleActive]} onPress={() => setPlayedBasketball((value) => !value)}>
          <Text style={[styles.toggleText, playedBasketball && styles.toggleTextActive]}>
            {playedBasketball ? "今天有篮球" : "今天无篮球"}
          </Text>
        </Pressable>
        <InputRow label="篮球时长" value={basketballValues.durationMinutes} onChange={(value) => updateValue(setBasketballValues, "durationMinutes", value)} placeholder="分钟" />
        <InputRow label="Session RPE" value={basketballValues.sessionRpe} onChange={(value) => updateValue(setBasketballValues, "sessionRpe", value)} placeholder="1-10" />
        <Pressable style={[styles.toggle, repeatedMaxJumps && styles.toggleActive]} onPress={() => setRepeatedMaxJumps((value) => !value)}>
          <Text style={[styles.toggleText, repeatedMaxJumps && styles.toggleTextActive]}>
            {repeatedMaxJumps ? "有反复最大跳" : "没有反复最大跳"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>膝盖 / 跟腱 / 腘绳肌状态</Text>
      <View style={styles.card}>
        {(Object.keys(painLabels) as PainField[]).map((field) => (
          <InputRow
            key={field}
            label={painLabels[field]}
            value={painValues[field]}
            onChange={(value) => updateValue(setPainValues, field, value)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Withings 身体成分趋势</Text>
      <View style={styles.card}>
        {(Object.keys(withingsLabels) as WithingsField[]).map((field) => (
          <InputRow
            key={field}
            label={withingsLabels[field]}
            value={withingsValues[field]}
            onChange={(value) => updateValue(setWithingsValues, field, value)}
          />
        ))}
        <Text style={styles.helpText}>身体成分只用于 7–14 天趋势提醒，不直接改变当天训练强度。</Text>
      </View>

      <Text style={styles.sectionTitle}>Baseline（可选）</Text>
      <View style={styles.card}>
        {(Object.keys(baselineLabels) as BaselineField[]).map((field) => (
          <InputRow
            key={field}
            label={baselineLabels[field]}
            value={baselineValues[field]}
            onChange={(value) => updateValue(setBaselineValues, field, value)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>训练建议</Text>
      {reminders.map((reminder) => (
        <TrainingReminderCard key={reminder.id} reminder={reminder} />
      ))}

      <Pressable style={styles.saveButton} onPress={save}>
        <Text style={styles.saveButtonText}>保存今天身体数据</Text>
      </Pressable>
      {savedMessage ? <Text style={styles.saved}>{savedMessage}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    paddingBottom: 96
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
    marginTop: 20,
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2328"
  },
  card: {
    marginTop: 10,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  inputRow: {
    marginTop: 10
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#24292f"
  },
  input: {
    minHeight: 44,
    marginTop: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#f6f8fa",
    fontSize: 16,
    color: "#1f2328"
  },
  toggle: {
    minHeight: 44,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  toggleActive: {
    backgroundColor: "#0969da"
  },
  toggleText: {
    color: "#0969da",
    fontWeight: "900"
  },
  toggleTextActive: {
    color: "#ffffff"
  },
  helpText: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    color: "#57606a"
  },
  secondaryButton: {
    minHeight: 44,
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  secondaryButtonText: {
    color: "#0969da",
    fontWeight: "900"
  },
  saveButton: {
    minHeight: 44,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#0969da",
    alignItems: "center"
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "900"
  },
  saved: {
    marginTop: 10,
    fontSize: 14,
    color: "#116329",
    fontWeight: "800",
    textAlign: "center"
  }
});
