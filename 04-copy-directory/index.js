const path = require('path');
const {
  promises: fsPromises,
  createReadStream,
  createWriteStream,
} = require('fs');

const srcPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

function copyFiles() {
  return fsPromises.readdir(srcPath).then((files) => {
    const copyPromises = files.map((file) => {
      const readStream = createReadStream(path.join(srcPath, file));
      const writeStream = createWriteStream(path.join(copyPath, file));

      return new Promise((resolve, reject) => {
        readStream.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('finish', resolve);

        readStream.pipe(writeStream);
      });
    });
    return Promise.all(copyPromises);
  });
}

function setup() {
  return fsPromises
    .rm(`${copyPath}`, { recursive: true, force: true })
    .then(() => fsPromises.mkdir(`${copyPath}`, { recursive: true }))
    .then(() => copyFiles());
}

setup()
  .then(() => console.log('Files copied successfully'))
  .catch((err) => console.error(err.message));
