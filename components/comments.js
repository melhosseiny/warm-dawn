import { html, state, web_component, define_component } from "flare";

import { ASSET_HOST, ago, format_date } from "/components/app.js";

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
        <label for="comment">Message</label>
        <textarea id="comment" name="comment" placeholder="Add a comment..." maxlength="140" required></textarea>
        <button type="submit" id="submit-btn">Post</button>
      </form>` : ''
    }
  </div>
`

const style = `
  :host {
    display: block;
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
    margin-top: 8px;
  }

  #add-comment-form label {
    display: none;
  }

  #add-comment-form textarea {
    flex: 1;
    box-sizing: border-box;
    border: 0;
    border-radius: var(--border-radius);
    resize: none;
    font-family: var(--type-body), sans-serif;
    font-size: 14px;
  }

  #add-comment-form textarea:focus {
    outline-color: rgb(var(--accent-color));
  }

  #add-comment-form button {
    margin: 0;
    margin-left: 8px;
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
      _root.parentNode.querySelector("button").dataset.comments =
        comments.length > 0 ? comments.length : '';
    } catch (error) {
      console.log(error);
    }
  }

  const init = () => {
    if (spec.loading !== "lazy") {
      fetch_comments();
    }
  }
  
  const load = () => {
    fetch_comments();
  }

  const effects = () => {
    const submit_button = shadow.querySelector('#submit-btn');
    const add_comment_form = shadow.querySelector("#add-comment-form");

    if (submit_button) {
      submit_button.addEventListener("click", (event) => { submit(event, add_comment_form) });
    }
  }

  const submit = (event, form) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    let object = {};
    new FormData(form).forEach((value, key) => {object[key] = value});

    fetch(`${ASSET_HOST}/comment?id=${spec.id}`, {
      method: 'POST',
      body: JSON.stringify(object)
    })
    .then(response => {
      if (response.ok) {
        document.querySelector('#toast').component.display("Comment posted!");
        fetch_comments();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .catch(error => { console.log(error); document.querySelector('#toast').component.display("Uh oh! Comment not posted.") });
  }

  return Object.freeze({
    ..._web_component,
    init,
    load,
    effects
  })
}

define_component({
  name: "wd-comments",
  component: comments,
  template,
  style,
  props: ["id", "loading", "can-add-comment"]
});

