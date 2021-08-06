import { html, state, web_component, define_component } from "https://busy-dog-44.deno.dev/melhosseiny/sourdough/main/sourdough.js";
import { tags } from "/components/tags.js";

const ASSET_HOST = 'https://important-deer-81.deno.dev';

const template = (data) => html`
  <ul ref="notes" class="toc">
    ${ data.notes
      ? data.notes.map((note) => `
        <li data-date="${note.time_from}">
          <a href="/${note.id}">${note.name}</a>
          <time>${note.time_from}</time>
          <wd-tags tags='${JSON.stringify(note.tags)}'></wd-tags>
        </li>
      `).join('') : ''
    }
  </ul>
`

const style = `
  .toc > li {
    display: flex;
    flex-direction: row;
    flex-flow: wrap;
    margin-bottom: 1em;
  }

  .toc > li > a {
    flex-grow: 1;
    text-overflow: ellipsis;
    flex-direction: row;
    width: 100%;
  }

  .toc > li:before {
    content: none;
  }

  .toc > li .for {
    color: #666;
    line-clamp: 1;
  }

  wd-tags::part(tags) {
    margin-bottom: 0;
  }

  wd-tags::part(tag) {
    color: #666;
    background-color: rgba(0, 0, 0, 0);
    padding: 0;
    margin-right: 6px;
    margin-bottom: 0;
  }

  .toc time {
    display: inline-block;
    color: #666;
    padding-right: 0.5em;
  }
`

export function toc(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = _web_component.state;

  const fetch_notes = async () => {
    const response = await fetch(`${ASSET_HOST}/notes.json`);
    _state.notes = await response.json();
  }

  const init = () => {
    fetch_notes();
  }

  return Object.freeze({
    ..._web_component,
    init
  })
}

define_component({
  name: "wd-toc",
  component: toc,
  template,
  style
});
