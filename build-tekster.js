/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function readFile(dir, file) {
    try {
        return fs
            .readFileSync(path.join(dir, file), 'utf8')
            .toString()
            .trim()
            .replace(/\r?\n|\r/g, '\\n');
    } catch (e) {
        console.error('Error:', e.stack);
    }
    return '';
}

function getkeyValue(file, dir) {
    const i = file.lastIndexOf('_');
    return `\n'${file.substring(0, i)}': '${readFile(dir, file)}'`;
}

function read(dir) {
    function fn(files, file) {
        return fs.statSync(path.join(dir, file)).isDirectory()
            ? files.concat(read(path.join(dir, file)))
            : files.concat(getkeyValue(file, dir));
    }

    return fs.readdirSync(dir).reduce(fn, []);
}

function createJson(katalog) {
    return `/* eslint-disable max-len */\nexport default { 'nb': { ${read(
        katalog
    )}\n } };`;
}

try {
    fs.writeFileSync('./src/tekster.js', createJson('./tekster/nb'));
} catch (e) {
    console.error('Kunne ikke skrive fil ', e);
}

console.log(read('./tekster/nb'));
