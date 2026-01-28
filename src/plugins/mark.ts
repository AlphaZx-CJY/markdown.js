import type { Mark } from '../core/ast';
import { map, sequence, string, until } from '../combinator';
import type { ASTNode, ParseFunc, Plugin, PluginInitContext } from '../core/types';

export default (): Plugin => {
  let parseInline: ParseFunc = () => [];
  return {
    name: 'mark',
    kind: 'inline',
    init(ctx: PluginInitContext) {
      parseInline = ctx.parseInline;
    },
    parser: map(
      sequence(
        string('=='), // Parser<string>
        until(string('==')), // Parser<string>
        string('==') // Parser<string>
      ),
      ([, content]): Mark | null => {
        if (content.length <= 0) {
          return null;
        }
        return {
          type: 'mark',
          children: parseInline(content.trim()),
        };
      }
    ),
    renderer: (_: ASTNode, children: string) => {
      return `<mark>${children}</mark>`;
    },
  };
};
