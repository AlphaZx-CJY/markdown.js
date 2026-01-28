import { char, map, optional, sequence, string, until } from '../combinator';
import type { Codeblock } from '../core/ast';
import type { ASTNode, Plugin } from '../core/types';

export default (): Plugin => ({
  name: 'codeblock',
  kind: 'block',
  parser: map(
    sequence(
      string('```'), // Parser<string>
      optional(until(char('\n'))), // Parser<string | null>
      char('\n'),
      until(string('```')), // Parser<string>
      string('```') // Parser<string>
    ),
    ([, lang, , content]): Codeblock | null => {
      if (content.endsWith('\n')) {
        content = content.slice(0, -1);
      }
      return {
        type: 'codeblock',
        lang: lang ? lang.trim() : 'text',
        value: content,
      };
    }
  ),
  renderer: (_: ASTNode, children: string) => {
    return `<pre><code>${children}</code></pre>`;
  },
});
