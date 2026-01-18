export interface ASTNode {
  type: string;
  children?: ASTNode[];
  value?: string;
  lang?: string;
  href?: string;
  checked?: boolean;
  level?: number;
  [key: string]: any;
}

export type PluginType = 'block' | 'inline';

export interface Plugin {
  type: PluginType;
  name: string;
  parser: Parser<ASTNode>;
  renderer: (node: ASTNode, children: string) => string;
}

export interface MarkdownParserOptions {
  plugins?: Plugin[];
  // If override is true, all built-in plugins will not effect
  // If override is false and plugin's name is same as built-in plugin's name, built-in plugin will be replaced by the latest plugin
  override?: boolean;
  highlight?: (code: string, lang: string) => string;
}

export type Parser<T> = (input: string, pos: number) => ParseResult<T> | null;

export interface ParseResult<T> {
  value: T;
  nextPos: number;
}

export interface ParserContext {
  input: string;
  pos: number;
}
