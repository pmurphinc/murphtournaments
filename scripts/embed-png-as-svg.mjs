#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const [,, input = "public/discord-app-icon.png", output = "public/logo.svg", sizeArg] = process.argv;
const size = Number(sizeArg || 128);
const png = readFileSync(resolve(input));
const b64 = png.toString("base64");
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet">
  <image href="data:image/png;base64,${b64}" width="${size}" height="${size}" />
</svg>`;
writeFileSync(resolve(output), svg);
console.log(`Wrote ${output} from ${input} at ${size}×${size}`);
