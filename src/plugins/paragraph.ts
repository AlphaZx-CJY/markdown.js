import { anyOf, eof, map, until, string, char, sequence } from '../combinator';
import type { Paragraph } from '../core/ast';
import type { ASTNode, ParseFunc, Plugin, PluginInitContext } from '../core/types';

export default (): Plugin => {
  let parseInline: ParseFunc = () => [];
  let canParseBlock: (text: string) => boolean = () => false;

  return {
    name: 'paragraph',
    kind: 'block',
    init(ctx: PluginInitContext) {
      parseInline = ctx.parseInline;
      canParseBlock = ctx.canParseBlock;
    },
    parser: map(
      anyOf(
        map(
          sequence(until(char('\n')), (input, pos) => {
            // If the next line can be parsed as a block element, end the paragraph here.
            if (canParseBlock(input.slice(pos + 1))) {
              return { value: null, nextPos: pos + 1 };
            }
            return null;
          }),
          ([content]) => content
        ),
        until(anyOf(string('\n\n'), eof())) // Parser<string>, normal paragraph ending with double new line or EOF
      ),
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
