import type { BoldNode } from '../ast';
import { anyOf, map, sequence, string, until } from '../combinator';
import type { ASTNode, Plugin, Parser } from '../types';

export default (parseInline: (text: string) => ASTNode[]): Plugin => ({
  type: 'inline',
  name: 'strong',
  parser: map(
    anyOf(
      sequence(
        string('**'), // Parser<string>
        until('**'), // Parser<string>
        string('**') // Parser<string>
      ),
      sequence(
        string('__'), // Parser<string>
        until('__'), // Parser<string>
        string('__') // Parser<string>
      )
    ),
    ([, content]): BoldNode | null => {
      return {
        type: 'strong',
        children: parseInline(content.trim()),
      };
    }
  ) as Parser<ASTNode>,
  renderer: (_: ASTNode, children: string) => {
    return `<strong>${children}</strong>`;
  },
});
