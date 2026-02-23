import heading from './heading';
import blockquote from './blockquote';
import br from './br';
import code from './code';
import hr from './hr';
import image from './image';
import italic from './italic';
import link from './link';
import strong from './strong';
import paragraph from './paragraph';
import del from './del';
import mark from './mark';
import escaping from './escaping';
import codeblock from './codeblock';
import underscore from './underscore';
import list from './list';

export {
  heading,
  strong,
  italic,
  code,
  hr,
  image,
  link,
  br,
  blockquote,
  paragraph,
  del,
  mark,
  escaping,
  codeblock,
  underscore,
};

export const BUILT_IN_PLUGINS = [
  heading,
  strong,
  italic,
  code,
  hr,
  image,
  link,
  br,
  blockquote,
  del,
  mark,
  escaping,
  codeblock,
  underscore,
  list,
];
