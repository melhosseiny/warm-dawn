import { html, state, web_component, define_component } from "https://busy-dog-44.deno.dev/melhosseiny/sourdough/main/sourdough.js";

const template = (data) => html`
  <div class="scene">
    <div class="qa-card">
      <slot name="q" class="q">front</slot>
      <slot name="a" class="a">back</slot>
    </div>
  </div>
`
const style = `
  :host {
    display: block;
    cursor: pointer;
  }

  .scene {
    perspective: 665px;
    break-inside: avoid-column;
    border-bottom: 20px solid transparent;
  }

  .qa-card {
    display: grid; /* here */
    transition: transform 1s;
    transform-style: preserve-3d;
    transform-origin: center;
  }

  .q, .a {
    display: block;
    grid-area: 1/1;
    box-sizing: border-box;
    backface-visibility: hidden;
    font-weight: bold;
    border-radius: var(--border-radius);
    padding: 1rem;
    overflow-wrap: anywhere;
  }

  .q {
    background-color: var(--rv21);
    color: oklch(from var(--rv21) calc(l - .6) c h);
  }

  .a {
    background-color: oklch(from var(--rv21) calc(l - .6) c h);
    color: var(--rv21);
  }

  :host(:nth-child(2n)) .q {
    background-color: white;
    border: 3px solid var(--rv21);
    color: oklch(from var(--rv21) calc(l - .6) c h);
  }

  :host(:nth-child(2n)) .a {
    background-color: oklch(from var(--rv21) calc(l - .6) c h);
    border: 3px solid oklch(from var(--rv21) calc(l - .6) c h);
    color: var(--rv21);
  }

  ::slotted(p) {
    color: inherit !important;
  }

  .a {
    transform: rotateY(180deg);
  }

  .qa-card.is-flipped {
    transform: rotateY(180deg);
  }
`

export function qa_card(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = _web_component.state;
  
  let cols;

  const init = () => {}
  
  const flip = () => {
    const cl = _root.shadowRoot.querySelector(".qa-card").classList;
    let timeout;
    if (cl.contains("is-flipped")) {
      cl.remove("is-flipped");
      clearTimeout(timeout);
    } else {
      cl.add("is-flipped");
      timeout = setTimeout(() => cl.remove('is-flipped'), 7000);
    }
  }

  const effects = () => {
    _root.shadowRoot.addEventListener("click", flip);
  }

  const cleanup_effects = () => {
    _root.shadowRoot.removeEventListener("click", flip);
  }

  return Object.freeze({
    ..._web_component,
    init,
    effects,
    cleanup_effects
  })
}

define_component({
  name: "wd-qa-card",
  component: qa_card,
  template,
  style
});
