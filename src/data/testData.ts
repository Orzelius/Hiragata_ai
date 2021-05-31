import * as fs from 'graceful-fs';
import path from 'path';
import { PNG } from 'pngjs';
import { PROPS } from '../const';

const originImg = './data/data/bin_48/katakanaTestUint8';
const originLabel = './data/data/bin_48/katakanaTestLabelsUint8';
// const originImg = './data/data/hiraganaUint8';
// const originLabel = './data/data/hiraganaLabelsUint8';
const dest = './test-images';

export default async () => {
  console.log("Creating test data");
  
  deleteFiles(dest);
  const imagesTotest = [0, 1, 40, 50, 240, 300, 458];
  // const imagesTotest = [0, 1, 22, 498, 499, 500, 501, 999, 1000, 9999, 64998, 64999];
  // await createImages('mnist_images.png', imagesTotest, '_Original');
  await createImages(imagesTotest);
}

export const createImages = async (imagesTotest: number[], addToName = "") => {
  console.log('Creating images');

  const imgData = await dataRequest(originImg);
  const labelData = await dataRequest(originLabel);

  console.log(labelData, imgData.length)

  imagesTotest.forEach(id => {
    const testPng = new PNG({
      width: PROPS.W,
      height: PROPS.H,
      bgColor: {
        blue: 0,
        green: 0,
        red: 0
      }
    });
    // console.log(mnistImg);
    let data = imgData.slice(id * PROPS.Size, id * PROPS.Size + PROPS.Size);
    for (let byte = 0; byte < data.length; byte++) {
      testPng.data[byte * 4 + 0] = data[byte]
      testPng.data[byte * 4 + 1] = data[byte]
      testPng.data[byte * 4 + 2] = data[byte]
      testPng.data[byte * 4 + 3] = 255;
    }
    testPng
      .pack()
      .pipe(fs.createWriteStream(`./${dest}/id-${id}_label-${PROPS.classes[labelData[id]].kat + PROPS.classes[labelData[id]].hir}${addToName}.png`));
  });
}

const readImage = (sourceImage: string) => {
  return new Promise<PNG>((resolve, reject) => {
    const mnistImg = new PNG();
    mnistImg.on("parsed", () => {
      resolve(mnistImg);
    })
    const src = fs.createReadStream('./data/' + sourceImage);
    src.pipe(mnistImg);
  })
}

const dataRequest = (path: string) => new Promise<Uint8Array>((resolve, reject) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      reject(err);
    };
    resolve(new Uint8Array(data));
  })
});

export const deleteFiles = (directory: string) => {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
} 