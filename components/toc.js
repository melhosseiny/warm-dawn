import { html, state, web_component, define_component } from "flare";
import { tags } from "/components/tags.js";

const ASSET_HOST = "http://localhost:4507";
//const ASSET_HOST = "https://important-deer-81.deno.dev";
const PAGE_SIZE = 10;

const format_date = (datetime) => {
  const datetime_format = new Intl.DateTimeFormat("en-US", {  year: "numeric", month: "short", day: "numeric" });
  const date = new Date(datetime);
  return datetime_format.format(date);
}

const template = (data) => html`
  <div class="toc" ref="page">
    ${ data.page && data.page.notes ?
      data.page.notes.slice().map((note) =>
        `<a class="teaser" href="/${note.id}">
          <ad-card title-label="${note.name}" subtitle-label="<time datetime='${note.time}'>${format_date(note.time)}</time>">
            ${ note.img && !note.img.startsWith("text:") ?
              `<picture slot="media">
                <source media="(max-width: 320px)" srcset="${ASSET_HOST}/${note.img.replace(".webp", "_sm.webp")}">
                <source media="(max-width: 480px)" srcset="${ASSET_HOST}/${note.img.replace(".webp", "_md.webp")}">
                <source media="(max-width: 720px)" srcset="${ASSET_HOST}/${note.img.replace(".webp", "_lg.webp")}">
                <img src="${ASSET_HOST}/${note.img}" alt="">
              </picture>` : `<div class="fake-picture" slot="media">
                <div class="fake-img">${note.img ? note.img.split(':')[1] : ''}</div>
              </div>`
            }
            ${ note.summary ? `<p slot="text">${note.summary}</p>` : ''}
            <div slot="actions">
              ${ data.page.notes[0].tags ? `<wd-tags ref="tags">${note.tags.map(tag => `#${tag}`).join(' ')}</wd-tags>` : '' }
            </div>
          </ad-card>
        </a>`).join('') : `
          <p>No notes yet!</p>
        `
    }
    ${ data.page && data.page.has_more
      ? `<a id="more" class="button" href="#">Older notes
          <svg class="symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.252 11.2207">
           <g>
            <rect height="11.2207" opacity="0" width="18.252" x="0" y="0"/>
            <path d="M8.9502 11.2207C9.43848 11.2158 9.83887 11.0352 10.2295 10.6445L17.4463 3.25195C17.7441 2.9541 17.8906 2.60254 17.8906 2.17773C17.8906 1.30859 17.1924 0.605469 16.3379 0.605469C15.9131 0.605469 15.5127 0.776367 15.1953 1.10352L8.55957 7.9541L9.35547 7.9541L2.7002 1.10352C2.38281 0.786133 1.9873 0.605469 1.55273 0.605469C0.693359 0.605469 0 1.30859 0 2.17773C0 2.59766 0.151367 2.94922 0.439453 3.25684L7.66602 10.6445C8.06641 11.0449 8.46191 11.2207 8.9502 11.2207Z" fill="currentColor" fill-opacity="0.85"/>
           </g>
          </svg>
        </a>`
      : ''
    }
  </div>
`

const style = `
  :host {
    max-width: 38em;
  }

  a.teaser, a.teaser:link, a.teaser:visited, a.teaser:hover, a.teaser:active {
    display: block;
    text-decoration: none;
  }

  ad-card {
    display: block;
    width: 100%;
  }

  ad-card picture, .fake-picture {
    border-radius: 6px;
  }

  ad-card img {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    transition: transform 400ms cubic-bezier(0.4, 0, 0.25, 1) 0ms, opacity 1s cubic-bezier(0.4, 0, 0.25, 1) 0ms;
  }

  ad-card::part(title) {
    font-family: "SF Pro Display";
    font-weight: bold;
    white-space: normal;
  }

  .fake-img {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    aspect-ratio: 16 / 9;
    background: linear-gradient(90deg, var(--malachite), rgb(140, 244, 195));
    color: white;
    border-radius: calc(2 * var(--border-radius));
    text-shadow: var(--malachite) 1px 0 20px;
    transition: transform 400ms cubic-bezier(0.4, 0, 0.25, 1) 0ms, opacity 1s cubic-bezier(0.4, 0, 0.25, 1) 0ms;
  }

  @supports (color: rgb(from white r g b)) {
    .fake-img {
      background: linear-gradient(90deg, var(--malachite), oklch(from var(--malachite) calc(l + .3) c h));
    }
  }

  a.teaser:hover ad-card img {
    transform: scale(1.03);
  }
  a.teaser:hover ad-card .fake-img {
    transform: scale(1.1);
  }

  .toc {
    padding-left: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-flow: dense;
    grid-gap: 30px;
  }
  
  @media screen and (max-width: 30em) {
    .toc {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media screen and (min-width: 30em) {
    .toc > :first-child {
      grid-column: span 2;
      grid-row: span 2;
    }

    .toc > :nth-child(2) ad-card::part(title), .toc > :nth-child(3) ad-card::part(title) {
      white-space: normal;
      display: -webkit-box;
      -webkit-box-orient: vertical;  ;
      -webkit-line-clamp: 2;
    }

    .toc > :nth-child(n+10) {
      grid-column: span 3;
    }

    .toc > :nth-child(n+10) picture, .toc > :nth-child(n+10) .fake-picture {
      display: none;
    }

    .toc > :nth-child(n+9) figure figcaption header {
      margin-bottom: 0;
    }
  }

  wd-tags::part(tags) {
    margin-bottom: 0;
  }

  .toc time, ad-card::part(subtitle) {
    display: inline-block;
    color: #666;
    font-size: 14px;
    padding-right: 0.5em;
  }

  button .symbol, a.button .symbol {
    margin-left: 4px;
    margin-right: 0;
    width: 11px;
  }
`

export function toc(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = state(spec);

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
