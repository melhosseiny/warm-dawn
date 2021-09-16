import { html, state, web_component, define_component } from "https://busy-dog-44.deno.dev/melhosseiny/sourdough/main/sourdough.js";
import "https://unpkg.com/commonmark@0.30.0/dist/commonmark.min.js";
import { Transform } from "/utils/transform.js";
let katex, renderMathInElement;

//const ASSET_HOST = "http://localhost:4507";
const ASSET_HOST = "https://important-deer-81.deno.dev";

const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();
const transform = Transform();

const parse_markdown = function(markdown) {
  let parsed = reader.parse(markdown);
  var walker = parsed.walker();
  let event, node;
  let imgCount = 0;

  while ((event = walker.next())) {
    node = event.node;

    if (event.entering) {
      // console.log('imgCount', imgCount);
      const loading = imgCount > 0 ? "lazy" : "auto";
      switch (node.type) {
        case 'html_block':
          if (node._htmlBlockType !== 2) {
            if (node.literal.indexOf('img') !== -1) {
              transform.imgInHtmlBlock(node, loading, ASSET_HOST);
            } else if (node.literal.indexOf('video') !== -1) {
              transform.videoInHtmlBlock(node, loading, ASSET_HOST);
            }
            imgCount++;
          }
          break;
        case 'image':
          transform.imgNode(node, loading, ASSET_HOST);
          imgCount++;
          break;
      }
    }
  }

  return parsed;
}

const template = (data) => html`
  <article ref="markup" class="${data.id}">
    ${ data.markup }
  </article>
  ${ data.has_math ? '<style>@import "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css";</style>' : '' }
`

const md_404 = (error) => `
# Uh oh

${error}.

Go back to the [homepage](/).
`

const style = `
  /* figures */
  figure {
    margin-bottom: 1em;
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

  .portfolio figure.framed {
    border: 0;
  }

  .portfolio figure.framed img {
    background: #eee;
    padding: 1em;
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

  .material-icons {
    vertical-align: bottom;
  }

  @media screen and (min-width: 30em) {
    .float-right {
      float: right;
      margin-left: 1em;
    }
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

  /* color-scheme */
  ul.color-scheme {
    font-family: var(--type-display);
    display: flex;
    flex-direction: column;
  }

  ul.color-scheme li {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.5em;
    border: 1px solid rgba(0,0,0,.12);
    box-sizing: border-box;
    height: 100px;
  }

  ul.color-scheme li .meta {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  ul.color-scheme li:before {
    content: none;
  }

  /* glitch embeds */
  .glitch-embed-wrap {
    margin-bottom: 1em;
  }
`

export function note(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = _web_component.state;

  const fetch_note = async () => {
    try {
      document.querySelector('#progress').component.show();
      const has_math_response = await fetch(`${ASSET_HOST}/has_math?id=${spec.id}`);
      const has_math = await has_math_response.text();

      if (has_math === "true") {
        katex = (await import("https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.mjs")).default;
        renderMathInElement = (await import("https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/contrib/auto-render.mjs")).default;
        _state.has_math = true;
      }

      const response = await fetch(`${ASSET_HOST}/${spec.id}.md`);
      if (response.status === 404) { throw 'Page not found' }
      const note = await response.text();

      _state.markup = writer.render(parse_markdown(note));
    } catch (error) {
      console.log(error);
      document.title = `${error} - Mostafa Elshamy`;
      _state.markup = writer.render(parse_markdown(md_404(error)));
    } finally {
      document.querySelector('#progress').component.hide();
    }
  }

  const init = () => {
    fetch_note();
  }

  const effects = () => {
    if (_state.has_math) {
      renderMathInElement(_root.shadowRoot);
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
