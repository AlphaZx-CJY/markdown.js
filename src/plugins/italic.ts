import type { Italic } from '../core/ast';
import { anyOf, char, map, sequence, until } from '../combinator';
import type { ASTNode, ParseFunc, Plugin, PluginInitContext } from '../core/types';

export default (): Plugin => {
  let parseInline: ParseFunc = () => [];
  return {
    name: 'italic',
    kind: 'inline',
    init(ctx: PluginInitContext) {
      parseInline = ctx.parseInline;
    },
    parser: map(
      anyOf(
        sequence(
          char('*'), // Parser<string>
          until(char('*')), // Parser<string>
          char('*') // Parser<string>
        ),
        sequence(
          char('_'), // Parser<string>
          until(char('_')), // Parser<string>
          char('_') // Parser<string>
        )
      ),
      ([, content]): Italic | null => {
        if (content.length <= 0) {
          return null;
        } 
        return {
          type: 'em',
          children: parseInline(content.trim()),
        };
      }
    ),
    renderer: (_: ASTNode, children: string) => {
      return `<em>${children}</em>`;
    },
  };
};
