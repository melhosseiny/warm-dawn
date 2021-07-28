import { html, state, web_component, define_component } from "https://busy-dog-44.deno.dev/melhosseiny/sourdough/main/sourdough.js";

const template = (data) => html`
  <dialog>
    <form id="contact-form" action="" method="">
      <div>
        <label for="name">Name</label>
        <input name="name" required>
      </div>
      <div>
        <label for="email">E-mail</label>
        <input name="email" type=email required>
      </div>
      <div>
        <label for="message">Message</label>
        <textarea name="message" cols="10" required></textarea>
      </div>
    </form>
    <footer>
      <button id="cancel-btn">Cancel</button>
      <button type="submit" id="submit-btn" form="contact-form">Submit</button>
    </footer>
  </dialog>
`

const style = `
  dialog {
    font-family: var(--type-body);
    padding: 0;
    border: 1px solid rgba(0,0,0,0.12);
    min-width: 280px;
    max-width: 560px;
    left: 50%;
    right: auto;
    transform: translate(-50%, 0);
  }

  dialog header {
    background: none;
    border-right: 0;
    padding: 0.5em;
  }

  dialog form {
    padding: 0.5em;
  }

  dialog footer {
    text-align: right;
    padding: 0.5em;
  }

  dialog button {
    background-color: rgba(0,0,0,0.12);
    border: 1px solid rgba(0,0,0,0.12);
  }

  dialog button:hover {
    background-color: rgba(0,0,0,0.2);
  }

  dialog + .backdrop {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.1);
  }

  input, textarea {
    font-family: var(--type-body), sans-serif;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
    border: 0;
    border-bottom: 1px solid rgba(0,0,0,0.12);
    background-color: transparent;
    padding: 8px 0;
    margin-bottom: 0.5em;
    transition: border-color 0.3s linear;
  }

  textarea {
    resize: none;
    min-height: 10em;
  }

  input:focus, textarea:focus {
    outline: none;
    border-bottom: 2px solid rgb(var(--accent-color));
  }
`

export function contact_dialog(spec) {
  let { _root } = spec;
  const _state = state(spec);
  const _web_component = web_component(spec);

  const init = () => {}

  const effects = () => {
    const dialog = _root.shadowRoot.querySelector('dialog');
    const cancel_button = _root.shadowRoot.querySelector('#cancel-btn');
    const submit_button = _root.shadowRoot.querySelector('#submit-btn');
    const contact_form = _root.shadowRoot.querySelector("#contact-form");

    dialog.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target === dialog) {
        close();
      }
    });

    cancel_button.addEventListener('click', (event) => {
      close();
    });

    console.log(contact_form);

    submit_button.addEventListener("click", (event) => { submit(event, contact_form) });
  }

  const submit = (event, form) => {
    event.preventDefault();

    let object = {};
    new FormData(form).forEach((value, key) => {object[key] = value});

    document.querySelector('#progress').component.show();
    fetch("https://13w5sdxo74.execute-api.us-west-1.amazonaws.com/mailfwd", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object)
    })
    .then(response => {
      document.querySelector('#progress').component.hide();
      if (response.ok) {
        document.querySelector('#toast').component.display("Message sent!");
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .catch(error => document.querySelector('#toast').component.display("Uh oh! Message not sent."));

    close();
  }

  const show = () => {
    console.log(_root.shadowRoot.querySelector('dialog'));
    _root.shadowRoot.querySelector('dialog').showModal();
  }

  const close = () => {
    _root.shadowRoot.querySelector('dialog').close();
  }

  return Object.freeze({
    ..._web_component,
    effects,
    submit,
    show,
    close
  })
}

define_component({
  name: 'wd-contact-dialog',
  component: contact_dialog,
  template,
  style
});
