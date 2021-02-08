import * as tf from '@tensorflow/tfjs-node-gpu';

import * as fs from 'graceful-fs';
// import { image, TensorContainer } from '@tensorflow/tfjs-node-gpu';
import { PROPS } from '../const';
import { shuffle } from '../utils';

const originImg = './data/data/katakanaUint8';
const originLabel = './data/data/katakanaLabelsUint8';
const originTestImg = './data/data/katakanaTestUint8';
const originTestLabel = './data/data/katakanaTestLabelsUint8';

export default class MnistData {
  trainImages: Float32Array;
  testImages: Float32Array;
  trainLabels: Uint8Array;
  testLabels: Uint8Array;

  constructor() { }

  async load() {
    const dataRequest = (path: string) => new Promise<Float32Array>((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err);
        };

        const images = new Uint8Array(data);
        const imageData = new Float32Array(images.length);
        for (let i = 0; i < images.length; i = i + 4) {
          imageData[i] = images[i] / 255;
        }
        console.log(images.length);
        console.log(imageData.length);
        resolve(imageData);
      })
    });

    const labelsRequest = (path: string) => new Promise<Uint8Array>((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err);
        };
        resolve(new Uint8Array(data));
      });
    });

    this.trainLabels = await labelsRequest(originLabel)
    this.testLabels = await labelsRequest(originTestLabel)
    this.trainImages = await dataRequest(originImg);
    this.testImages = await dataRequest(originTestImg);

    console.log("Done editing and loading images");
  }

  getTrainData() {
    const xs = tf.tensor4d(
      this.trainImages,
      [this.trainImages.length / PROPS.Size, PROPS.H, PROPS.W, 1]);
    const labels = tf.oneHot(this.trainLabels, PROPS.NumClasses);
    return { xs, labels };
  }

  getTrainDataset() {
    const xDataset = tf.data.array(this.trainImages as any);
    const yDataset = tf.data.array(this.trainLabels as any);
    return { xDataset, yDataset };
  }

  getTestDataset() {
    const xDataset = tf.data.array(this.testImages as any);
    const yDataset = tf.data.array(this.testLabels as any);
    return { xDataset, yDataset };
  }

  getTestData(numExamples = -1) {
    let xs = tf.tensor4d(
      this.testImages,
      [this.testImages.length / PROPS.Size, PROPS.H, PROPS.W, 1]);
    let labels = tf.oneHot(this.testLabels, PROPS.NumClasses);

    if (numExamples != -1) {
      xs = xs.slice([0, 0, 0, 0], [numExamples, PROPS.H, PROPS.W, 1]);
      labels = labels.slice([0, 0], [numExamples, PROPS.NumClasses]);
    }
    return { xs, labels };
  }

  // static nextBatch(batchSize: number, data: tf.data.Dataset<TensorContainer>, index: number) {
  //   const batchImagesArray = new Float32Array(batchSize * PROPS.Size);
  //   const batchLabelsArray = new Uint8Array(batchSize * PROPS.NumClasses);
  //   for (let i = 0; i < batchSize; i += 1) {
  //     const idx = index();
  //     const image = data[0].slice(idx * IMAGE_SIZE, idx * IMAGE_SIZE + IMAGE_SIZE);
  //     batchImagesArray.set(image, i * IMAGE_SIZE);
  //     const label = data[1].slice(idx * NUM_CLASSES, idx * NUM_CLASSES + NUM_CLASSES);
  //     batchLabelsArray.set(label, i * NUM_CLASSES);
  //   }
  //   const xs = tf.tensor2d(batchImagesArray, [batchSize, IMAGE_SIZE]);
  //   const labels = tf.tensor2d(batchLabelsArray, [batchSize, NUM_CLASSES]);
  //   return { xs, labels };
  // }
}