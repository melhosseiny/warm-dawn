import { html, state, web_component, define_component } from "https://busy-dog-44.deno.dev/melhosseiny/sourdough/main/sourdough.js";
import { tags } from "/components/tags.js";

//const ASSET_HOST = "http://localhost:4507";
const ASSET_HOST = "https://important-deer-81.deno.dev";
const PAGE_SIZE = 10;

const format_date = (datetime) => {
  const datetime_format = new Intl.DateTimeFormat("en-US", {  year: "numeric", month: "short", day: "numeric" });
  const date = new Date(datetime);
  return datetime_format.format(date);
}

const template = (data) => html`
  <div ref="page">
    ${ data.page && data.page.notes ?
      `<a class="button teaser" href="/${data.page.notes[0].id}">
        <ad-card title-label="${data.page.notes[0].name}" subtitle-label="${format_date(data.page.notes[0].time)}">
          ${ data.page.notes[0].img ?
            `<picture slot="media">
              <source srcset="${data.page.notes[0].img}" type="image/webp">
              <img src="${data.page.notes[0].img}" alt="alt text">
            </picture>` : '' }
          <div slot="actions">
            ${ data.page.notes[0].tags ? `<wd-tags ref="tags">${data.page.notes[0].tags.map(tag => `#${tag}`).join(' ')}</wd-tags>` : '' }
          </div>
        </ad-card>
      </a>` : ''
    }
    <ul class="toc">
      ${ data.page && data.page.notes
        ? data.page.notes.slice(1).map((note) => `
          <li>
            <a href="/${note.id}">${note.name}</a>
            <time datetime="${note.time}">${format_date(note.time)}</time>
            ${ note.tags ? `<wd-tags ref="tags">${note.tags.map(tag => `#${tag}`).join(' ')}</wd-tags>` : '' }
          </li>
        `).join('') : `
          <p>No notes yet!</p>
        `
      }
    </ul>
    ${ data.page && data.page.has_more
      ? `<a id="more" class="button" href="#">Older notes <svg class="material-icons" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg></a>`
      : ''
    }
  </div>
`
console.log(template({notes: [], cursor: "fsdfsd", has_more: true}));

const style = `
  a.button.teaser {
    height: auto;
    width: 100%;
    margin-bottom: 1em;
    font-variant-caps: normal;
  }

  ad-card {
    display: block;
    width: 100%;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .toc {
    padding-left: 0;
  }

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
    text-decoration: none;
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
    margin-right: 6px;
  }

  .toc time, ad-card::part(subtitle) {
    display: inline-block;
    color: #666;
    font-size: 14px;
    padding-right: 0.5em;
  }

  a:hover ad-card::part(subtitle) {
    color: rgba(255,255,255,0.6);
  }

  #more .material-icons {
    margin-right: 0;
  }
`

export function toc(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = _web_component.state;

  const fetch_notes = async () => {
    const response = await fetch(`${ASSET_HOST}/index.json?page_size=${PAGE_SIZE}`);
    _state.page = await response.json();
    console.log("_state", _state);
  }

  const fetch_more_notes = async (after) => {
    const response = await fetch(`${ASSET_HOST}/index.json?page_size=${PAGE_SIZE}&after=${after}`);
    const fetched_notes = _state.page.notes;
    const page = await response.json();
    _state.page = {
      ...page,
      notes: [...fetched_notes, ...page.notes]
    }
    console.log("_state", _state);
  }

  const init = () => {
    fetch_notes();
  }

  const handle_fetch_more = (event) => {
    event.preventDefault();
    fetch_more_notes(_state.page.cursor);
  }

  const effects = () => {
    const more_btn = _root.shadowRoot.querySelector('#more');
    if (more_btn) {
      more_btn.addEventListener("click", handle_fetch_more);
    }
  }

  const cleanup_effects = () => {
    const more_btn = _root.shadowRoot.querySelector('#more');
    if (more_btn) {
      more_btn.removeEventListener("click", handle_fetch_more);
    }
  }

  return Object.freeze({
    ..._web_component,
    init,
    effects,
    cleanup_effects
  })
}

define_component({
  name: "wd-toc",
  component: toc,
  template,
  style
});
