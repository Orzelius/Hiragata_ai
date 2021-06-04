import * as fs from 'graceful-fs';
import path from 'path';
import { PNG } from 'pngjs';
import { PROPS } from '../const';

const dest = './test-images';

export default async () => {
  console.log("Creating test data");
  
  deleteFiles(dest);
  // const imagesTotest = [0, 1, 40, 50, 240, 300, 458];
  // await createImages('mnist_images.png', imagesTotest, '_Original');
  await createImages(PROPS.locations.test.data, PROPS.locations.test.labels, "_test_data");
  await createImages(PROPS.locations.training.data, PROPS.locations.training.labels, "_train_data");
}

export const createImages = async (originImg: string, originLabel: string, appendToName = "") => {
  const imgData = await dataRequest(originImg);
  const labelData = await dataRequest(originLabel);
  
  const imagesTotest = [0, 1, labelData.length - 1];
  console.log(`First 20 labels of ${originLabel}`, labelData.slice(0, 20), `Byte size of ${originLabel}`, imgData.length);

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
      .pipe(fs.createWriteStream(`./${dest}/id-${id}_label-${PROPS.classes[labelData[id]].kat + PROPS.classes[labelData[id]].hir}${appendToName}.png`));
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