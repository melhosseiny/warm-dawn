import { html, state, web_component, define_component } from "flare";

import { reactions } from "/components/reactions.js";
import { comments } from "/components/comments.js";

import { ASSET_HOST, ago, format_date } from "/components/app.js";
const PAGE_SIZE = 10;

const template = (data) => html`
  <div id="feed" ref="page">
    ${ data.page && data.page.posts ?
      data.page.posts.slice().map((post, index) =>
        `<wd-post data-hash="${post.hash}" id="${post.id}" time="${post.time}"></wd-post>
      `).join('') : "<p>No posts yet!</p>"
    }
  </div>
  <div ref="more">
    ${ data.more
      ? `<a id="more" class="button" href="#">More posts
          <svg height="7.16357" width="11.9531" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 11.9531 7.16357">
           <g>
            <rect height="7.16357" opacity="0" width="11.9531" x="0" y="0"/>
            <path d="M5.79395 7.16357C5.97656 7.16357 6.15918 7.09717 6.28369 6.95605L11.3804 1.82617C11.5049 1.70166 11.5796 1.53564 11.5796 1.34473C11.5796 0.95459 11.2891 0.655762 10.8989 0.655762C10.7163 0.655762 10.5337 0.73877 10.4092 0.85498L5.40381 5.87695L6.17578 5.87695L1.17041 0.85498C1.0459 0.73877 0.879883 0.655762 0.688965 0.655762C0.298828 0.655762 0 0.95459 0 1.34473C0 1.53564 0.074707 1.70166 0.199219 1.82617L5.3042 6.95605C5.43701 7.09717 5.60303 7.16357 5.79395 7.16357Z" fill="currentColor" fill-opacity="0.85"/>
           </g>
          </svg>
        </a>`
      : ''
    }
  </div>
`

const style = `
  :host {
    display: block;
    max-width: 38em;
  }

  #feed {
    content-visibility: auto;
  }
`

export function feed(spec) {
  let { shadow } = spec;
  const _web_component = web_component(spec);
  const _state = state(spec);

  const fetch_posts = async () => {
    const response = await fetch(`${ASSET_HOST}/post/index.json?page_size=${PAGE_SIZE}`);
    const page = await response.json();
    _state.page = page;
    _state.more = page.has_more;
    console.log("_feedstate", _state.page, _state.more);
  }
  
  const init = () => {
    fetch_posts();
  }

  const fetch_more_posts = async (after) => {
    const response = await fetch(`${ASSET_HOST}/post/index.json?page_size=${PAGE_SIZE}&after=${after}`);
    const fetched_posts = _state.page.posts;
    const page = await response.json();
    _state.page = {
      ...page,
      posts: [...fetched_posts, ...page.posts]
    }
    _state.more = page.has_more;
    console.log("_refeedstate", _state.page, _state.more);
  }
  
  const handle_fetch_more = (event) => {
    event.preventDefault();
    fetch_more_posts(_state.page.cursor);
  }
  
  const toggle_comments = (event) => {
    const selector = `wd-comments[id="${event.currentTarget.dataset.id}"]`;

    if (event.currentTarget.dataset.open) {
      event.currentTarget.removeAttribute("data-open");
      shadow.querySelector(selector).setAttribute("style", "display: none;");
    } else {
      event.currentTarget.dataset.open = "open";
      shadow.querySelector(selector).setAttribute("style", "display: block;");
      console.log("loaded", event.currentTarget.dataset.loaded);
      if (!("loaded" in event.currentTarget.dataset)) {
        shadow.querySelector(selector).component.load();
      }
      event.currentTarget.dataset.loaded = '';
    }
  }

  const share_post = async (event) => {
    const id = event.currentTarget.dataset.id;
    try {
      await navigator.share({
        url: `http://localhost:8000/post/${id}`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const effects = () => {
    const more_btn = shadow.querySelector('#more');
    if (more_btn) {
      more_btn.addEventListener("click", handle_fetch_more);
    }
  }

  const cleanup_effects = () => {
    const more_btn = shadow.querySelector('#more');
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
  name: "wd-feed",
  component: feed,
  template,
  style
});
