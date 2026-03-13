interface FractionEntry {
  decimal: number;
  numerator: number;
  denominator: number;
}

const FRACTION_MAP: FractionEntry[] = [
  { decimal: 1 / 2, numerator: 1, denominator: 2 },
  { decimal: 1 / 3, numerator: 1, denominator: 3 },
  { decimal: 2 / 3, numerator: 2, denominator: 3 },
  { decimal: 1 / 4, numerator: 1, denominator: 4 },
  { decimal: 3 / 4, numerator: 3, denominator: 4 },
  { decimal: 1 / 8, numerator: 1, denominator: 8 },
  { decimal: 3 / 8, numerator: 3, denominator: 8 },
  { decimal: 5 / 8, numerator: 5, denominator: 8 },
  { decimal: 7 / 8, numerator: 7, denominator: 8 },
];

const TOLERANCE = 1e-6;

export function decimalToFractionString(value: number): string {
  if (value === 0) return '0';

  const wholePart = Math.floor(value);
  const fractionalPart = value - wholePart;

  if (fractionalPart < TOLERANCE) return String(wholePart);

  const match = FRACTION_MAP.find(
    (entry) => Math.abs(fractionalPart - entry.decimal) < TOLERANCE
  );

  if (match) {
    const fraction = `${match.numerator}/${match.denominator}`;
    return wholePart > 0 ? `${wholePart} ${fraction}` : fraction;
  }

  return String(value);
}

const MIXED_NUMBER = /^\s*(\d+)\s+(\d+)\s*\/\s*(\d+)\s*$/;
const SIMPLE_FRACTION = /^\s*(\d+)\s*\/\s*(\d+)\s*$/;

export function fractionStringToDecimal(value: string): number {
  const trimmed = value.trim();
  if (trimmed === '') return NaN;

  const mixedMatch = trimmed.match(MIXED_NUMBER);
  if (mixedMatch) {
    const denominator = parseInt(mixedMatch[3]);
    if (denominator === 0) return NaN;
    return parseInt(mixedMatch[1]) + parseInt(mixedMatch[2]) / denominator;
  }

  const fractionMatch = trimmed.match(SIMPLE_FRACTION);
  if (fractionMatch) {
    const denominator = parseInt(fractionMatch[2]);
    if (denominator === 0) return NaN;
    return parseInt(fractionMatch[1]) / denominator;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export function filterFractionInput(value: string): string {
  return value.replace(/[^0-9/ ]/g, '');
}
