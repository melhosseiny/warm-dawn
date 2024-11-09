import { html, state, web_component, define_component } from "flare";

const template = (data) => html`
  <dialog>
    <form id="contact-form" action="" method="">
      <div>
        <label for="name">Name</label>
        <input id="name" name="name" required>
      </div>
      <div>
        <label for="email">E-mail</label>
        <input id="email" name="email" type=email required>
      </div>
      <div>
        <label for="message">Message</label>
        <textarea id="message" name="message" cols="10" required></textarea>
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
    box-shadow: 3px 3px rgba(0,0,0,0.1);
    border: 0 none;
    min-width: 280px;
    width: 280px;
    max-width: 560px;
    left: 50%;
    right: auto;
    transform: translate(-50%, 0);
    transition: opacity 1s ease-in-out;
  }

  dialog[open]::backdrop {
    animation: backdrop-fade 1s ease forwards;
  }

  @keyframes backdrop-fade {
    from {
      background: transparent;
    }
    to {
      background: rgba(0,0,0,0.1);
    }
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

  input, textarea {
    font-family: var(--type-body), sans-serif;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
    background-color: rgba(0,0,0,0.1);
    border: 0 none;
    border-radius: var(--border-radius);
    padding: 8px 4px;
    margin-bottom: 0.5em;
    transition: border-color 0.3s linear;
  }

  textarea {
    resize: none;
    min-height: 10em;
  }

  input:focus, textarea:focus {
    outline: none;
  }
`

export function contact_dialog(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = state(spec);

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

    if (!form.reportValidity()) {
      return;
    }

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
