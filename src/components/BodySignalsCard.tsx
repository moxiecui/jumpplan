import { StyleSheet, Text, View } from "react-native";

import { evaluateBasketballLoad } from "@/logic/bodySignalEvaluation";
import type { DailyBodySignals } from "@/types/bodySignals";

interface BodySignalsCardProps {
  signals?: DailyBodySignals;
  compact?: boolean;
}

function formatValue(value: number | undefined, suffix = "") {
  return value === undefined ? "未填" : `${value}${suffix}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function BodySignalsCard({ signals, compact }: BodySignalsCardProps) {
  if (!signals) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>今日设备数据</Text>
        <Text style={styles.empty}>
          还没有今天的 WHOOP / Oura / Withings 数据。可以手动输入，之后再接后端同步。
        </Text>
      </View>
    );
  }

  const wearable = signals.wearable;
  const pain = signals.painAndMovement;
  const basketballLoad = signals.basketballLoad ? evaluateBasketballLoad(signals.basketballLoad) : undefined;
  const withings = signals.withings;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>今日设备数据</Text>
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Oura / WHOOP</Text>
        <Row label="Oura readiness" value={formatValue(wearable?.ouraReadiness)} />
        <Row label="Oura sleep" value={formatValue(wearable?.ouraSleepScore)} />
        <Row label="Oura HRV / RHR" value={`${formatValue(wearable?.ouraHrvMs, " ms")} / ${formatValue(wearable?.ouraRestingHr, " bpm")}`} />
        <Row label="WHOOP recovery" value={formatValue(wearable?.whoopRecovery)} />
        <Row label="WHOOP strain" value={formatValue(wearable?.whoopStrain)} />
        <Row label="WHOOP HRV / RHR" value={`${formatValue(wearable?.whoopHrvMs, " ms")} / ${formatValue(wearable?.whoopRestingHr, " bpm")}`} />
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>疼痛 / 动作质量</Text>
        <Row label="膝前侧 / 跟腱 / 髌腱" value={`${formatValue(pain?.anteriorKneeSoreness)}/${formatValue(pain?.achillesStiffness)}/${formatValue(pain?.patellarPain)}`} />
        <Row label="腘绳肌 / 小腿" value={`${formatValue(pain?.hamstringSoreness)}/${formatValue(pain?.calfTightness)}`} />
        <Row label="动作质量 / 右膝轨迹" value={`${formatValue(pain?.movementQualityToday)}/${formatValue(pain?.rightKneeTracking)}`} />
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>篮球负荷</Text>
        <Row label="负荷等级" value={basketballLoad ?? "未填"} />
        <Row label="时长 / RPE" value={`${formatValue(signals.basketballLoad?.durationMinutes, " 分钟")} / ${formatValue(signals.basketballLoad?.sessionRpe)}`} />
      </View>

      {!compact ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Withings 身体成分趋势</Text>
          <Row label="体重 / 肌肉量" value={`${formatValue(withings?.weightKg, " kg")} / ${formatValue(withings?.muscleMassKg, " kg")}`} />
          <Row label="体脂 / 水分" value={`${formatValue(withings?.bodyFatPercent, "%")} / ${formatValue(withings?.bodyWaterPercent, "%")}`} />
          <Row label="左右腿肌肉差" value={formatValue(withings?.leftRightLegMuscleDifferencePercent, "%")} />
          <Text style={styles.trendNote}>Withings 只用于周度或 14 天趋势复盘，不直接决定当天训练强度。</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  title: {
    fontSize: 17,
    fontWeight: "900",
    color: "#1f2328"
  },
  empty: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a"
  },
  block: {
    marginTop: 12
  },
  blockTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#24292f",
    marginBottom: 6
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 4
  },
  rowLabel: {
    flex: 1,
    fontSize: 13,
    color: "#57606a",
    fontWeight: "700"
  },
  rowValue: {
    flex: 1,
    fontSize: 13,
    color: "#1f2328",
    fontWeight: "800",
    textAlign: "right"
  },
  trendNote: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#57606a"
  }
});
