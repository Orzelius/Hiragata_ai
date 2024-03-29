import fs from 'graceful-fs';
import * as Jimp from 'jimp';
import * as wanakana from 'wanakana';
import async from 'async';
import { PROPS } from '../const';


export default async () => {
  const dest = './data/data/katakana_48/';
  const origin = './data/data/katakana/';
  const queue = async.queue((file: any, cb) => {
    if (file.indexOf('dakutrue') === -1) {
      Jimp.read(origin + file).then((img) => {
        // img.crop(11, 13, 50, 50);
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
        if (index % 1000 === 0) console.log(index);
      });
    };
  });
}