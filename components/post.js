import { html, state, web_component, define_component } from "flare";

import { ASSET_HOST, ago, format_date } from "/components/app.js";
const PAGE_SIZE = 10;


const template = (data) => html`
  <div class="post" ref="post">
    ${ data.post ? 
      `<ad-card ${ data.time ? `subtitle-label="<time title='${format_date(data.time)}' datetime='${data.time}'>${ago(data.time)}</time>"` : '' }>
        <div slot="text">
          ${ data.post.html }
        </div>
        <div slot="actions">
          <div class="reactions">
            <wd-like-button likes="${data.post.like}" id="${data.post.id}"></wd-like-button>
            <button class="comment-button text" data-id="${data.post.id}" data-comments="${ data.post.comment > 0 ? data.post.comment : '' }">
              <svg class="symbol" height="13.8374" width="15.2651" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 15.2651 13.8374">
                <g>
                  <rect height="13.8374" opacity="0" width="15.2651" x="0" y="0"/>
                  <path d="M2.85547 13.8374C3.78516 13.8374 5.67773 12.8745 7.01416 11.8867C11.6543 11.9199 14.8916 9.28027 14.8916 5.95166C14.8916 2.65625 11.5796 0 7.4458 0C3.32031 0 0 2.65625 0 5.95166C0 8.09326 1.36963 10.0024 3.42822 10.9321C3.12939 11.5132 2.56494 12.335 2.26611 12.7334C1.90918 13.2065 2.1333 13.8374 2.85547 13.8374ZM3.66895 12.6006C3.61914 12.6255 3.60254 12.584 3.63574 12.5425C4.01758 12.0693 4.52393 11.3721 4.73975 10.9902C4.94727 10.6167 4.89746 10.2681 4.41602 10.0439C2.37402 9.09766 1.22852 7.62842 1.22852 5.95166C1.22852 3.35352 3.98438 1.22852 7.4458 1.22852C10.9155 1.22852 13.6631 3.35352 13.6631 5.95166C13.6631 8.5415 10.9155 10.6665 7.4458 10.6665C7.36279 10.6665 7.19678 10.6665 6.95605 10.6665C6.64893 10.6665 6.4165 10.7661 6.14258 10.9902C5.42041 11.5547 4.2749 12.3101 3.66895 12.6006Z" fill="currentColor" fill-opacity="0.85"/>
                </g>
              </svg>
            </button>
            <button class="share-button text" data-id="${data.post.id}">
              <svg class="symbol" width="12.0527" height="17.4565" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 12.0527 17.4565">
               <g>
                <rect height="17.4565" opacity="0" width="12.0527" x="0" y="0"/>
                <path d="M11.6792 7.32959L11.6792 13.7046C11.6792 15.0991 10.9819 15.7881 9.5625 15.7881L2.1167 15.7881C0.705566 15.7881 0 15.0991 0 13.7046L0 7.32959C0 5.93506 0.705566 5.24609 2.1167 5.24609L3.94287 5.24609L3.94287 6.44141L2.1333 6.44141C1.53564 6.44141 1.19531 6.76514 1.19531 7.396L1.19531 13.6382C1.19531 14.269 1.53564 14.5928 2.1333 14.5928L9.5459 14.5928C10.1353 14.5928 10.4839 14.269 10.4839 13.6382L10.4839 7.396C10.4839 6.76514 10.1353 6.44141 9.5459 6.44141L7.72803 6.44141L7.72803 5.24609L9.5625 5.24609C10.9819 5.24609 11.6792 5.94336 11.6792 7.32959Z" fill="currentColor" fill-opacity="0.85"/>
                <path d="M5.83545 10.6416C6.15918 10.6416 6.43311 10.3843 6.43311 10.0688L6.43311 3.61084L6.3833 2.61475L6.71533 2.97168L7.62842 3.96777C7.73633 4.09229 7.88574 4.14209 8.03516 4.14209C8.34229 4.14209 8.57471 3.92627 8.57471 3.62744C8.57471 3.46973 8.5083 3.34521 8.40039 3.2373L6.26709 1.20361C6.11768 1.0459 5.99316 1.00439 5.83545 1.00439C5.68604 1.00439 5.56152 1.0459 5.40381 1.20361L3.27881 3.2373C3.1626 3.34521 3.10449 3.46973 3.10449 3.62744C3.10449 3.92627 3.32861 4.14209 3.63574 4.14209C3.77686 4.14209 3.94287 4.09229 4.04248 3.96777L4.96387 2.97168L5.2959 2.61475L5.24609 3.61084L5.24609 10.0688C5.24609 10.3843 5.52002 10.6416 5.83545 10.6416Z" fill="currentColor" fill-opacity="0.85"/>
               </g>
              </svg>
            </button>
          </div>
          <wd-comments loading="lazy" id="${data.post.id}" can-add-comment="${true}" lang="en" dir="ltr" style="display: none;"></wd-comments>
        </div>
      </ad-card>` : ''
    }
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

  .reactions {
    display: flex;
    align-items: center;
    gap: 8px;
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

 .comment-button:hover, .comment-button:active {
    color: var(--blue);
  }

  .share-button:hover, .share-button:active {
    color: var(--green);
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
    shadow.querySelector(".comment-button")?.addEventListener("click", toggle_comments);
    shadow.querySelector(".share-button")?.addEventListener("click", share_post);
  }

  const cleanup_effects = () => {
    shadow.querySelector('.comment-button')?.removeEventListener("click", toggle_comments);
    shadow.querySelector('.share-button')?.removeEventListener("click", share_post);
  }

  return Object.freeze({
    ..._web_component,
    init,
    effects,
    cleanup_effects
  })
}

define_component({
  name: "wd-post",
  component: post,
  template,
  style,
  props: ["id", "time"]
});

