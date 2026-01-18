import type { ASTNode } from './types';

export interface DocumentNode extends ASTNode {
  type: 'document';
  children: ASTNode[];
}

export interface HeadingNode extends ASTNode {
  type: 'heading';
  level: number;
  children: ASTNode[];
}

export interface CodeBlockNode extends ASTNode {
  type: 'code_block';
  lang: string;
  value: string;
}

export interface ParagraphNode extends ASTNode {
  type: 'paragraph';
  children: ASTNode[];
}

export interface ListItemNode extends ASTNode {
  type: 'list_item';
  checked?: boolean;
  children: ASTNode[];
}

export interface ListNode extends ASTNode {
  type: 'list';
  children: ListItemNode[];
}

export interface TextNode extends ASTNode {
  type: 'text';
  value: string;
}

export interface BoldNode extends ASTNode {
  type: 'strong';
  children: ASTNode[];
}

export interface ItalicNode extends ASTNode {
  type: 'em';
  children: ASTNode[];
}

export interface InlineCodeNode extends ASTNode {
  type: 'code';
  value: string;
}

export interface LinkNode extends ASTNode {
  type: 'link';
  href: string;
  children: ASTNode[];
}
