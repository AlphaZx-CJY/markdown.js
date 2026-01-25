import type { Bold } from '../core/ast';
import { anyOf, map, sequence, string, until } from '../combinator';
import type { ASTNode, ParseFunc, Plugin, PluginInitContext } from '../core/types';

export default (): Plugin => {
  let parseInline: ParseFunc = () => [];
  return {
    name: 'strong',
    kind: 'inline',
    init(ctx: PluginInitContext) {
      parseInline = ctx.parseInline;
    },
    parser: map(
      anyOf(
        sequence(
          string('**'), // Parser<string>
          until(string('**')), // Parser<string>
          string('**') // Parser<string>
        ),
        sequence(
          string('__'), // Parser<string>
          until(string('__')), // Parser<string>
          string('__') // Parser<string>
        )
      ),
      ([, content]): Bold | null => {
        return {
          type: 'strong',
          children: parseInline(content.trim()),
        };
      }
    ),
    renderer: (_: ASTNode, children: string) => {
      return `<strong>${children}</strong>`;
    },
  };
};
