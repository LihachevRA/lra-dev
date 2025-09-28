const fs = require('fs');
const path = require('path');
const pug = require('pug');
const rimraf = require('rimraf');

const pagesFolder = path.resolve(__dirname, './templates/pages');
const distFolder = path.resolve(__dirname, './dist');
const assetsFolder = path.resolve(__dirname, './assets');

const createFolderIfNotExists = (path) => {
  if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder);
  }
}

const copyAssets = () => {
  const distAssetsFolder = path.resolve(distFolder, 'assets');
  fs.cpSync(assetsFolder, distAssetsFolder, { recursive: true });
}

const build = () => {
  fs.readdir(pagesFolder, (error, files) => {
    if (error) {
      console.error(error);

      process.exit(1);
    }

    rimraf.rimrafSync(distFolder);
    createFolderIfNotExists(distFolder);
    copyAssets();

    files.forEach(file => {
      if (!file.endsWith('.pug')) {
        return;
      }

      const templatePath = path.resolve(pagesFolder, file);
      const renderedFile = pug.renderFile(templatePath);

      const renderFilePath = path.resolve(distFolder, file.replace('.pug', '.html'));
      fs.writeFileSync(renderFilePath, renderedFile);
    });
  });
};

build();