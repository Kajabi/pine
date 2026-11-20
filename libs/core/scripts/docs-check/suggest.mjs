import { compareStrings } from './context.mjs';

function distance(a, b) {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    previous = current;
  }
  return previous[b.length];
}

/** The candidate closest to `value`, if it is within a third of the value's length; ties go to the first in code-unit order. */
export function closest(value, candidates) {
  const limit = Math.max(1, Math.floor(value.length / 3));
  let best = null;
  let bestDistance = Infinity;
  for (const candidate of [...candidates].sort(compareStrings)) {
    const d = distance(value.toLowerCase(), candidate.toLowerCase());
    if (d < bestDistance) {
      best = candidate;
      bestDistance = d;
    }
  }
  return bestDistance <= limit ? best : null;
}
