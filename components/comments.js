import { html, state, web_component, define_component } from "flare";

import { ASSET_HOST, ago, format_date, debounce } from "/components/app.js";

const MAX_CHAR = 140;

const template = (data) => html`
  <div ref="comments">
    ${ data.comments
      ? data.comments.map((comment) => `
      <p>
        <time title="${format_date(comment.time)}" datetime="${comment.time}">${ago(comment.time)}</time>
        ${ comment.text }
      </p>
      `).join('') : ''
    }
    ${ data["can-add-comment"] === "true"
      ? `<form id="add-comment-form" action="" method="">
        <label for="comment">Comment</label>
        <textarea id="comment" name="comment" placeholder="Add a comment..." maxlength="${MAX_CHAR}" required></textarea>
        <span id="char-count" ref="char_count" data-value="${data.char_count}">${data.char_count?.toString()}</span>
        <button type="submit" id="submit-btn">
          <svg class="symbol" width="10.3345" height="12.3599" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10.3345 12.3599">
           <g>
            <rect height="12.3599" opacity="0" width="10.3345" x="0" y="0"/>
            <path d="M4.98047 12.3599C5.37061 12.3599 5.65283 12.0859 5.65283 11.6958L5.65283 3.41992L5.56982 1.37793L5.13818 1.52734L7.66162 4.32471L8.84863 5.47852C8.96484 5.59473 9.13916 5.66113 9.31348 5.66113C9.68701 5.66113 9.96094 5.37061 9.96094 5.00537C9.96094 4.83105 9.89453 4.67334 9.75342 4.51562L5.47852 0.232422C5.3374 0.0830078 5.16309 0 4.98047 0C4.79785 0 4.62354 0.0830078 4.48242 0.232422L0.20752 4.51562C0.0664062 4.67334 0 4.83105 0 5.00537C0 5.37061 0.273926 5.66113 0.647461 5.66113C0.821777 5.66113 0.996094 5.59473 1.1123 5.47852L2.29932 4.32471L4.81445 1.52734L4.39111 1.37793L4.30811 3.41992L4.30811 11.6958C4.30811 12.0859 4.59033 12.3599 4.98047 12.3599Z" fill="currentColor" fill-opacity="0.85"/>
           </g>
          </svg>
        </button>
      </form>`
      : ''
    }
  </div>
`

const style = `
  :host {
    display: none;
  }

  p {
    margin-bottom: 0;
    font-size: 14px;
  }

  p time {
    color: #aaa;
  }

  #add-comment-form {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    position: relative;
  }

  #add-comment-form label {
    display: none;
  }

  #add-comment-form textarea {
    margin: 0 3px;
    padding: 5px;
    padding-right: calc(3ch + 34px);
    flex: 1;
    box-sizing: border-box;
    border: 0;
    border-radius: var(--border-radius);
    resize: none;
    font-family: var(--type-body), sans-serif;
    font-size: 1rem;
    height: calc(1.5*var(--line-height-body));
  }

  #add-comment-form textarea:focus:focus-visible {
    outline: 3px solid rgb(0, 103, 244,0.5);
  }

  #add-comment-form button {
    margin: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 6px;
    border: 0;
  }

  #char-count {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 36px;
    min-width: 3ch;
    text-align: right;
    font-size: 1rem;
    color: #a9a9a9;
    &[data-value="0"] {
      color: var(--red);
    }
  }
`

export function comments(spec) {
  let { _root, shadow } = spec;
  const _web_component = web_component(spec);
  const _state = state(spec);

  const fetch_comments = async () => {
    try {
      const response = await fetch(`${ASSET_HOST}/comment?id=${spec.id}`, {
        cache: "no-cache"
      });
      console.log(response);
      if (response.status === 404) { throw 'No comments found' }
      const comments = await response.json();
      _state.comments = comments;
    } catch (error) {
      console.log(error);
    }
  }

  const init = () => {
    if (spec["can-add-comment"] === "true") {
      _state.char_count = MAX_CHAR;
    }
    if (spec.loading !== "lazy") {
      load();
    }
  }
  
  const load = () => {
    fetch_comments();
    _root.dataset.loaded = '';
  }
  
  const toggle_comments = () => {
    if (_root.dataset.open === "") {
      _root.removeAttribute("data-open");
      _root.setAttribute("style", "display: none;");
    } else {
      _root.dataset.open = "";
      _root.setAttribute("style", "display: block;");
      if (!("loaded" in _root.dataset)) {
        load();
      }
    }
  }

  const update_char_count = (target) => {
    const input_field = target;
    const trimmed_value = input_field.value.trim();
    if (input_field.value === "" || trimmed_value !== "") {
      input_field.setCustomValidity("");
    } else {
      input_field.setCustomValidity("Please fill out this field.");
    }
    _state.char_count = MAX_CHAR - input_field.value.length;
  }
  
  const debounced_update_char_count = debounce((target) => {
    update_char_count(target) },
  300);
  
  const handle_input = (event) => {
    debounced_update_char_count(event.target);
  }
  
  const submit_comment_form = (event) => {
    submit(event, shadow.querySelector("#add-comment-form"));
  }

  const submit = (event, form) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }
    
    const reactions_component = _root.parentNode.querySelector("wd-reactions")?.component
    reactions_component?.increment_comment()
    let object = {};
    new FormData(form).forEach((value, key) => {object[key] = value});

    fetch(`${ASSET_HOST}/comment?id=${spec.id}`, {
      method: 'POST',
      body: JSON.stringify(object)
    })
    .then(response => {
      if (response.ok) {
//        reactions_component?.increment_comment()
        document.querySelector('#toast').component.display("Comment posted!");
        fetch_comments();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .catch(error => { console.log(error); document.querySelector('#toast').component.display("Uh oh! Comment not posted.") });
  }
  
  const effects = () => {
    shadow.querySelector('#submit-btn')?.addEventListener("click", submit_comment_form);
    shadow.querySelector('#comment')?.addEventListener("input", handle_input);
  }
  
  const cleanup_effects = () => {
    shadow.querySelector('#submit-btn')?.removeEventListener("click", submit_comment_form);
    shadow.querySelector('#comment')?.removeEventListener("input", handle_input);
  }

  return Object.freeze({
    ..._web_component,
    init,
    load,
    effects,
    toggle_comments
  })
}

define_component({
  name: "wd-comments",
  component: comments,
  template,
  style,
  props: ["id", "loading", "can-add-comment"]
});

