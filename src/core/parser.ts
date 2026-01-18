import heading from '../plugins/heading';
import strong from '../plugins/strong';
import type { ASTNode, Plugin, MarkdownParserOptions, ParserContext } from '../types';

export class MarkdownParser {
  private _blockPlugins: Map<string, Plugin> = new Map();
  private _inlinePlugins: Map<string, Plugin> = new Map();

  constructor(options?: MarkdownParserOptions) {
    const builtInPlugins = [heading(this.parseInline), strong(this.parseInline)];
    if (!options) {
      this.addPlugins(builtInPlugins);
    } else {
      if (!options.override) {
        this.addPlugins(builtInPlugins);
      }
      if (options.plugins) {
        this.addPlugins(options.plugins);
      }
    }
  }

  get blockPlugins(): Plugin[] {
    return Array.from(this._blockPlugins.values());
  }

  get inlinePlugins(): Plugin[] {
    return Array.from(this._inlinePlugins.values());
  }

  parse(input: string): ASTNode {
    const context = { input, pos: 0 };
    return this.parseDocument(context);
  }

  private addPlugins(plugins: Plugin[]): void {
    for (const plugin of plugins) {
      if (plugin.type === 'block') {
        this._blockPlugins.set(plugin.name, plugin);
      } else {
        this._inlinePlugins.set(plugin.name, plugin);
      }
    }
  }

  private parseDocument(context: ParserContext): ASTNode {
    const children = this.parseBlocks(context);
    return {
      type: 'document',
      children,
    };
  }

  private parseBlocks(context: ParserContext): ASTNode[] {
    const blocks: ASTNode[] = [];

    while (context.pos < context.input.length) {
      if (this.isWhitespaceLine(context)) {
        context.pos += this.getLineEnd(context);
        continue;
      }

      const block = this.parseBlock(context);
      if (block) {
        blocks.push(block);
        context.pos = block.nextPos;
      } else {
        // 默认段落处理
        const paragraph = this.parseParagraph(context);
        if (paragraph) {
          blocks.push(paragraph);
          context.pos = paragraph.nextPos;
        } else {
          context.pos++;
        }
      }
    }

    return blocks;
  }

  private parseBlock(context: ParserContext): ASTNode | null {
    for (const parser of this.blockPlugins) {
      const result = parser.parser(context.input, context.pos);
      if (result) return result.value;
    }
    return null;
  }

  private parseParagraph(context: ParserContext): ASTNode | null {
    const endPos = this.findBlockEnd(context);
    const content = context.input.slice(context.pos, endPos);
    context.pos = endPos;
    return {
      type: 'paragraph',
      children: this.parseInline(content.trim()),
    };
  }

  private parseInline(text: string): ASTNode[] {
    const result: ASTNode[] = [];
    let pos = 0;

    while (pos < text.length) {
      let matched = false;

      for (const parser of this.inlinePlugins) {
        const node = parser.parser(text, pos);
        if (node) {
          result.push(node.value);
          pos = node.nextPos;
          matched = true;
          break;
        }
      }

      if (!matched) {
        result.push({ type: 'text', value: text[pos] });
        pos++;
      }
    }

    return result;
  }

  private findBlockEnd(context: ParserContext): number {
    const nextBreak = context.input.indexOf('\n\n', context.pos);
    return nextBreak === -1 ? context.input.length : nextBreak;
  }

  private isWhitespaceLine(context: ParserContext): boolean {
    const lineEnd = this.getLineEnd(context);
    const line = context.input.slice(context.pos, lineEnd);
    return /^\s*$/.test(line);
  }

  private getLineEnd(context: ParserContext): number {
    const newlinePos = context.input.indexOf('\n', context.pos);
    return newlinePos === -1 ? context.input.length : newlinePos + 1;
  }
}
