import { serve } from "https://deno.land/std@0.100.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.100.0/http/file_server.ts";

const server = serve({ port: 8080 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

for await (const request of server) {
  console.log(request.url);

  if (request.url.endsWith('.js') || request.url.endsWith('.css') || request.url.endsWith('.woff2')) {
    request.respond(await serveFile(request, `${Deno.cwd()}/${request.url}`));
  } else {
    request.respond(await serveFile(request, `${Deno.cwd()}/index.html`));
  }
}
