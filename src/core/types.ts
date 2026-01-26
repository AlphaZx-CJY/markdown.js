import type { ASTNode } from './ast';

export type { ASTNode };

export interface PluginInitContext {
  parseInline: ParseFunc;
  parseBlock: ParseFunc;
  canParseBlock: (text: string) => boolean;
}

export interface Plugin {
  name: string;
  kind?: 'inline' | 'block' | 'both';
  init?: (ctx: PluginInitContext) => void;
  parser: Parser<ASTNode>;
  renderer: (node: ASTNode, children: string) => string;
}

export interface MarkdownParserOptions {
  plugins?: (() => Plugin)[];
  // If override is true, all built-in plugins will not effect
  // If override is false and plugin's name is same as built-in plugin's name, built-in plugin will be replaced by the latest plugin
  override?: boolean;
  highlight?: (code: string, lang: string) => string;
}

export type Parser<T> = (input: string, pos: number) => ParseResult<T> | null;

export type ParseFunc = (text: string) => ASTNode[];

export interface ParseResult<T> {
  value: T;
  nextPos: number;
}
