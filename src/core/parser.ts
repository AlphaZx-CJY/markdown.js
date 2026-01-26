import { anyOf } from '../combinator';
import { BUILT_IN_PLUGINS, paragraph } from '../plugins';
import type { ASTNode, Plugin, MarkdownParserOptions, Parser } from './types';

export class MarkdownParser {
  private blockPlugins: Plugin[] = [];
  private inlinePlugins: Plugin[] = [];

  constructor(options?: MarkdownParserOptions) {
    const pluginsMap: Map<string, Plugin> = new Map();
    let plugins: (() => Plugin)[] = [];
    if (!options || !options.override) {
      plugins = BUILT_IN_PLUGINS;
    }
    if (options?.plugins) {
      plugins.push(...options.plugins);
    }
    const instantiated = plugins.map((p) => p());
    // reject default paragraph plugin if user provided custom one
    instantiated.push(paragraph());
    instantiated.forEach((p) => {
      pluginsMap.set(p.name, p);
    });
    const deduplicated = Array.from(pluginsMap.values());
    this.blockPlugins = deduplicated.filter((plugin) => plugin.kind !== 'inline');
    this.inlinePlugins = deduplicated.filter((plugin) => plugin.kind !== 'block');

    // inject parsing helpers into plugins
    const ctx = {
      parseInline: this.parseInline.bind(this),
      parseBlock: this.parseBlock.bind(this),
      canParseBlock: (text: string) => {
        const blockParsersExceptParagraph = this.blockPlugins
          .filter((p) => p.name !== 'paragraph')
          .map((p) => p.parser);
        const res = anyOf(...blockParsersExceptParagraph)(text, 0);
        return res !== null;
      },
    };

    deduplicated.forEach((plugin) => {
      if (plugin.init) {
        plugin.init(ctx);
      }
    });
  }

  parse(input: string): ASTNode {
    const children = this.parseBlock(input);
    return {
      type: 'document',
      children,
    };
  }

  get blockParsers(): Parser<ASTNode>[] {
    return this.blockPlugins.map((p) => p.parser);
  }

  get inlineParsers(): Parser<ASTNode>[] {
    return this.inlinePlugins.map((p) => p.parser);
  }

  private parseBlock(input: string): ASTNode[] {
    const blocks: ASTNode[] = [];
    let pos = 0;
    while (pos < input.length) {
      const res = anyOf(...this.blockParsers)(input, pos);
      if (res) {
        blocks.push(res.value);
        pos = res.nextPos;
      } else {
        break; // if no parser matches, exit to avoid infinite loop
      }
    }
    return blocks;
  }

  private parseInline(input: string): ASTNode[] {
    const inlines: ASTNode[] = [];
    let pos = 0;
    let remainingText = '';
    while (pos < input.length) {
      const res = anyOf(...this.inlineParsers)(input, pos);
      if (res) {
        if (remainingText.trim()) {
          inlines.push({ type: 'text', value: remainingText.trim() });
          remainingText = '';
        }
        inlines.push(res.value);
        pos = res.nextPos;
      } else {
        remainingText += input[pos];
        pos++;
      }
    }
    if (remainingText.trim()) {
      inlines.push({ type: 'text', value: remainingText.trim() });
    }
    return inlines;
  }
}
