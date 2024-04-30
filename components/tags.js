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
  ul.tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-left: 0;
  }

  ul.tags li {
    font-family: var(--type-mono);
    font-size: 13px;
    letter-spacing: -0.5px;
    display: flex;
    color: var(--amethyst);
    border-radius: var(--border-radius);
    margin-bottom: 4px;
  }

  ul.tags li + li {
    margin-left: 6px;
  }

  ul.tags li:first-child {
    background-color: var(--amethyst);
    color: white;
    padding: 0 6px;
  }

  ul.tags li:before {
    content: '#';
    margin-right: 0;
  }

  @supports (color: rgb(from white r g b)) {
    ul.tags li:first-child {
      color: oklch(from var(--amethyst) calc(l + .6) c h);
    }
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
