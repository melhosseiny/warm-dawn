import { serve } from "https://deno.land/std@0.115.1/http/server.ts";
import { content_type } from "https://raw.githubusercontent.com/melhosseiny/git-fetch/main/media_types.js";

const PATHNAME_PREFIX = "/melhosseiny/warm-dawn/main";

const static_path = [
  "/components",
  "/css",
  "/fonts",
  "/icons",
  "/utils",
  "/favicon.ico",
  "/robots.txt",
  "/manifest.webmanifest",
  "/.well-known"
];

serve(async (request) => {
  let { pathname } = new URL(request.url);

  pathname = pathname === "/" ? "/index_inline.html" : pathname;
  console.log(request.url, pathname, PATHNAME_PREFIX, import.meta.url);

  let response_body = static_path.some(prefix => pathname.startsWith(prefix))
    // ? await Deno.readFile(`.${pathname}`)
    ? (await fetch(new URL(PATHNAME_PREFIX + pathname, "https://raw.githubusercontent.com/"), {
      headers: {
        "Authorization": `token ${Deno.env.get("GITHUB_ACCESS_TOKEN")}`,
      },
    })).body
    : await Deno.readFile('./index_inline.html');

  const headers = new Headers({
    "content-type": content_type(pathname),
    "access-control-allow-origin": "*",
    "cache-control": "no-cache"
  });

  return new Response(response_body, {
    status: 200,
    headers
  });
});
