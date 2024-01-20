const fs = require('fs').promises;
const path = require('path');
const { stdout } = require('process');

async function readSecretFolder() {
  try {
    const secretPath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(secretPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(secretPath, file.name);
        const stats = await fs.stat(filePath);
        stdout.write(
          `${file.name.split('.')[0]} - ${path
            .extname(file.name)
            .slice(1)} - ${(stats.size / 1024).toFixed(3)}kB\n`,
        );
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

readSecretFolder();
