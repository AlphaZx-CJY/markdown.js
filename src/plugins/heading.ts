import type { ASTNode, Plugin, Parser } from '../types';
import { char, map, sequence, many1, until } from '../combinator';
import type { HeadingNode } from '../ast';

export default (parseInline: (text: string) => ASTNode[]): Plugin => ({
  type: 'block',
  name: 'heading',
  parser: map(
    sequence(
      many1(char('#')), // Parser<string[]>
      char(' '), // Parser<string>
      until('\n') // Parser<string>
    ),
    ([hashes, , content]): HeadingNode | null => {
      const level = hashes.length;
      if (level < 1 || level > 6) return null;

      return {
        type: 'heading',
        level,
        children: parseInline(content.trim()),
      };
    }
  ) as Parser<ASTNode>,
  renderer: (node: ASTNode, children: string) => {
    const level = node.level || 1;
    return `<h${level}>${children}</h${level}>`;
  },
});
