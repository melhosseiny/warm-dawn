import { html, state, web_component, define_component } from "https://busy-dog-44.deno.dev/melhosseiny/sourdough/main/sourdough.js";
import "https://unpkg.com/commonmark@0.30.0/dist/commonmark.js";
import { Transform } from "/utils/transform.js";
import katex from "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.mjs";
import renderMathInElement from "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/contrib/auto-render.mjs";

const ASSET_HOST = 'https://important-deer-81.deno.dev';

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
  <style>@import "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css";</style>
`

const md_404 = (error) => `
# Uh oh

${error}.

Go back to the [homepage](/).
`

const style = `
  .portfolio figure.framed {
    border: 0;
  }

  .portfolio figure.framed img {
    background: #eee;
    padding: 1em;
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
`

export function note(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = _web_component.state;

  const fetch_note = async () => {
    try {
      document.querySelector('#progress').component.show();
      const response = await fetch(`${ASSET_HOST}/${spec.id}.md`);
      if (response.status === 404) { throw 'Page not found' }
      const note = await response.text();

      _state.markup = writer.render(parse_markdown(note));
    } catch (error) {
      console.log(error);
      document.title = "Mostafa Elshamy - " + error;
      _state.markup = writer.render(parse_markdown(md_404(error)));
    } finally {
      document.querySelector('#progress').component.hide();
    }
  }

  const init = () => {
    fetch_note();
  }

  const effects = () => {
    renderMathInElement(_root.shadowRoot);
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
