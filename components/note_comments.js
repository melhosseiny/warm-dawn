import { html, state, web_component, define_component } from "flare";

const ASSET_HOST = "https://important-deer-81.deno.dev";

const NOW = 5
const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const MONTH_30 = DAY * 30
const MONTH = DAY * 30.41675 // This results in 365.001 days in a year, which is close enough for nearly all cases

function ago(date) {
  let ts;
  if (typeof date === 'string') {
    ts = Number(new Date(date))
  } else if (date instanceof Date) {
    ts = Number(date)
  } else {
    ts = date
  }
  const diffSeconds = Math.floor((Date.now() - ts) / 1e3)
  if (diffSeconds < NOW) {
    return `now`
  } else if (diffSeconds < MINUTE) {
    return `${diffSeconds}s`
  } else if (diffSeconds < HOUR) {
    return `${Math.floor(diffSeconds / MINUTE)}m`
  } else if (diffSeconds < DAY) {
    return `${Math.floor(diffSeconds / HOUR)}h`
  } else if (diffSeconds < MONTH_30) {
    return `${Math.round(diffSeconds / DAY)}d`
  } else {
    let months = diffSeconds / MONTH
    if (months % 1 >= 0.9) {
      months = Math.ceil(months)
    } else {
      months = Math.floor(months)
    }

    if (months < 12) {
      return `${months}mo`
    } else {
      const datetime_format = new Intl.DateTimeFormat("en-US");
      const date = new Date(ts);
      return datetime_format.format(date);
    }
  }
}

const format_date = ago;

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

export function note_comments(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = state(spec);

  const fetch_note_comments = async () => {
    try {
      const response = await fetch(`${ASSET_HOST}/comment?id=${spec.id}`, {
        cache: "no-cache"
      });
      console.log(response);
      if (response.status === 404) { throw 'No comments found' }
      const note_comments = await response.json();
      _state.comments = note_comments;
      _root.parentNode.querySelector("button").dataset.comments = note_comments.length;
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

    if (submit_button) {
      submit_button.addEventListener("click", (event) => { submit(event, add_comment_form) });
    }
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

