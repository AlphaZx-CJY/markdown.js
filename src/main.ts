import { MarkdownParser } from './core/parser.ts';
import '@congjiye/nanocss/dist/nano.min.css';
import './style.css';

function markd(input: HTMLTextAreaElement, output: HTMLDivElement) {
  const parser = new MarkdownParser();
  input.addEventListener('input', () => {
    const content = parser.parse(input.value);
    const ast = JSON.stringify(content, null, 2);
    output.innerText = ast;
  });
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main>
    <header>
      <h1>Markdown 转换</h1>
    </header>
    <textarea rows="10" id="editor"></textarea>
    <fieldset>
      <legend>中间产物</legend>
      <pre><code id="markdown"></code></pre>
    </fieldset>
  </main>
`;

markd(
  document.querySelector<HTMLTextAreaElement>('#editor')!,
  document.querySelector<HTMLDivElement>('#markdown')!
);
