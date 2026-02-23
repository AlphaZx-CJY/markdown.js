import { anyOf, char, eof, many1, map, oneOf, optional, sequence, until } from '../combinator';
import type { ASTNode, List, ListItem } from '../core/ast';
import type { ParseFunc, Plugin, PluginInitContext } from '../core/types';

export default (): Plugin => {
  let parseInline: ParseFunc = () => [];
  let parseBlock: ParseFunc = () => [];

  const ulItemParser = map(
    sequence(
      oneOf('-+*'), // Parser<string>
      char(' '), // Parser<string>
      optional(
        map(
          sequence(
            char('['), // Parser<string>
            oneOf(' xX'), // Parser<string>
            char(']'), // Parser<string>
            char(' ') // Parser<string>
          ),
          ([, checked]) => (checked ? '[x]' : null)
        )
      ), // Parser<string | null>
      until(anyOf(char('\n'), eof())) // Parser<string>
    ),
    ([, , checked, content]): ListItem | null => {
      return {
        type: 'listItem',
        checked: checked === '[x]',
        children: parseInline(content.trim()),
      };
    }
  );
  const olItemParser = map(
    sequence(
      many1(oneOf('0123456789')), // Parser<string>
      char('.'), // Parser<string>
      char(' '), // Parser<string>
      until(anyOf(char('\n'), eof())) // Parser<string>
    ),
    ([, , content]): ListItem | null => {
      return {
        type: 'listItem',
        children: parseInline(content.trim()),
      };
    }
  );

  return {
    name: 'list',
    kind: 'block',
    init(ctx: PluginInitContext) {
      parseInline = ctx.parseInline;
      parseBlock = ctx.parseBlock;
    },
    parser: anyOf(
      map(
        many1(ulItemParser), // Parser<ListItem[]>
        (items): List | null => {
          return {
            type: 'list',
            ordered: false,
            children: items,
          };
        }
      ),
      map(
        many1(olItemParser), // Parser<ListItem[]>
        (items): List | null => {
          return {
            type: 'list',
            ordered: true,
            children: items,
          };
        }
      )
    ),
    renderer: (node: ASTNode, children: string) => {
      const tag = (node as List).ordered ? 'ol' : 'ul';
      return `<${tag}>${children}</${tag}>`;
    },
  };
};
