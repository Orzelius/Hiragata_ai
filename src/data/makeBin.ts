import fs from 'graceful-fs';
import { PROPS } from '../const';
import { PNG } from 'pngjs';
import { printProgress, shuffle } from '../utils';
import async from 'async';

export default async () => {
  return new Promise((resolve, reject) => {
    console.log("Creating Binaries");
  
    const fileLimit = { limit: false, limitLen: 1000 };
    let count = 0;
    
    const origin = './data/data/katakana/';
    const dest = './data/data/';
    fs.readdir(origin, (err, files) => {
      const maxFiles = fileLimit.limit ? fileLimit.limitLen : files.length;
      const datasetBytesBuffer = new ArrayBuffer(maxFiles * PROPS.Size);
      const labels = new Uint8Array(maxFiles);
      files = shuffle(files);
      console.log(files);
  
      const queue = async.queue(({ file, fileIndex }: { file: string, fileIndex: number }, cb) => {
        const img = new PNG;
        // if (fileIndex % 1000 === 0) console.log(fileIndex) 
        img.on("parsed", (data) => {
          const datasetBytesView = new Uint8Array(datasetBytesBuffer, fileIndex * PROPS.Size, PROPS.Size);
          for (let i = 0; i < datasetBytesView.length; i++) datasetBytesView[i] = data[i * 4];
          labels[fileIndex] = PROPS.classes.findIndex(e => e.hir === file[0] || e.kat === file[0]);
          count++;
          cb();
          if (count === maxFiles) {
            console.log();
            fs.writeFileSync(dest + 'katakanaUint8', new Uint8Array(datasetBytesBuffer));
            fs.writeFileSync(dest + 'katakanaLabelsUint8', labels);
            console.log("Binary written");
            resolve()
          }
        });
        fs.createReadStream(origin + file).pipe(img);
      }, 1000)
  
      for (let fileIndex = 0; fileIndex < maxFiles; fileIndex++) {
        const file = files[fileIndex];
        queue.push({ file, fileIndex }, () => {
          printProgress(`${fileIndex}/${maxFiles}`);
        });
      };
    });
  })
}