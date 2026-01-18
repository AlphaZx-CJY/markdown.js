import type { Parser } from './types';

export const char =
  (c: string): Parser<string> =>
  (input, pos) => {
    if (pos >= input.length || input[pos] !== c) return null;
    return { value: c, nextPos: pos + 1 };
  };

export const string =
  (s: string): Parser<string> =>
  (input, pos) => {
    for (let i = 0; i < s.length; i++) {
      if (pos + i >= input.length || input[pos + i] !== s[i]) return null;
    }
    return { value: s, nextPos: pos + s.length };
  };

export const range =
  (start: string, end: string): Parser<string> =>
  (input, pos) => {
    if (pos >= input.length) return null;
    const c = input[pos];
    if (c < start || c > end) return null;
    return { value: c, nextPos: pos + 1 };
  };

export const anyChar: Parser<string> = (input, pos) => {
  if (pos >= input.length) return null;
  return { value: input[pos], nextPos: pos + 1 };
};

export const many1 =
  <T>(parser: Parser<T>): Parser<T[]> =>
  (input, pos) => {
    const result: T[] = [];
    let currentPos = pos;
    let parsed = parser(input, currentPos);
    while (parsed) {
      result.push(parsed.value);
      currentPos = parsed.nextPos;
      parsed = parser(input, currentPos);
    }
    return result.length ? { value: result, nextPos: currentPos } : null;
  };

export const optional =
  <T>(parser: Parser<T>): Parser<T | null> =>
  (input, pos) => {
    const result = parser(input, pos);
    return result || { value: null, nextPos: pos };
  };

export const map =
  <T, U>(parser: Parser<T>, fn: (value: T) => U): Parser<U> =>
  (input, pos) => {
    const result = parser(input, pos);
    if (!result) {
      return null;
    }
    const transformed = fn(result.value);
    if (!transformed) {
      return null;
    }
    return {
      value: transformed,
      nextPos: result.nextPos,
    };
  };

export const sequence =
  <T extends any[]>(...parsers: { [K in keyof T]: Parser<T[K]> }): Parser<T> =>
  (input, pos) => {
    const values: any[] = [];
    let currentPos = pos;

    for (const parser of parsers) {
      const result = parser(input, currentPos);
      if (!result) return null;
      values.push(result.value);
      currentPos = result.nextPos;
    }

    return {
      value: values as T,
      nextPos: currentPos,
    };
  };

export const anyOf =
  <T>(...parsers: Parser<T>[]): Parser<T> =>
  (input, pos) => {
    for (const parser of parsers) {
      const result = parser(input, pos);
      if (result) return result;
    }
    return null;
  };

export const skip = <T>(parser: Parser<T>): Parser<void> => map(parser, () => undefined);

export function until(endChar: string): Parser<string> {
  return (input, pos) => {
    let end = input.length - endChar.length + 1;
    let cur = pos;
    while (cur <= end) {
      if (input.slice(cur, cur + endChar.length) === endChar) {
        break;
      }
      cur++;
    }
    if (cur > end) {
      return null;
    }
    return { value: input.slice(pos, cur), nextPos: cur };
  };
}
