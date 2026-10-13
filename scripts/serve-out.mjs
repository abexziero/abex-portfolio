import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";

const root = resolve("out");
const redirects = new Map((await readFile(resolve(root, "_redirects"), "utf8")).trim().split("\n").map(line => {
  const [from, to, status] = line.trim().split(/\s+/);
  return [from, { to, status: Number(status) }];
}));
const rules = [];
for (const line of (await readFile(resolve(root, "_headers"), "utf8")).split("\n")) {
  if (!line.trim()) continue;
  if (!/^\s/.test(line)) rules.push({ path: line.trim(), headers: {} });
  else {
    const colon = line.indexOf(":");
    rules.at(-1).headers[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
}
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".json": "application/json" };
createServer(async (request, response) => {
  try {
    let path;
    try { path = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
    catch { response.writeHead(400).end(); return; }
    if (!["GET", "HEAD"].includes(request.method)) { response.writeHead(405).end(); return; }
    const redirect = redirects.get(path);
    if (redirect) { response.writeHead(redirect.status, { Location: redirect.to }).end(); return; }
    const file = resolve(root, "." + path);
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    let found;
    for (const candidate of [file, file + ".html", resolve(file, "index.html")]) {
      try { if ((await stat(candidate)).isFile()) { found = candidate; break; } }
      catch (error) { if (!["ENOENT", "ENOTDIR"].includes(error.code)) throw error; }
    }
    const headers = { "Content-Type": types[extname(found ?? "404.html")] ?? "text/plain", "Cache-Control": "no-cache" };
    for (const rule of rules) if (rule.path.endsWith("*") ? path.startsWith(rule.path.slice(0, -1)) : path === rule.path) Object.assign(headers, rule.headers);
    const body = await readFile(found ?? resolve(root, "404.html"));
    response.writeHead(found ? 200 : 404, headers);
    response.end(request.method === "HEAD" ? undefined : body);
  } catch { response.writeHead(500).end(); }
}).listen(Number(process.env.PORT ?? 3006), "127.0.0.1", () => console.log("Static export preview: http://localhost:" + (process.env.PORT ?? 3006)));
