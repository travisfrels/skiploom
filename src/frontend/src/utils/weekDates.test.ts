import { describe, it, expect } from 'vitest';
import { getWeekStart, formatDateISO } from './weekDates';

describe('getWeekStart', () => {
  it('returns Monday when given a Monday', () => {
    const monday = new Date(2026, 2, 2); // Mon Mar 2, 2026
    const result = getWeekStart(monday);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(2);
  });

  it('returns Monday when given a Tuesday', () => {
    const tuesday = new Date(2026, 2, 3);
    const result = getWeekStart(tuesday);
    expect(result.getDate()).toBe(2);
  });

  it('returns Monday when given a Wednesday', () => {
    const wednesday = new Date(2026, 2, 4);
    const result = getWeekStart(wednesday);
    expect(result.getDate()).toBe(2);
  });

  it('returns Monday when given a Thursday', () => {
    const thursday = new Date(2026, 2, 5);
    const result = getWeekStart(thursday);
    expect(result.getDate()).toBe(2);
  });

  it('returns Monday when given a Friday', () => {
    const friday = new Date(2026, 2, 6);
    const result = getWeekStart(friday);
    expect(result.getDate()).toBe(2);
  });

  it('returns Monday when given a Saturday', () => {
    const saturday = new Date(2026, 2, 7);
    const result = getWeekStart(saturday);
    expect(result.getDate()).toBe(2);
  });

  it('returns Monday when given a Sunday', () => {
    const sunday = new Date(2026, 2, 8);
    const result = getWeekStart(sunday);
    expect(result.getDate()).toBe(2);
  });

  it('handles month boundary (Sunday in prior month week)', () => {
    const sunday = new Date(2026, 2, 1); // Sun Mar 1, 2026
    const result = getWeekStart(sunday);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getDate()).toBe(23);
  });

  it('handles year boundary', () => {
    const thursday = new Date(2026, 0, 1); // Thu Jan 1, 2026
    const result = getWeekStart(thursday);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(11); // December
    expect(result.getDate()).toBe(29);
  });

  it('zeroes out hours, minutes, seconds, and milliseconds', () => {
    const dateWithTime = new Date(2026, 2, 4, 15, 30, 45, 123);
    const result = getWeekStart(dateWithTime);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('does not mutate the input date', () => {
    const original = new Date(2026, 2, 4, 15, 30);
    const originalTime = original.getTime();
    getWeekStart(original);
    expect(original.getTime()).toBe(originalTime);
  });
});

describe('formatDateISO', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(formatDateISO(new Date(2026, 2, 2))).toBe('2026-03-02');
  });

  it('zero-pads single-digit month', () => {
    expect(formatDateISO(new Date(2026, 0, 15))).toBe('2026-01-15');
  });

  it('zero-pads single-digit day', () => {
    expect(formatDateISO(new Date(2026, 11, 5))).toBe('2026-12-05');
  });

  it('handles December 31', () => {
    expect(formatDateISO(new Date(2025, 11, 31))).toBe('2025-12-31');
  });
});
