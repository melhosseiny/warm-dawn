import { html, state, web_component, define_component } from "https://busy-dog-44.deno.dev/melhosseiny/sourdough/main/sourdough.js";

const template = (data) => html`
  <ul ref="tags" part="tags" class="tags">
    ${ data.tags
      ? data.tags.map((tag) => `
          <li part="tag">${tag}</li>
      `).join('') : ''
    }
  </ul>
`

const style = `
  ul.tags li:before {
    content: '#';
    margin-right: 0;
    color: hsla(158, 75%, 44%, 1);
  }

  ul.tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  ul.tags li {
    font-family: var(--type-display);
    font-size: 14px;
    display: flex;
    background-color: rgb(20, 146, 101);
    color: rgb(var(--background-color));
    border-radius: var(--border-radius);
    padding: 0 6px;
    margin-right: 8px;
    margin-bottom: 8px;
  }
`

export function tags(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = _web_component.state;

  const init = () => {
    _state.tags = _root.textContent.split(' ').map(tag => tag.substring(1));
  }

  const effects = () => {}

  return Object.freeze({
    ..._web_component,
    init
  })
}

define_component({
  name: "wd-tags",
  component: tags,
  template,
  style
});
