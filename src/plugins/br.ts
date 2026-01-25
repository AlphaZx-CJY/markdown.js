import { anyOf, char, many1, map, sequence, string } from '../combinator';
import type { LineBreak } from '../core/ast';
import type { ASTNode, Plugin } from '../core/types';

// TODO: fix multi blank line
export default (): Plugin => ({
  name: 'linebreak',
  kind: 'both',
  parser: map(
    anyOf(
      string('<br>'),
      string('<br />'),
      map(many1(string('  \n')), () => '\n'),
      map(sequence(char('\n'), many1(char('\n'))), () => '\n')
    ),
    (_: string): LineBreak => {
      return {
        type: 'linebreak',
      };
    }
  ),
  renderer: (_: ASTNode, __: string) => {
    return `<br />`;
  },
});
