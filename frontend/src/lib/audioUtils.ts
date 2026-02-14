export function calculateSignalStrength(dataArray: Uint8Array) {
  let sum = 0;

  for (let i = 0; i < dataArray.length; i++) {
    sum += Math.abs(dataArray[i] - 128);
  }

  return sum / dataArray.length;
}

export function getSignalLevel(strength: number) {
  if (strength > 20) return "high";
  if (strength > 10) return "medium";
  return "low";
}
