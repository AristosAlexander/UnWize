import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "public");
const uvDir = path.join(publicDir, "uv");

console.log("Setting up Ultraviolet Proxy...");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(uvDir)) {
  fs.mkdirSync(uvDir, { recursive: true });
}

const uvConfigPath = path.join(uvDir, "uv.config.js");
if (!fs.existsSync(uvConfigPath)) {
  const uvConfig = `self.__uv$config = {
  prefix: "/service/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/uv/uv.handler.js",
  client: "/uv/uv.client.js",
  bundle: "/uv/uv.bundle.js",
  config: "/uv/uv.config.js",
  sw: "/uv/uv.sw.js",
};`;
  fs.writeFileSync(uvConfigPath, uvConfig);
}

const swPath = path.join(publicDir, "sw.js");
if (!fs.existsSync(swPath)) {
  const swContent = `importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/uv/uv.sw.js");`;
  fs.writeFileSync(swPath, swContent);
}

console.log("Setup complete!");