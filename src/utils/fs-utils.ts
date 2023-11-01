import fs from 'fs';
import path from 'path';

function findRootDirectory(startingDir: string) {
  let currentDir = startingDir;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    const aleoConfigPath = path.join(currentDir, 'aleo-config.js');

    if (fs.existsSync(packageJsonPath) && fs.existsSync(aleoConfigPath)) {
      return currentDir;
    }

    const parentDir = path.resolve(currentDir, '..');

    if (parentDir === currentDir) {
      return null; // Reached the root directory without finding both files
    }

    currentDir = parentDir;
  }
}

function getProjectRoot() {
  const startingDirectory = process.cwd();
  const npmRootDir = findRootDirectory(startingDirectory);

  if (npmRootDir) {
    console.log(`Found package.json in ${npmRootDir}`);
    return npmRootDir;
  } else {
    console.error('Aleo project initialization not found');
    process.exit(1);
  }
}

async function writeToFile(filename: string, data: string) {
  try {
    const fileStream = fs.createWriteStream(filename, 'utf-8');
    fileStream.write(data);
    fileStream.close();
    return new Promise((resolve, reject) => {
      console.log('Generated file:', filename);
      fileStream.on('error', reject);
      fileStream.on('close', resolve);
    });
  } catch (error) {
    console.log(error);
  }
}

export { getProjectRoot, writeToFile };