import fs from 'graceful-fs';
import * as Jimp from 'jimp';
import * as wanakana from 'wanakana';
import async from 'async';
import { PROPS } from '../const';


export default async () => {
  const modifyImages = false;
  const dest = './data/data/katakanaTestData_48/';
  const origin = './data/data/katakanaTestData/';
  const queue = async.queue((file: any, cb) => {
    if (file.indexOf('dakutrue') === -1) {
      Jimp.read(origin + file).then((img) => {
        if (modifyImages) {
          img.background(0x00000000)
          img.rotate(Math.random() * 15 * (Math.random() > 0.5 ? -1 : 1));
          const cropFactorX = Math.floor(Math.random() * 8);
          const cropFactorY = Math.floor(Math.random() * 8);
          const [ cropX, cropW ] = Math.random() > 0.5 ? [cropFactorX, 50 - cropFactorX] : [0, 50 - cropFactorX];
          const [ cropY, cropH ] = Math.random() > 0.5 ? [cropFactorY, 50 - cropFactorY] : [0, 50 - cropFactorY];
          img.crop(cropX, cropY, cropW, cropH);
        }
        // img.scale(Math.random() * 0.2);
        img.resize(PROPS.W, PROPS.H);
        // img.invert();
        // let fileName = wanakana.toKatakana(file.slice(0, file.indexOf('_') + 1)) + `_${20000 + index}.png`;
        let fileName = file;
        // console.log(fileName);
        img.write(dest + fileName, cb);
      })
    }
  }, 1000)
  fs.readdir(origin, (err, files) => {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      queue.push(file, () => {
        if (index % 1000 === 0) console.log(index + "/" + files.length);
      });
    };
  });
}