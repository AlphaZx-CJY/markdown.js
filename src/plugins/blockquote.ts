import { anyOf, char, eof, many1, map, optional, sequence, skip, until } from '../combinator';
import type { Blockquote } from '../core/ast';
import type { ASTNode, ParseFunc, Plugin, PluginInitContext } from '../core/types';

export default (): Plugin => {
  let parseBlock: ParseFunc = () => [];
  return {
    name: 'blockquote',
    kind: 'block',
    init(ctx: PluginInitContext) {
      parseBlock = ctx.parseBlock;
    },
    parser: map(
      many1(
        sequence(
          char('>'), // start flag
          optional(char(' ')),
          until(anyOf(char('\n'), eof())), // end flag
          optional(skip(char('\n'))) // skip line break
        )
      ),
      (value): Blockquote | null => {
        if (value.length <= 0) {
          return null;
        }
        const children: ASTNode[] = [];
        for (const [, , content] of value) {
          children.push(...parseBlock(content.trim()));
        }
        return {
          type: 'blockquote',
          children,
        };
      }
    ),
    renderer: (_: ASTNode, children: string) => {
      return `<blockquote>${children}</blockquote>`;
    },
  };
};
