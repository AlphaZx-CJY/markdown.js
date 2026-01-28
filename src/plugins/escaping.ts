import { char, map, oneOf, sequence } from '../combinator';
import type { Escape } from '../core/ast';
import type { ASTNode, Plugin } from '../core/types';

export default (): Plugin => ({
  name: 'escaping',
  kind: 'inline',
  parser: map(
    sequence(
      char('\\'), // Parser<string>
      oneOf('\\`*_{}[]()#+-.!') // Parser<string>
    ),
    ([, escapedChar]): Escape => {
      return {
        type: 'escaping',
        value: escapedChar,
      };
    }
  ),
  renderer: (node: ASTNode, _: string) => {
    return (node as Escape).value;
  },
});
