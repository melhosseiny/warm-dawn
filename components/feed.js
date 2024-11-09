import { html, state, web_component, define_component } from "flare";

import { comments } from "/components/comments.js";
import { like_button } from "/components/like_button.js";

import { ASSET_HOST, ago, format_date } from "/components/app.js";
const PAGE_SIZE = 10;

const template = (data) => html`
  <div id="feed" ref="page">
    ${ data.page && data.page.posts ?
      data.page.posts.slice().map((post, index) =>
        `<ad-card data-hash="${post.hash}" subtitle-label="<time title='${format_date(post.time)}' datetime='${post.time}'>${ago(post.time)}</time>">
          <div slot="text">
            <wd-post id="${post.id}"></wd-post>
          </div>
          <div slot="actions">
            <wd-like-button likes="${post.like}" id="${post.id}"></wd-like-button>
            <button class="comment-button text" data-id="${post.id}">
              <svg class="symbol" height="13.8374" width="15.2651" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 15.2651 13.8374">
                 <g>
                  <rect height="13.8374" opacity="0" width="15.2651" x="0" y="0"/>
                  <path d="M2.85547 13.8374C3.78516 13.8374 5.67773 12.8745 7.01416 11.8867C11.6543 11.9199 14.8916 9.28027 14.8916 5.95166C14.8916 2.65625 11.5796 0 7.4458 0C3.32031 0 0 2.65625 0 5.95166C0 8.09326 1.36963 10.0024 3.42822 10.9321C3.12939 11.5132 2.56494 12.335 2.26611 12.7334C1.90918 13.2065 2.1333 13.8374 2.85547 13.8374ZM3.66895 12.6006C3.61914 12.6255 3.60254 12.584 3.63574 12.5425C4.01758 12.0693 4.52393 11.3721 4.73975 10.9902C4.94727 10.6167 4.89746 10.2681 4.41602 10.0439C2.37402 9.09766 1.22852 7.62842 1.22852 5.95166C1.22852 3.35352 3.98438 1.22852 7.4458 1.22852C10.9155 1.22852 13.6631 3.35352 13.6631 5.95166C13.6631 8.5415 10.9155 10.6665 7.4458 10.6665C7.36279 10.6665 7.19678 10.6665 6.95605 10.6665C6.64893 10.6665 6.4165 10.7661 6.14258 10.9902C5.42041 11.5547 4.2749 12.3101 3.66895 12.6006Z" fill="currentColor" fill-opacity="0.85"/>
                 </g>
                </svg>
              ${ post.comment > 0 ? post.comment : '' }
            </button>
            <br>
            <wd-comments loading="lazy" id="${post.id}" can-add-comment="${true}" lang="en" dir="ltr" style="display: none;"></wd-comments>
          </div>
        </ad-card>
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
    max-width: 38em;
  }

  #feed {
    content-visibility: auto;
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

  .comment-button[data-comments]::after {
    content: attr(data-comments);
  }

  button {
    border: 0 none;
    color: rgba(var(--text-color), 0.7);
  }
  button.text {
    --opacity-hover: 0;
    --opacity-active: 0;
  }

  button:hover {
    color: var(--b21);
  }

  button:active {
    color: var(--b21);
  }
`

export function feed(spec) {
  let { _root, shadow } = spec;
  const _web_component = web_component(spec);
  const _state = state(spec);

  const fetch_posts = async () => {
    const response = await fetch(`${ASSET_HOST}/post/index.json?page_size=${PAGE_SIZE}`);
    const page = await response.json();
    _state.page = page;
    _state.more = page.has_more;
    console.log("_feedstate", _state.page, _state.more);
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

  const init = () => {
    console.log("wd-feed:init", this, _root, shadow);
    fetch_posts();
  }

  const handle_fetch_more = (event) => {
    event.preventDefault();
    fetch_more_posts(_state.page.cursor);
  }

  const effects = () => {
    const more_btn = shadow.querySelector('#more');
    if (more_btn) {
      more_btn.addEventListener("click", handle_fetch_more);
    }
    
    const comment_buttons = shadow.querySelectorAll('.comment-button');
    comment_buttons.forEach(button => button.addEventListener("click", toggle_comments));
  }

  const cleanup_effects = () => {
    const more_btn = shadow.querySelector('#more');
    if (more_btn) {
      more_btn.removeEventListener("click", handle_fetch_more);
    }
    
    const comment_buttons = shadow.querySelectorAll('.comment-button');
    comment_buttons.forEach(button => button.removeEventListener("click", toggle_comments));
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
