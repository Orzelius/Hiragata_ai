import * as fs from 'graceful-fs';
import path from 'path';
import { PNG } from 'pngjs';
import { PROPS } from '../const';
import DataGen from './loadData';
import { deleteFiles } from './testData';

const dest = './test-images';

export default (dataGen: DataGen) => {
  console.log("Creating test data");
  const imagesTotest = [0, 1, 22, 450];
  // const imagesTotest = [0, 1, 22, 498, 499, 500, 501, 999, 1000, 9999, 64998, 64999, 80840];
  // await createImages('mnist_images.png', imagesTotest, '_Original');
  deleteFiles(dest);
  createImages(imagesTotest, "", dataGen);
}

export const createImages = (imagesTotest: number[], addToName = "", dataGen: DataGen) => {
  const data = dataGen.getBrainData();

  const imgData = data.images.trainImages;
  const labelData = data.label.trainLabels;

  console.log("Starting creation of test images")
  imagesTotest.forEach(imageI => {
    const testPng = new PNG({
      width: PROPS.W,
      height: PROPS.H,
      bgColor: {
        blue: 0,
        green: 0,
        red: 0
      }
    });
    const data = imgData[imageI];
    for (let pixel = 0; pixel < data.length; pixel++) {
      const pixelByteVal = Math.floor(data[pixel] * 255)
      testPng.data[pixel * 4 + 0] = pixelByteVal
      testPng.data[pixel * 4 + 1] = pixelByteVal
      testPng.data[pixel * 4 + 2] = pixelByteVal
      testPng.data[pixel * 4 + 3] = 255;
    }
    testPng
      .pack()
      .pipe(fs.createWriteStream(`${dest}/id-${imageI}_label-${PROPS.classes[labelData[imageI]].kat + PROPS.classes[labelData[imageI]].hir}${addToName}.png`));
  });
}
