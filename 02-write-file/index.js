const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const filePath = path.join(__dirname, 'text.txt');

fs.writeFile(filePath, '', (err) => {
  if (err) {
    console.error('Error clearing the file:', err.message);
    process.exit(1);
  }

  stdout.write('Hi, please enter text!\n');

  stdin.on('data', (data) => {
    handleInput(data);
  });
});

function handleInput(data) {
  const input = data.toString().trim().toLowerCase();

  if (input === 'exit') {
    console.log('Bye!');
    process.exit();
  }

  fs.appendFile(filePath, data, (err) => {
    if (err) {
      console.error('Error writing to the file:', err.message);
      process.exit(1);
    }
  });
}

process.on('SIGINT', () => {
  console.log('Bye!');
  process.exit();
});
