import type { ASTNode, ParseFunc, Plugin, PluginInitContext } from '../core/types';
import { char, map, sequence, many1, until, anyOf, eof, many, optional } from '../combinator';
import type { Heading } from '../core/ast';

export default (): Plugin => {
  let parseInline: ParseFunc = () => [];
  return {
    name: 'heading',
    kind: 'block',
    init(ctx: PluginInitContext) {
      parseInline = ctx.parseInline;
    },
    parser: map(
      sequence(
        many1(char('#')), // Parser<string[]>
        many(char(' ')), // Parser<string[]>
        until(anyOf(char('\n'), eof())), // Parser<string>,
        optional(char('\n'))
      ),
      ([hashes, , content]): Heading | null => {
        const level = hashes.length;
        if (level < 1 || level > 6) return null;

        return {
          type: 'heading',
          level,
          children: parseInline(content.trim()),
        };
      }
    ),
    renderer: (node: ASTNode, children: string) => {
      const level = (node as Heading).level || 1;
      return `<h${level}>${children}</h${level}>`;
    },
  };
};
