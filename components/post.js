import { html, state, web_component, define_component } from "flare";

import { ASSET_HOST } from "/components/app.js";
const PAGE_SIZE = 10;


const template = (data) => html`
  <div class="post" ref="post">
    ${ data.post ? data.post : '' }
  </div>
`

const style = `
  :host {
    line-height: 1.25em;
    font-size: 1rem;
  }

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
`

export function post(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = state(spec);

  const fetch_post = async () => {
    try {
      const response = await fetch(`${ASSET_HOST}/post/${spec.id}.html`);
      _state.post = await response.text();
      console.log("ffff", _state.post);
    } catch (error) {
      console.error(error);
    }
  }

  const init = () => {
    fetch_post();
  }

  return Object.freeze({
    ..._web_component,
    init
  })
}

define_component({
  name: "wd-post",
  component: post,
  template,
  style,
  props: ["id"]
});

