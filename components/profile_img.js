import { html, state, web_component, define_component } from "https://busy-dog-44.deno.dev/melhosseiny/sourdough/main/sourdough.js";

const template = (data) => html`
  <figure>
    <slot name="img"></slot>
    <figcaption>${data.caption}</figcaption>
  </figure>
`
const style = `
  :host {
    display: block;
  }
  
  figure {
    background: linear-gradient(90deg, var(--lapis-lazuli), oklch(from var(--lapis-lazuli) calc(l + .3) c h));
    position: relative;
    z-index: 0;
  }

  ::slotted(img) {
    position: relative;
    object-position: bottom;
    object-fit: contain;
    z-index: 2;
    filter: grayscale(1);
  }

  figcaption {
    white-space: pre;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: bold;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background-color: white;
    z-index: 1;
    font-size: calc(1.2 * var(--font-size-body));
  }
  
  figcaption p {
    margin-bottom: 0;
    font-size: inherit;
  }

  figcaption p::first-line {
    font-variant-caps: all-small-caps;
    letter-spacing: 1px;
    font-size: var(--font-size-body);
  }
`

export function profile_img(spec) {
  let { _root } = spec;
  const _web_component = web_component(spec);
  const _state = _web_component.state;

  const init = () => {}

  return Object.freeze({
    ..._web_component,
    init
  })
}

define_component({
  name: "wd-profile-img",
  component: profile_img,
  template,
  style,
  props: ["caption"]
});



