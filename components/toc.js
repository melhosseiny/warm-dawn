import { html, state, web_component, define_component } from "https://busy-dog-44.deno.dev/melhosseiny/sourdough/main/sourdough.js";

const ASSET_HOST = 'https://important-deer-81.deno.dev';

const timeTmpl = (note) => note.time_from? (note.time_to? `${note.time_from}—${note.time_to}` : `${note.time_from}`) : `${note.time_to}`;

const template = (data) => html`
  <ul ref="notes" class="toc">
    ${ data.notes
      ? data.notes.map((note) => `
        <li data-date="${timeTmpl(note)}">
          <a href="/${note.id}">${note.name}</a>
        </li>
      `).join('') : ''
    }
  </ul>
`

const style = `
  .toc {
    /* align-self: center; */
    margin-top: 1em;
  }

  .toc li {
    display: flex;
    flex-direction: row;
  }

  .toc li > a {
    flex-grow: 1;
    text-overflow: ellipsis;
    flex-direction: row;
  }

  .toc li:before {
    content: none;
  }

  .toc li .for {
    color: #666;
    line-clamp: 1;
  }

  @media screen and (min-width: 60em) {
    .toc li:before {
      content: attr(data-date);
      display: inline-block;
      min-width: 4em;
      text-align: left;
      color: #666;
      padding-right: 0.5em;
    }

    .toc li .for {
      flex-grow: 1;
      text-align: right;
      margin-left: 3em;
    }
  }


  @media screen and (max-width: 60em) {
    .toc {
      width: 100%;
      margin-top: 1em;
    }

    .toc li {
      margin-bottom: 0.5em;
      padding: 0.5em 0;
    }

    .toc li:before {
      content: attr(data-date);
      order: 2;
      display: inline-block;
      width: 7em;
      text-align: right;
      color: #666;
      padding-right: 0.5em;
    }

    .toc li > span {
      order: 1;
      flex-direction: column;
    }
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
