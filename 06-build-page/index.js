const {
  rm,
  mkdir,
  readFile,
  appendFile,
  readdir,
  writeFile,
  copyFile,
} = require('fs/promises');
const path = require('path');
const projectFolder = path.join(__dirname, 'project-dist');

// Create css
const styleFolder = path.join(__dirname, 'styles');
const styleFile = path.join(projectFolder, 'style.css');

async function createStyles() {
  await writeFile(styleFile, '');

  const files = await readdir(styleFolder, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const data = await readFile(path.join(styleFolder, file.name));
      await appendFile(styleFile, data);
    }
  }
}

// Copy assets
const srcPath = path.join(__dirname, 'assets');
const copyPath = path.join(projectFolder, 'assets');

async function copyFiles(srcPath, copyPath) {
  const files = await readdir(srcPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      await rm(`${copyPath}/${file.name}`, { recursive: true, force: true });
      await mkdir(`${copyPath}/${file.name}`, { recursive: true });
      await copyFiles(`${srcPath}/${file.name}`, `${copyPath}/${file.name}`);
    } else {
      await copyFile(`${srcPath}/${file.name}`, `${copyPath}/${file.name}`);
    }
  }
}

// Create html
const templateHtml = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const projectHtmlPath = path.join(projectFolder, 'index.html');

async function createHtml() {
  let projectHtml = await readFile(templateHtml, 'utf-8');
  const templateComponents = projectHtml.match(/{{(.*)}}/gi) || [];

  for (const templateComponent of templateComponents) {
    const componentName = templateComponent.slice(2, -2);
    const componentFile = await readFile(
      path.join(componentsFolder, `${componentName}.html`),
      'utf-8',
    );
    projectHtml = projectHtml.replace(templateComponent, componentFile);
  }

  await writeFile(projectHtmlPath, projectHtml);
}

async function start() {
  try {
    await rm(projectFolder, { recursive: true, force: true });
    await mkdir(projectFolder, { recursive: true });
    await createStyles();
    await copyFiles(srcPath, copyPath);
    await createHtml();
    console.log('Project created successfully.');
  } catch (err) {
    console.error(err.message);
  }
}

start();
