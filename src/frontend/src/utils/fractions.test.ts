import { describe, it, expect } from 'vitest';
import { decimalToFractionString, fractionStringToDecimal } from './fractions';

describe('decimalToFractionString', () => {
  it('converts 0 to "0"', () => {
    expect(decimalToFractionString(0)).toBe('0');
  });

  it('converts whole numbers', () => {
    expect(decimalToFractionString(1)).toBe('1');
    expect(decimalToFractionString(3)).toBe('3');
  });

  it('converts halves', () => {
    expect(decimalToFractionString(0.5)).toBe('1/2');
  });

  it('converts thirds with floating-point tolerance', () => {
    expect(decimalToFractionString(1 / 3)).toBe('1/3');
    expect(decimalToFractionString(2 / 3)).toBe('2/3');
  });

  it('converts quarters', () => {
    expect(decimalToFractionString(0.25)).toBe('1/4');
    expect(decimalToFractionString(0.75)).toBe('3/4');
  });

  it('converts eighths', () => {
    expect(decimalToFractionString(0.125)).toBe('1/8');
    expect(decimalToFractionString(0.375)).toBe('3/8');
    expect(decimalToFractionString(0.625)).toBe('5/8');
    expect(decimalToFractionString(0.875)).toBe('7/8');
  });

  it('converts mixed numbers', () => {
    expect(decimalToFractionString(1.5)).toBe('1 1/2');
    expect(decimalToFractionString(2.75)).toBe('2 3/4');
    expect(decimalToFractionString(1 + 1 / 3)).toBe('1 1/3');
  });

  it('falls back to decimal string for unsupported fractions', () => {
    expect(decimalToFractionString(0.123)).toBe('0.123');
  });
});

describe('fractionStringToDecimal', () => {
  it('parses "0" to 0', () => {
    expect(fractionStringToDecimal('0')).toBe(0);
  });

  it('parses whole numbers', () => {
    expect(fractionStringToDecimal('3')).toBe(3);
  });

  it('parses simple fractions', () => {
    expect(fractionStringToDecimal('1/2')).toBe(0.5);
    expect(fractionStringToDecimal('1/3')).toBeCloseTo(1 / 3);
    expect(fractionStringToDecimal('2/3')).toBeCloseTo(2 / 3);
    expect(fractionStringToDecimal('1/4')).toBe(0.25);
    expect(fractionStringToDecimal('3/4')).toBe(0.75);
    expect(fractionStringToDecimal('1/8')).toBe(0.125);
  });

  it('parses mixed numbers', () => {
    expect(fractionStringToDecimal('1 1/2')).toBe(1.5);
    expect(fractionStringToDecimal('2 3/4')).toBe(2.75);
  });

  it('parses decimal string input', () => {
    expect(fractionStringToDecimal('0.5')).toBe(0.5);
    expect(fractionStringToDecimal('1.5')).toBe(1.5);
  });

  it('handles leading and trailing whitespace', () => {
    expect(fractionStringToDecimal(' 1/2 ')).toBe(0.5);
  });

  it('handles extra spaces around slash', () => {
    expect(fractionStringToDecimal('1 / 2')).toBe(0.5);
  });

  it('handles extra spaces in mixed numbers', () => {
    expect(fractionStringToDecimal('1  1/2')).toBe(1.5);
  });

  it('returns NaN for empty string', () => {
    expect(fractionStringToDecimal('')).toBeNaN();
  });

  it('returns NaN for non-numeric text', () => {
    expect(fractionStringToDecimal('abc')).toBeNaN();
  });

  it('returns NaN for invalid fraction format', () => {
    expect(fractionStringToDecimal('1//2')).toBeNaN();
  });

  it('returns NaN for slash-only input', () => {
    expect(fractionStringToDecimal('/3')).toBeNaN();
  });

  it('returns NaN for zero denominator', () => {
    expect(fractionStringToDecimal('1/0')).toBeNaN();
  });
});
