import { html, state, web_component, define_component } from "flare";

import { ASSET_HOST, HOST, format_big_n } from "/components/app.js";

const template = (data) => html`
  <button ref="like" class="like-button text" data-id="${data.id}">
    ${data.like > 0 ?
      `<svg class="symbol" height="12.5591" width="13.439" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 13.439 12.5591">
       <g>
        <rect height="12.5591" opacity="0" width="13.439" x="0" y="0"/>
        <path d="M6.53271 12.5591C6.68213 12.5591 6.89795 12.4595 7.04736 12.3599C10.7744 10.0024 13.0654 7.24658 13.0654 4.43262C13.0654 2.0918 11.4551 0.431641 9.38818 0.431641C8.08496 0.431641 7.13867 1.14551 6.53271 2.22461C5.93506 1.15381 4.98047 0.431641 3.67725 0.431641C1.61035 0.431641 0 2.0918 0 4.43262C0 7.24658 2.29102 10.0024 6.01807 12.3599C6.16748 12.4595 6.3916 12.5591 6.53271 12.5591Z" fill="var(--pink)" fill-opacity="0.85"/>
       </g>
      </svg>` :
      `<svg class="symbol" height="12.5591" width="13.439" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 13.439 12.5591">
       <g>
        <rect height="12.5591" opacity="0" width="13.439" x="0" y="0"/>
        <path d="M0 4.43262C0 7.24658 2.29102 10.0024 6.01807 12.3599C6.16748 12.4595 6.3916 12.5591 6.53271 12.5591C6.68213 12.5591 6.89795 12.4595 7.04736 12.3599C10.7744 10.0024 13.0654 7.24658 13.0654 4.43262C13.0654 2.0918 11.4551 0.431641 9.31348 0.431641C8.08496 0.431641 7.13867 0.987793 6.53271 1.83447C5.93506 0.996094 4.98047 0.431641 3.75195 0.431641C1.61035 0.431641 0 2.0918 0 4.43262ZM1.19531 4.43262C1.19531 2.74756 2.28271 1.62695 3.74365 1.62695C4.97217 1.62695 5.63623 2.39893 6.04297 2.98828C6.24219 3.27881 6.3667 3.36182 6.53271 3.36182C6.70703 3.36182 6.80664 3.27051 7.02246 2.98828C7.4624 2.41553 8.10156 1.62695 9.33008 1.62695C10.791 1.62695 11.8701 2.74756 11.8701 4.43262C11.8701 6.83984 9.30518 9.47119 6.68213 11.2144C6.60742 11.2642 6.55762 11.2974 6.53271 11.2974C6.50781 11.2974 6.45801 11.2642 6.3916 11.2144C3.76025 9.47119 1.19531 6.83984 1.19531 4.43262Z" fill="currentColor" fill-opacity="0.85"/>
       </g>
      </svg>`
    }
    ${ data.like > 0 ? format_big_n(data.like) : '' }
  </button>
  <button ref="comment" class="comment-button text" data-id="${data.id}">
    <svg class="symbol" height="13.8374" width="15.2651" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 15.2651 13.8374">
      <g>
        <rect height="13.8374" opacity="0" width="15.2651" x="0" y="0"/>
        <path d="M2.85547 13.8374C3.78516 13.8374 5.67773 12.8745 7.01416 11.8867C11.6543 11.9199 14.8916 9.28027 14.8916 5.95166C14.8916 2.65625 11.5796 0 7.4458 0C3.32031 0 0 2.65625 0 5.95166C0 8.09326 1.36963 10.0024 3.42822 10.9321C3.12939 11.5132 2.56494 12.335 2.26611 12.7334C1.90918 13.2065 2.1333 13.8374 2.85547 13.8374ZM3.66895 12.6006C3.61914 12.6255 3.60254 12.584 3.63574 12.5425C4.01758 12.0693 4.52393 11.3721 4.73975 10.9902C4.94727 10.6167 4.89746 10.2681 4.41602 10.0439C2.37402 9.09766 1.22852 7.62842 1.22852 5.95166C1.22852 3.35352 3.98438 1.22852 7.4458 1.22852C10.9155 1.22852 13.6631 3.35352 13.6631 5.95166C13.6631 8.5415 10.9155 10.6665 7.4458 10.6665C7.36279 10.6665 7.19678 10.6665 6.95605 10.6665C6.64893 10.6665 6.4165 10.7661 6.14258 10.9902C5.42041 11.5547 4.2749 12.3101 3.66895 12.6006Z" fill="currentColor" fill-opacity="0.85"/>
      </g>
    </svg>
    ${ data.comment > 0 ? format_big_n(data.comment) : '' }
  </button>
  <button class="share-button text" data-id="${data.id}">
    <svg class="symbol" width="12.0527" height="17.4565" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 12.0527 17.4565">
     <g>
      <rect height="17.4565" opacity="0" width="12.0527" x="0" y="0"/>
      <path d="M11.6792 7.32959L11.6792 13.7046C11.6792 15.0991 10.9819 15.7881 9.5625 15.7881L2.1167 15.7881C0.705566 15.7881 0 15.0991 0 13.7046L0 7.32959C0 5.93506 0.705566 5.24609 2.1167 5.24609L3.94287 5.24609L3.94287 6.44141L2.1333 6.44141C1.53564 6.44141 1.19531 6.76514 1.19531 7.396L1.19531 13.6382C1.19531 14.269 1.53564 14.5928 2.1333 14.5928L9.5459 14.5928C10.1353 14.5928 10.4839 14.269 10.4839 13.6382L10.4839 7.396C10.4839 6.76514 10.1353 6.44141 9.5459 6.44141L7.72803 6.44141L7.72803 5.24609L9.5625 5.24609C10.9819 5.24609 11.6792 5.94336 11.6792 7.32959Z" fill="currentColor" fill-opacity="0.85"/>
      <path d="M5.83545 10.6416C6.15918 10.6416 6.43311 10.3843 6.43311 10.0688L6.43311 3.61084L6.3833 2.61475L6.71533 2.97168L7.62842 3.96777C7.73633 4.09229 7.88574 4.14209 8.03516 4.14209C8.34229 4.14209 8.57471 3.92627 8.57471 3.62744C8.57471 3.46973 8.5083 3.34521 8.40039 3.2373L6.26709 1.20361C6.11768 1.0459 5.99316 1.00439 5.83545 1.00439C5.68604 1.00439 5.56152 1.0459 5.40381 1.20361L3.27881 3.2373C3.1626 3.34521 3.10449 3.46973 3.10449 3.62744C3.10449 3.92627 3.32861 4.14209 3.63574 4.14209C3.77686 4.14209 3.94287 4.09229 4.04248 3.96777L4.96387 2.97168L5.2959 2.61475L5.24609 3.61084L5.24609 10.0688C5.24609 10.3843 5.52002 10.6416 5.83545 10.6416Z" fill="currentColor" fill-opacity="0.85"/>
     </g>
    </svg>
  </button>
`

const style = `
  :host {
    display: inline-flex;
    line-height: var(--line-height-body);
    vertical-align: top;
  }
  
  button.text {
    --opacity-hover: 0;
    --opacity-active: 0;
    border: 0 none;
    color: rgba(var(--text-color), 0.7);
    font-size: 1rem;
    font-variant-caps: normal;
  }

  .like-button {
    padding-left: 0;
  }

  .like-button:hover, .like-button:active {
    color: var(--pink);
  }

 .comment-button:hover, .comment-button:active {
    color: var(--blue);
  }

  .share-button:hover, .share-button:active {
    color: var(--green);
  }

  button .symbol {
    padding-top: 0;
  }
`

export function reactions(spec) {
  let { _root, shadow } = spec;
  const _web_component = web_component(spec);
  const _state = state(spec);
  
  const like_post = async (event) => {
    const target = event.currentTarget;

    fetch(`${ASSET_HOST}/like?id=${target.dataset.id}`, {
      method: "PATCH"
    })
    .then(response => {
      if (response.ok) {
        increment_like();
        document.querySelector('#toast').component.display("Post liked!");
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .catch(error => { console.log(error); document.querySelector('#toast').component.display("Uh oh! Post not liked.") });
  }
  
  const toggle_comments = (event) => {
    const comments_component = _root.parentNode.querySelector("wd-comments").component;
    comments_component?.toggle_comments();
  }

  const share_post = async (event) => {
    const id = event.currentTarget.dataset.id;
    try {
      await navigator.share({
        url: `${HOST}/post/${id}`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const init = () => {
    _state.like = BigInt(spec.like);
    _state.comment = BigInt(spec.comment);
  }
  
  const increment_like = (event) => {
    _state.like++;
  }

  const increment_comment = () => {
    _state.comment++;
  }

  const effects = () => {
    shadow.querySelector('.like-button')?.addEventListener("click", like_post);
    shadow.querySelector(".comment-button")?.addEventListener("click", toggle_comments);
    shadow.querySelector(".share-button")?.addEventListener("click", share_post);
  }

  const cleanup_effects = () => {
    shadow.querySelector('.like-button')?.removeEventListener("click", like_post);
    shadow.querySelector('.comment-button')?.removeEventListener("click", toggle_comments);
    shadow.querySelector('.share-button')?.removeEventListener("click", share_post);
  }

  return Object.freeze({
    ..._web_component,
    init,
    effects,
    cleanup_effects,
    increment_comment
  })
}

define_component({
  name: "wd-reactions",
  component: reactions,
  template,
  style,
  props: ["id", "like", "comment"]
});

