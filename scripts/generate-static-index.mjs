import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const assetsDir = join(root, "dist", "client", "assets");
const files = readdirSync(assetsDir);

const jsFiles = files.filter((f) => /^index-.*\.js$/.test(f));
const cssFile = files.find((f) => /^styles-.*\.css$/.test(f));

if (jsFiles.length === 0 || !cssFile) {
  throw new Error("Could not find built client assets to generate index.html");
}

let entryFile = jsFiles[0];
for (const file of jsFiles) {
  const content = readFileSync(join(assetsDir, file), "utf8");
  if (/from\s+["']\.\/index-.*\.js["']/.test(content)) {
    entryFile = file;
    break;
  }
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/assets/${cssFile}" />
    <title>Lisanegebriel Abay</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${entryFile}"></script>
  </body>
</html>
`;

writeFileSync(join(root, "dist", "client", "index.html"), html);
