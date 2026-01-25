import { anyOf, char, eof, map, sequence, until } from '../combinator';
import type { Paragraph } from '../core/ast';
import type { ASTNode, ParseFunc, Plugin, PluginInitContext } from '../core/types';

export default (): Plugin => {
  let parseInline: ParseFunc = () => [];
  return {
    name: 'paragraph',
    kind: 'block',
    init(ctx: PluginInitContext) {
      parseInline = ctx.parseInline;
    },
    parser: map(
      sequence(
        until(anyOf(char('\n\n'), eof())), // Parser<string>
      ),
      ([content]): Paragraph => {
        return {
          type: 'paragraph',
          children: parseInline(content.trim()),
        };
      }
    ),
    renderer: (_: ASTNode, children: string) => {
      return `<p>${children}</p>`;
    },
  };
};
