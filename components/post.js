import { html, state, web_component, define_component } from "flare";

import { ASSET_HOST, ago, format_date, format_big_n } from "/components/app.js";
const PAGE_SIZE = 10;


const template = (data) => html`
  <div class="post" ref="post">
    ${ data.post ? 
      `<ad-card ${ data.time ? `subtitle-label="<time title='${format_date(data.time)}' datetime='${data.time}'>${ago(data.time)}</time>"` : '' }>
        <div slot="text">
          ${ data.post ? data.post.html : '' }
        </div>
        <div slot="actions">
          <wd-reactions
            id="${data.post.id}"
            like="${data.post.like}"
            comment="${data.post.comment}"
          ></wd-reactions>
          <wd-comments loading="lazy" id="${data.post.id}" can-add-comment="${true}" lang="en" dir="ltr" style="display: none;"></wd-comments>
        </div>
      </ad-card>` : ''
    }
  </div>
`

const style = `
  :host, p {
    line-height: 1.25em;
    font-size: 1rem;
  }

  p, blockquote {
    margin-bottom: 1em;
  }

  ad-media-grid {
    margin-bottom: 1em;
  }

  ad-card {
    display: block;
    width: 100%;
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
    white-space: normal;
  }

  ad-card::part(subtitle) {
    display: inline-block;
    color: #666;
    font-size: 14px;
    padding-right: 0.5em;
  }
`

export function post(spec) {
  let { shadow } = spec;
  const _web_component = web_component(spec);
  const _state = state(spec);

  const fetch_post = async () => {
    try {
      const response = await fetch(`${ASSET_HOST}/post/${spec.id}`);
      _state.post = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  const init = () => {
    fetch_post();
  }
  
  const toggle_comments = () => {
    const comments = shadow.querySelector("wd-comments");

    if (_root.dataset.open) {
      _root.removeAttribute("data-open");
      comments.setAttribute("style", "display: none;");
    } else {
      _root.dataset.open = "open";
      comments.setAttribute("style", "display: block;");
      if (!("loaded" in comments.dataset)) {
        comments.component.load();
      }
      comments.dataset.loaded = '';
    }
  }

  const effects = () => {
  }

  const cleanup_effects = () => {
  }

  return Object.freeze({
    ..._web_component,
    init,
    effects,
    cleanup_effects,
    toggle_comments
  })
}

define_component({
  name: "wd-post",
  component: post,
  template,
  style,
  props: ["id", "time"]
});

