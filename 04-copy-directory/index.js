const path = require('path');
const { rm, mkdir, readdir, copyFile } = require('fs/promises');

const srcPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

function copyFiles() {
  return readdir(srcPath).then((files) => {
    const copyPromises = files.map((file) => {
      return copyFile(`${srcPath}/${file}`, `${copyPath}/${file}`).catch(
        (err) => console.log(err.message),
      );
    });

    return Promise.all(copyPromises);
  });
}

function setup() {
  return rm(`${copyPath}`, { recursive: true, force: true })
    .then(() => mkdir(`${copyPath}`, { recursive: true }))
    .then(() => copyFiles());
}

setup()
  .then(() => console.log('Files copied successfully'))
  .catch((err) => console.error(err.message));
