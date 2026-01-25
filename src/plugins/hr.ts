import { anyOf, char, eof, map, optional, sequence, string, until } from '../combinator';
import type { HorizontalRule } from '../core/ast';
import type { ASTNode, Plugin } from '../core/types';

export default (): Plugin => ({
  name: 'hr',
  kind: 'block',
  parser: map(
    anyOf(
      sequence(
        string('***'), // Parser<string>
        until(anyOf(char('\n'), eof())),
        optional(char('\n')) // Parser<string>
      ),
      sequence(
        string('---'), // Parser<string>
        until(anyOf(char('\n'), eof())),
        optional(char('\n')) // Parser<string>
      )
    ),
    ([, content]): HorizontalRule | null => {
      if (content.trim().length === 0) {
        return {
          type: 'hr',
        };
      }
      return null;
    }
  ),
  renderer: (_: ASTNode, __: string) => {
    return `<hr />`;
  },
});
