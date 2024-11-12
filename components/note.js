import { html, state, web_component, define_component } from "flare";

import { comments } from "/components/comments.js";
import { ASSET_HOST, html_404, html_404_no, html_404_ar } from "/components/app.js";

const BLACKLISTED_IDS = [
  "about",
  "bookshelf",
  "refer",
  "papers"
]

const template = (data) => html`
  <article part="article" ref="markup lang" class="${data.id}" lang="${data.lang}" ${ data.lang === "ar" ? `dir="rtl"` : ''}>
    <select id="lang-selector" aria-label="language">
      <option value="en" ${ data.lang === "en" ? "selected" : ''}>en</option>
      <option value="no" ${ data.lang === "no" ? "selected" : ''}>no</option>
      <option value="ar" ${ data.lang === "ar" ? "selected" : ''}>ar</option>
    </select>
    ${ data.markup }
    <div ref="show_comments">
      ${ !data.show_comments || BLACKLISTED_IDS.includes(data.id) ? '' : `<wd-comments id="${data.id}" can-add-comment="${data.markup !== undefined}" lang="en" dir="ltr"></wd-comments>` }
    </div>
  </article>
`

const style = `
  #lang-selector {
    float: right;
    outline: none;
    font-family: inherit;
    font-weight: semi-bold;
    outline: 1.5px solid rgba(0,0,0,.2);
    border: 0 none;
    border-radius: var(--border-radius);
  }

  #lang-selector:lang(ar) {
    float: left;
  }

  h1 {
    font-family: var(--type-display);
    font-weight: bold;
  }

  /* figures */
  figure, ad-carousel, .glitch-embed-wrap, details {
    margin-bottom: 1em;
  }

  ad-media-grid {
    margin-bottom: 64px;
  }

  figure.centered {
    text-align: center;
  }

  figure.centered img {
    margin: 0 auto;
  }

  figure.framed {
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 1px;
  }

  figure figcaption {
    font-family: var(--type-display);
    color: #666;
  }

  /* blockquote */
  blockquote p {
    color: rgba(var(--text-color), 0.6);
  }

  /* pre */
  pre, code {
    font-family: var(--type-mono);
  }

  pre {
    margin-bottom: var(--line-height-body);
    background-color: #eee;
    padding: 0.5em;
    overflow: auto;
  }

  article {
    max-width: 38em;
  }

  article img, article video {
    display: block;
    max-width: 100%;
    box-sizing: border-box;
  }

  .qa {
    column-count: 2;
    column-gap: 20px;
  }

  /* dirty flex */
  .row.ignore-breakpoint {
    max-width: 38em;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .ignore-breakpoint .flex-child {
    box-sizing: border-box;
    margin-right: 1em;
    width: calc(50% - 0.5em)
  }

  .ignore-breakpoint .flex-child-two-third {
    width: calc(66.66% - 1em);
  }

  .ignore-breakpoint .flex-child-third {
    width: calc(33.33% - 1em);
  }

  .ignore-breakpoint .flex-child:last-child {
    margin-right: 0;
  }

  @media screen and (min-width: 30em) {
    .qa {
      column-count: 3;
      column-gap: 20px;
    }

    .float-right {
      float: right;
      margin-left: 1em;
    }

    .float-left {
      float: left;
      margin-right: 1em;
    }

    .row {
      max-width: 38em;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
    }

    .center {
      justify-content: center;
    }

    .flex-child {
      box-sizing: border-box;
      margin-right: 1em;
      width: calc(50% - 0.5em)
    }

    .flex-child-two-third {
      width: calc(66.66% - 1em);
    }

    .flex-child-third {
      width: calc(33.33% - 1em);
    }

    .flex-child:last-child {
      margin-right: 0;
    }
  }

  /* math */
  .katex {
    font-size: 1em;
  }
`

export function note(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = state(spec);
  
  const fetch_note = async (lang = '') => {
    try {
      document.querySelector('#progress').component.show();

      const has_math_response = await fetch(`${ASSET_HOST}/has_math?id=${spec.id}`);
      const has_math = await has_math_response.text();

      const response = await fetch(BLACKLISTED_IDS.includes(spec.id) ? `${ASSET_HOST}/${spec.id}${lang}.html` : `${ASSET_HOST}/note/${spec.id}${lang}.html`);
      if (response.status === 404) { throw 'Page not found' }
      const note = await response.text();
      
      _state.show_comments = true;
      _state.markup = note;
      if (has_math === "true") {
        const style_el = document.createElement("style");
        style_el.innerHTML = '@import "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"';
        _root.shadowRoot.appendChild(style_el);
      }
    } catch (error) {
      _state.show_comments = false;
      console.log(error);
      document.title = `${error} - Mostafa Elshamy`;
      switch (_state.lang) {
        case "no":
          _state.markup = html_404_no(error);
          break;
        case "ar":
          _state.markup = html_404_ar(error);
          break;
        default:
          _state.markup = html_404(error);
      }
    } finally {
      document.querySelector('#progress').component.hide();
    }
  }

  const init = () => {
    _state.show_comments = false;
    fetch_note();
  }

  const effects = () => {
    const lang_selector = _root.shadowRoot.querySelector("#lang-selector");
    if (lang_selector) {
      lang_selector.onchange = (event) => {
        const lang = event.target.value;
        _state.lang = lang;
        if (lang === "en") {
          fetch_note();
        } else {
          fetch_note('.' + lang);
        }
      }
    }
  }

  return Object.freeze({
    ..._web_component,
    init,
    effects
  })
}

define_component({
  name: "wd-note",
  component: note,
  template,
  style,
  props: ["id"]
});
