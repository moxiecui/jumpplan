export interface CycleTwoAnkleInput {
  leftMedialAnklePain?: number;
  pogoPainRepThreshold?: number;
}

export function shouldBlockCycleTwoElastic(input: CycleTwoAnkleInput) {
  return (input.leftMedialAnklePain ?? 0) >= 3;
}

export function shouldUseCycleTwoRecoverySubstitution(input: CycleTwoAnkleInput) {
  return (input.leftMedialAnklePain ?? 0) >= 2;
}

export function shouldProgressCycleTwoPogo(input: CycleTwoAnkleInput) {
  if (shouldBlockCycleTwoElastic(input)) {
    return false;
  }

  return input.pogoPainRepThreshold === undefined || input.pogoPainRepThreshold > 12;
}

