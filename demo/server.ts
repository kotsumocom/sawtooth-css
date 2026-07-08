/**
 * Sawtooth CSS — デモサーバー
 * dist/sawtooth.css と demo/index.html を配信するシンプルな静的サーバー
 */

import * as path from "jsr:@std/path@1";

const ROOT_DIR = path.dirname(path.dirname(path.fromFileUrl(import.meta.url)));
const DEMO_DIR = path.join(ROOT_DIR, "demo");
const DIST_DIR = path.join(ROOT_DIR, "dist");

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let filePath: string;

  if (url.pathname === "/" || url.pathname === "/index.html") {
    filePath = path.join(DEMO_DIR, "index.html");
  } else if (url.pathname.startsWith("/dist/")) {
    filePath = path.join(ROOT_DIR, url.pathname);
  } else if (url.pathname === "/sawtooth.css") {
    filePath = path.join(DIST_DIR, "sawtooth.css");
  } else {
    filePath = path.join(DEMO_DIR, url.pathname);
  }

  try {
    const content = await Deno.readFile(filePath);
    const ext = path.extname(filePath);
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

    return new Response(content, {
      headers: { "Content-Type": contentType },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}

const PORT = 3000;
console.log(`🎨 Sawtooth CSS デモサーバー`);
console.log(`   http://localhost:${PORT}`);
console.log(`   Ctrl+C で停止\n`);

Deno.serve({ port: PORT }, handler);
