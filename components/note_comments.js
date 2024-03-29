import { html, state, web_component, define_component } from "https://busy-dog-44.deno.dev/melhosseiny/sourdough/main/sourdough.js";

const ASSET_HOST = "https://important-deer-81.deno.dev";

const format_date = (datetime) => {
  const datetime_format = new Intl.DateTimeFormat("en-US");
  const date = new Date(datetime);
  return datetime_format.format(date);
}

const template = (data) => html`
  <div ref="comments">
    ${ data.comments
      ? data.comments.map((comment) => `
      <p>
        <time datetime="${comment.time}">${format_date(comment.time)}</time>
        ${ comment.text }
      </p>
      `).join('') : ''
    }
    ${ data.noteloaded === 'true'
      ? `<form id="add-comment-form" action="" method="">
        <label for="comment">Message</label>
        <textarea id="comment" name="comment" placeholder="Add a comment..." maxlength="140" required></textarea>
        <button type="submit" id="submit-btn">Post</button>
      </form>` : ''
    }
  </div>
`

const style = `
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

export function note_comments(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = _web_component.state;

  const fetch_note_comments = async () => {
    try {
      const response = await fetch(`${ASSET_HOST}/comment?id=${spec.id}`, {
        cache: "no-cache"
      });
      if (response.status === 404) { throw 'No comments found' }
      const note_comments = await response.json();
      _state.comments = note_comments;
    } catch (error) {
      console.log(error);
    }
  }

  const init = () => {
    fetch_note_comments();
  }

  const effects = () => {
    const submit_button = _root.shadowRoot.querySelector('#submit-btn');
    const add_comment_form = _root.shadowRoot.querySelector("#add-comment-form");

    submit_button.addEventListener("click", (event) => { submit(event, add_comment_form) });
  }

  const submit = (event, form) => {
    event.preventDefault();

    let object = {};
    new FormData(form).forEach((value, key) => {object[key] = value});

    fetch(`${ASSET_HOST}/comment?id=${spec.id}`, {
      method: 'POST',
      body: JSON.stringify(object)
    })
    .then(response => {
      if (response.ok) {
        document.querySelector('#toast').component.display("Comment posted!");
        fetch_note_comments();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .catch(error => { console.log(error); document.querySelector('#toast').component.display("Uh oh! Comment not posted.") });
  }

  return Object.freeze({
    ..._web_component,
    init,
    effects
  })
}

define_component({
  name: "wd-note-comments",
  component: note_comments,
  template,
  style,
  props: ["id", "noteloaded"]
});

