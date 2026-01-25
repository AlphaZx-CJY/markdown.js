import { char, map, sequence, until } from '../combinator';
import type { Link } from '../core/ast';
import type { ASTNode, ParseFunc, Plugin, PluginInitContext } from '../core/types';

export default (): Plugin => {
  let parseInline: ParseFunc = () => [];

  return {
    name: 'link',
    kind: 'inline',
    init(ctx: PluginInitContext) {
      parseInline = ctx.parseInline;
    },
    parser: map(
      sequence(
        char('['), // Parser<string>
        until(char(']')), // Parser<string>
        char(']'), // Parser<string>
        char('('), // Parser<string>
        until(char(')')), // Parser<string>
        char(')') // Parser<string>
      ),
      ([, alt, , , href]): Link | null => {
        return {
          type: 'link',
          href,
          children: parseInline(alt.trim()),
        };
      }
    ),
    renderer: (node: ASTNode, children: string) => {
      const href = (node as Link).href ?? '#';
      return `<a href="${href}">${children}</a>`;
    },
  };
};
