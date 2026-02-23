import { map, sequence, string, until } from '../combinator';
import type { ASTNode, ParseFunc, Plugin, PluginInitContext } from '../core/types';

export default (): Plugin => {
  let parseInline: ParseFunc = () => [];

  return {
    name: 'underscore',
    kind: 'inline',
    init(ctx: PluginInitContext) {
      parseInline = ctx.parseInline;
    },
    parser: map(
      sequence(
        string('<u>'), // Parser<string>
        until(string('</u>')), // Parser<string>
        string('</u>') // Parser<string>
      ),
      ([, content]): ASTNode | null => {
        return {
          type: 'underscore',
          children: parseInline(content.trim()),
        };
      }
    ),
    renderer: (_: ASTNode, children: string) => {
      return `<u>${children}</u>`;
    },
  };
};
