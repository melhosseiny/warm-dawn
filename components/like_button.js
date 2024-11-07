import { html, state, web_component, define_component } from "flare";

//const ASSET_HOST = "http://localhost:4507";
const ASSET_HOST = "https://important-deer-81.deno.dev";

const template = (data) => html`
  <button ref="likes" class="like-button text" data-id="${data.id}">
    ${data.likes > 0 ?
      `<svg class="symbol" height="12.5591" width="13.439" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 13.439 12.5591">
       <g>
        <rect height="12.5591" opacity="0" width="13.439" x="0" y="0"/>
        <path d="M6.53271 12.5591C6.68213 12.5591 6.89795 12.4595 7.04736 12.3599C10.7744 10.0024 13.0654 7.24658 13.0654 4.43262C13.0654 2.0918 11.4551 0.431641 9.38818 0.431641C8.08496 0.431641 7.13867 1.14551 6.53271 2.22461C5.93506 1.15381 4.98047 0.431641 3.67725 0.431641C1.61035 0.431641 0 2.0918 0 4.43262C0 7.24658 2.29102 10.0024 6.01807 12.3599C6.16748 12.4595 6.3916 12.5591 6.53271 12.5591Z" fill="var(--rv21)" fill-opacity="0.85"/>
       </g>
      </svg>` :
      `<svg class="symbol" height="12.5591" width="13.439" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 13.439 12.5591">
       <g>
        <rect height="12.5591" opacity="0" width="13.439" x="0" y="0"/>
        <path d="M0 4.43262C0 7.24658 2.29102 10.0024 6.01807 12.3599C6.16748 12.4595 6.3916 12.5591 6.53271 12.5591C6.68213 12.5591 6.89795 12.4595 7.04736 12.3599C10.7744 10.0024 13.0654 7.24658 13.0654 4.43262C13.0654 2.0918 11.4551 0.431641 9.31348 0.431641C8.08496 0.431641 7.13867 0.987793 6.53271 1.83447C5.93506 0.996094 4.98047 0.431641 3.75195 0.431641C1.61035 0.431641 0 2.0918 0 4.43262ZM1.19531 4.43262C1.19531 2.74756 2.28271 1.62695 3.74365 1.62695C4.97217 1.62695 5.63623 2.39893 6.04297 2.98828C6.24219 3.27881 6.3667 3.36182 6.53271 3.36182C6.70703 3.36182 6.80664 3.27051 7.02246 2.98828C7.4624 2.41553 8.10156 1.62695 9.33008 1.62695C10.791 1.62695 11.8701 2.74756 11.8701 4.43262C11.8701 6.83984 9.30518 9.47119 6.68213 11.2144C6.60742 11.2642 6.55762 11.2974 6.53271 11.2974C6.50781 11.2974 6.45801 11.2642 6.3916 11.2144C3.76025 9.47119 1.19531 6.83984 1.19531 4.43262Z" fill="currentColor" fill-opacity="0.85"/>
       </g>
      </svg>`
    }
    ${data.likes}
  </button>
`

const style = `
  :host {
    display: inline-flex;
    line-height: var(--line-height-body);
    vertical-align: top;
  }

  button {
    border: 0 none;
    padding-left: 0;
    color: rgba(var(--text-color), 0.7);
  }

  
  button.text {
    --opacity-hover: 0;
    --opacity-active: 0;
  }

  button:hover {
    color: var(--rv21);
  }

  button:active {
    color: var(--rv21);
  }
`

export function like_button(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = state(spec);
  
  const like_post = async (event) => {
    const target = event.currentTarget;
    let object = {
      likes: Number(_state.likes) + 1
    };
    new FormData().forEach((value, key) => {object[key] = value});

    fetch(`${ASSET_HOST}/like?id=${target.dataset.id}`, {
      method: "POST",
      body: JSON.stringify(object)
    })
    .then(response => {
      if (response.ok) {
        increment_likes();
        document.querySelector('#toast').component.display("Post liked!");
        //fetch_note_comments();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .catch(error => { console.log(error); document.querySelector('#toast').component.display("Uh oh! Post not liked.") });
  }

  const init = () => {
    _state.likes = Number(spec.likes);
  }
  
  const increment_likes = (event) => {
    _state.likes = _state.likes + 1;
  }

  const effects = () => {
    const like_button = _root.shadowRoot.querySelector('.like-button');
    like_button.addEventListener("click", like_post);
  }

  const cleanup_effects = () => {
    const like_button = _root.shadowRoot.querySelector('.like-button');
    like_button.removeEventListener("click", like_post);
  }

  return Object.freeze({
    ..._web_component,
    init,
    effects,
    cleanup_effects,
    increment_likes
  })
}

define_component({
  name: "wd-like-button",
  component: like_button,
  template,
  style,
  props: ["likes", "id"]
});

