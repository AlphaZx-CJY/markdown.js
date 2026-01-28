import { anyOf, char, many, many1, map, oneOf, optional, sequence, until } from '../combinator';
import type { Image } from '../core/ast';
import type { ASTNode, ParseFunc, Plugin, PluginInitContext } from '../core/types';

export default (): Plugin => {
  let parseInline: ParseFunc = () => [];
  return {
    name: 'image',
    kind: 'inline',
    init(ctx: PluginInitContext) {
      parseInline = ctx.parseInline;
    },
    parser: map(
      sequence(
        char('!'), // Parser<string>
        char('['), // Parser<string>
        until(char(']')), // Parser<string>
        char(']'), // Parser<string>
        char('('), // Parser<string>
        until(anyOf(char(' '), char('\t'), char('\n'), char('('), char('"'), char("'"), char(')'))),
        optional(
          sequence(
            many1(oneOf(' \t\n')),
            anyOf(
              sequence(char('"'), until(char('"')), char('"')),
              sequence(char("'"), until(char("'")), char("'")),
              sequence(char('('), until(char(')')), char(')'))
            )
          )
        ), // Parser<string>
        many(oneOf(' \t\n')), // Parser<string[]>
        char(')') // Parser<string>
      ),
      ([, , alt, , , href, titleOpt]): Image | null => {
        if (titleOpt === null) {
          return {
            type: 'image',
            href,
            children: parseInline(alt.trim()),
          };
        }
        const [, [, title]] = titleOpt;
        return {
          type: 'image',
          href,
          children: parseInline(alt.trim()),
          title,
        };
      }
    ),
    renderer: (node: ASTNode, children: string) => {
      const href = (node as Image).href ?? '';
      const title = (node as Image).title ?? '';
      return `<img src="${href}" title="${title}" alt="${children}" />`;
    },
  };
};
