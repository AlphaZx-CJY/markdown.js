import { map, sequence, string, until } from '../combinator';
import type { ASTNode, Del } from '../core/ast';
import type { ParseFunc, Plugin, PluginInitContext } from '../core/types';

export default (): Plugin => {
  let parseInline: ParseFunc = () => [];
  return {
    name: 'del',
    kind: 'inline',
    init(ctx: PluginInitContext) {
      parseInline = ctx.parseInline;
    },
    parser: map(
      sequence(
        string('~~'), // Parser<string>
        until(string('~~')), // Parser<string>
        string('~~') // Parser<string>
      ),
      ([, content]): Del | null => {
        if (content.length <= 0) {
          return null;
        }
        return {
          type: 'del',
          children: parseInline(content.trim()),
        };
      }
    ),
    renderer: (_: ASTNode, children: string) => {
      return `<del>${children}</del>`;
    },
  };
};
