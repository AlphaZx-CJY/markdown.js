import { anyOf, eof, map, until, string, many1 } from '../combinator';
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
      until(
        anyOf(
          string('\n\n'),
          string('<br>'),
          string('<br />'),
          map(many1(string('  \n')), () => '\n'),
          eof()
        )
      ), // Parser<string>
      (content): Paragraph | null => {
        const trimmed = content.trim();
        if (!trimmed) return null;
        return {
          type: 'paragraph',
          children: parseInline(trimmed.replaceAll('\n', ' ')),
        };
      }
    ),
    renderer: (_: ASTNode, children: string) => {
      return `<p>${children}</p>`;
    },
  };
};
