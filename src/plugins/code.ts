import { anyOf, char, map, sequence, string, until } from '../combinator';
import type { InlineCode } from '../core/ast';
import type { ASTNode, Plugin } from '../core/types';

// TODO: fix `` not effect bug
export default (): Plugin => ({
  name: 'code',
  kind: 'inline',
  parser: map(
    anyOf(
      sequence(
        string('``'), // Parser<string>
        until(string('``')), // Parser<string>
        string('``') // Parser<string>
      ),
      sequence(
        char('`'), // Parser<string>
        until(char('`')), // Parser<string>
        char('`') // Parser<string>
      )
    ),
    ([, content]): InlineCode | null => {
      if (content.length <= 0) {
        return null;
      }
      return {
        type: 'code',
        value: content.trim(),
      };
    }
  ),
  renderer: (_: ASTNode, children: string) => {
    return `<code>${children}</code>`;
  },
});
