const { existsSync, readdirSync, readFileSync, statSync } = require("node:fs");
const { dirname, resolve } = require("node:path");
const { pathToFileURL } = require("node:url");

const voidElements = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
]);

function collectFiles(directory, extension) {
    return readdirSync(directory).flatMap((entry) => {
        const fullPath = resolve(directory, entry);
        const stats = statSync(fullPath);

        if (stats.isDirectory()) {
            return collectFiles(fullPath, extension);
        }

        return fullPath.endsWith(extension) ? [fullPath] : [];
    });
}

function validateHtmlNesting(html) {
    const tagPattern = /<\/?([a-zA-Z][\w:-]*)(?:\s[^<>]*)?>/g;
    const stack = [];
    let match;

    while ((match = tagPattern.exec(html)) !== null) {
        const fullTag = match[0];
        const tagName = match[1].toLowerCase();

        if (fullTag.startsWith("<!") || fullTag.startsWith("<?")) {
            continue;
        }

        if (fullTag.startsWith("</")) {
            if (voidElements.has(tagName)) {
                throw new Error(`Elemento vazio não deve ter fechamento: ${fullTag}`);
            }

            const last = stack.pop();
            if (last !== tagName) {
                throw new Error(`Tag de fechamento inesperada: ${fullTag}. Esperado: </${last}>`);
            }

            continue;
        }

        if (!voidElements.has(tagName) && !fullTag.endsWith("/>")) {
            stack.push(tagName);
        }
    }

    if (stack.length > 0) {
        throw new Error(`Tags HTML sem fechamento: ${stack.join(", ")}`);
    }
}

function addHtmlReferences(html, references) {
    for (const [, reference] of html.matchAll(/(?:src|href)="(\.\.?\/[^"#?]+)"/g)) {
        references.push({ source: "index.html", reference });
    }
}

function addCssReferences(references) {
    for (const cssFile of collectFiles("css", ".css")) {
        const css = readFileSync(cssFile, "utf8");

        for (const [, reference] of css.matchAll(/(?:@import\s+url|url)\("?([^\")]+)"?\)/g)) {
            if (!reference.startsWith("http") && !reference.startsWith("data:")) {
                references.push({
                    source: cssFile,
                    reference: resolve(dirname(cssFile), reference)
                });
            }
        }
    }
}

function addProductImageReferences(references) {
    const products = readFileSync("js/products.js", "utf8");

    for (const [, reference] of products.matchAll(/image:\s*"([^"]+)"/g)) {
        references.push({ source: "js/products.js", reference });
    }
}

const html = readFileSync("index.html", "utf8");
const localReferences = [];

validateHtmlNesting(html);
addHtmlReferences(html, localReferences);
addCssReferences(localReferences);
addProductImageReferences(localReferences);

const missingReferences = localReferences.filter(({ reference }) => {
    const localPath = reference.startsWith("./") ? reference.slice(2) : reference;
    return !existsSync(localPath);
});

if (missingReferences.length > 0) {
    const details = missingReferences
        .map(({ source, reference }) => `${source} -> ${reference}`)
        .join(", ");

    throw new Error(`Referências locais inexistentes: ${details}`);
}

console.log(`Validação concluída com sucesso em ${pathToFileURL(process.cwd())}`);
