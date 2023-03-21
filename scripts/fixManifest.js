const fs = require('fs');

const assetManifest = JSON.parse(fs.readFileSync('./build/vite-manifest.json', 'utf-8'));
const { file, css } = assetManifest['index.html'];

const compatibleManifest = Object.entries(assetManifest).reduce(
    (acc, [fileName, fileMetadata]) => {
        return {
            files: { ...acc.files, [fileName]: fileMetadata.file },
            entrypoints: fileMetadata.isEntry
                ? [...acc.entrypoints, fileMetadata.file, ...fileMetadata.css]
                : acc.entrypoints,
        };
    },
    { files: {}, entrypoints: [] }
);

// NAVSPA requires all entries in "entrypoints" to be in "fileList"

fs.writeFileSync('./build/asset-manifest.json', JSON.stringify(compatibleManifest, null, 4));
