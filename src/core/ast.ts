export type MarkdownNode =
  | Document
  | Heading
  | Codeblock
  | List
  | ListItem
  | Paragraph
  | Text
  | Bold
  | Italic
  | InlineCode
  | Link
  | Image
  | HorizontalRule
  | LineBreak
  | Blockquote;

export type ASTNode = MarkdownNode | Generic;

export interface Generic {
  type: string;
  children?: ASTNode[];
  [key: string]: any;
}

export interface Document {
  type: 'document';
  children: ASTNode[];
}

export interface Heading {
  type: 'heading';
  level: number;
  children: ASTNode[];
}

export interface Codeblock {
  type: 'codeblock';
  lang: string;
  value: string;
}

export interface List {
  type: 'list';
  children: ListItem[];
}

export interface ListItem {
  type: 'list_item';
  checked?: boolean;
  children: ASTNode[];
}

export interface Paragraph {
  type: 'paragraph';
  children: ASTNode[];
}

export interface Text {
  type: 'text';
  value: string;
}

export interface Bold {
  type: 'strong';
  children: ASTNode[];
}

export interface Italic {
  type: 'em';
  children: ASTNode[];
}

export interface InlineCode {
  type: 'code';
  value: string;
}

export interface Link {
  type: 'link';
  href: string;
  children: ASTNode[];
}

export interface Image {
  type: 'image';
  href: string;
  children: ASTNode[];
  title?: string;
}

export interface HorizontalRule {
  type: 'hr';
}

export interface LineBreak {
  type: 'linebreak';
}

export interface Blockquote {
  type: 'blockquote';
  children: ASTNode[];
}
