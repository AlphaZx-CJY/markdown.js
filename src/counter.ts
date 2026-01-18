import { MarkdownParser } from './core/parser';

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}

export function markd(element: HTMLButtonElement) {
  const markdown = `
# h1
## h2
### h3
####### h7

**strong1**
__strong2**
**not strong__
  `;
  element.addEventListener('click', () => {
    const parsed = new MarkdownParser().parse(markdown);
    alert(JSON.stringify(parsed));
  });
}
