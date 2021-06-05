import * as fs from 'fs';
import { PROPS } from '../const';
import { PNG } from 'pngjs';
import { printProgress, shuffle } from '../utils';
import async from 'async';
import _ from 'lodash';



export default async () => {
  return new Promise((resolve, reject) => {
    console.log("Creating Binaries");
  
    const useFileLimit = false;
    const fileLimit = { limitLen: 50000, takeLast: true };
    const shuffle = true; // This will randonly shuffle the data
    let count = 0;
    
    const origin = './data/data/katakanaTestData_48/';
    const dest = './data/data/bin_48/';
    fs.readdir(origin, (err, files) => {
      files = _.shuffle(files);
      const maxFiles = useFileLimit ? fileLimit.limitLen : files.length;
      const datasetBytesBuffer = new ArrayBuffer(maxFiles * PROPS.Size);
      const labels = new Uint8Array(maxFiles);
      // files = shuffle(files);
      if (useFileLimit && fileLimit.takeLast) files = files.slice(files.length - fileLimit.limitLen);
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
            console.log("\nAttempting to write binary");
            const views = datasetBytesBuffer.byteLength / PROPS.Size;
            for (let i = 0; i < views; i++) {
              const datasetBytesView = new Uint8Array(datasetBytesBuffer, i * PROPS.Size, PROPS.Size);
              fs.appendFileSync(dest + 'katakanaTestUint8', Buffer.from(datasetBytesView));
            }
            fs.writeFileSync(dest + 'katakanaTestLabelsUint8', labels);
            console.log("Binary written");
            resolve(null)
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