const { readdir, writeFile, readFile, appendFile } = require('fs').promises;
const path = require('path');

const srcFolder = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function compileStyles() {
  try {
    await writeFile(bundleFile, '');

    const files = await readdir(srcFolder, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const data = await readFile(path.join(srcFolder, file.name));
        await appendFile(bundleFile, data);
      }
    }

    console.log('Styles successfully compiled.');
  } catch (err) {
    console.error('Error during compilation:', err.message);
  }
}

compileStyles();
