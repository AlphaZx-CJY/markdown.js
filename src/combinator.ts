import type { Parser } from './core/types';

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

export const anyChar: Parser<string> = (input, pos) => {
  if (pos >= input.length) return null;
  return { value: input[pos], nextPos: pos + 1 };
};

export const many =
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
    return { value: result, nextPos: currentPos };
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
  <T, U>(parser: Parser<T>, fn: (value: T) => U | null): Parser<U> =>
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

export const oneOf =
  (s: string): Parser<string> =>
  (input, pos) => {
    if (pos >= input.length) {
      return null;
    }
    if (s.includes(input[pos])) {
      return { value: input[pos], nextPos: pos + 1 };
    }
    return null;
  };

export const skip = <T>(parser: Parser<T>): Parser<void> => map(parser, () => undefined);

export const until =
  <T>(parser: Parser<T>): Parser<string> =>
  (input, pos) => {
    let value = '';
    let cur = pos;
    while (cur < input.length) {
      const result = parser(input, cur);
      if (result !== null) {
        break;
      }
      if (cur >= input.length) {
        return null;
      }
      value += input[cur];
      cur++;
    }
    return {
      value,
      nextPos: cur,
    };
  };

export const eof = (): Parser<null> => (input, pos) => {
  if (pos >= input.length) {
    return {
      value: null,
      nextPos: pos,
    };
  }
  return null;
};
