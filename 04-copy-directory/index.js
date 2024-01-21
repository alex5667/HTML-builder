const path = require('path');
const {
  rm,
  mkdir,
  readdir,
  createReadStream,
  createWriteStream,
} = require('fs/promises');

const srcPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

function copyFiles() {
  return readdir(srcPath).then((files) => {
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
  return rm(`${copyPath}`, { recursive: true, force: true })
    .then(() => mkdir(`${copyPath}`, { recursive: true }))
    .then(() => copyFiles());
}

setup()
  .then(() => console.log('Files copied successfully'))
  .catch((err) => console.error(err.message));
