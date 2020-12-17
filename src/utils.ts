import fs from 'fs';
import path from 'path'
import util from 'util'
import seedrandom from 'seedrandom';

export const deleteAllFiles = (directory: string) => {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
} 

export function copyFiles(srcDir: string, destDir: string, files: string[]) {
  const copyFilePromise = util.promisify(fs.copyFile);
  return Promise.all(files.map(f => {
     return copyFilePromise(path.join(srcDir, f), path.join(destDir, f));
  }));
}

export function printProgress(progress: string) {
  try {
    process.stdout.cursorTo(0);
    process.stdout.write(progress);
  }
  catch (err) { }
}

export function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}