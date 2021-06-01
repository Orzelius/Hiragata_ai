const { performance } = require('perf_hooks');
// const tf = require('@tensorflow/tfjs-node-gpu');
import * as tf from '@tensorflow/tfjs-node-gpu';
const mobilenet = require('@tensorflow-models/mobilenet');

import { PROPS } from './const';
import DataGen from './data/loadData';
import generateImages from './data/generateImages';
// import { train } from '@tensorflow/tfjs-node-gpu';

const createModel = () => {
  // const model = tf.sequential();
  // Custom 1
  // model.add(tf.layers.conv2d({
  //   inputShape: [50, 50, 1],
  //   kernelSize: 16,
  //   filters: 12,
  //   strides: 1,
  //   activation: 'relu',
  //   kernelInitializer: 'VarianceScaling'
  // }));

  // model.add(tf.layers.maxPooling2d({
  //   poolSize: [2, 2],
  //   strides: [2, 2]
  // }));

  // model.add(tf.layers.conv2d({
  //   kernelSize: 10,
  //   filters: 20,
  //   strides: 1,
  //   activation: 'relu',
  //   kernelInitializer: 'VarianceScaling'
  // }));

  // model.add(tf.layers.maxPooling2d({
  //   poolSize: [2, 2],
  //   strides: [2, 2]
  // }));

  // model.add(tf.layers.flatten());

  // model.add(tf.layers.dense({
  //   units: PROPS.NumClasses,
  //   kernelInitializer: 'VarianceScaling',
  //   activation: 'softmax'
  // }));


  // https://github.com/Nippon2019/Handwritten-Japanese-Recognition/blob/master/Katakana/katakana_CNN.py
  const model = tf.sequential()
  model.add(tf.layers.conv2d({
    inputShape: [48, 48, 1],
    kernelSize: [3, 3], filters: 32, activation: 'relu',
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], }));
  model.add(tf.layers.conv2d({ kernelSize: [3, 3], filters: 64, activation: 'relu', }));
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], }));
  model.add(tf.layers.conv2d({ kernelSize: [3, 3], filters: 64, activation: 'relu', }));
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dropout({ rate: 0.5, }));
  model.add(tf.layers.dense({ activation: 'relu', units: 512, }));
  model.add(tf.layers.dense({ activation: 'softmax', units: PROPS.NumClasses }));

  model.summary()
  console.log(JSON.stringify(model.outputs[0].shape));
  console.log('Layers created');

  model.compile({
    optimizer: 'adam',
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy'],
  });
  console.log('Model compiled');

  return model;
}

const model = createModel();

let data = new DataGen(false);


const train = async () => {
  // Batch size is another important hyperparameter. It defines the number of
  // examples we group together, or batch, between updates to the model's
  // weights during training. A value that is too low will update weights using
  // too few examples and will not generalize well. Larger batch sizes require
  // more memory resources and aren't guaranteed to perform better.
  const batchSize = 200;

  // Leave out the last 15% of the training data for validation, to monitor
  // overfitting during training.
  const validationSplit = 0.15;

  // We'll keep a buffer of loss and accuracy values over time.
  let trainBatchCount = 0;
  let trainEpochs = 15;

  let trainData = data.getTrainData();
  let testData = data.getTestData();

  console.log("The data tensor: ", trainData.xs.shape)
  console.log("The label tensor: ", trainData.labels.shape)

  // const trainData = data.getTrainDataset();
  // const testData = data.getTestData();

  // const trainDataset = tf.data.zip({xs: trainData.xDataset, ys: trainData.yDataset}).batch(batchSize);

  // During the long-running fit() call for model training, we include
  // callbacks, so that we can plot the loss and accuracy values in the page
  // as the training progresses.
  console.log("Model training started");
  let valAcc = 0;
  await model.fit(trainData.xs, trainData.labels, {
    epochs: trainEpochs,
    validationSplit,
    // batchSize,
    // validationSplit,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        // trainBatchCount++;
        // console.log(
        //   `Training... ` +
        //   `${(trainBatchCount / totalNumBatches * 100).toFixed(1)}%`);
        // console.log(`${trainBatchCount}, loss: ${logs.loss}`);
        await tf.nextFrame();
      },
      onEpochEnd: async (epoch, logs) => {
        // valAcc = logs.val_acc;
        // console.log(
        //   `Epoch Ended` +
        //   `${(trainBatchCount / totalNumBatches * 100).toFixed(1)}%`);
        // console.log(`${trainBatchCount}, loss: ${logs.loss}`);
        await tf.nextFrame();
      }
    }
  });
  console.log("Model training finished");

  const testResult = model.evaluate(testData.xs, testData.labels);

  console.log(`Test result: ${testResult}`);
}

export const testModel = async (amount: number, path: string = 'file://./model/model.json') => {
  await data.load();
  const testData = data.getTestData();
  const model = await tf.loadLayersModel(path);
  const testResult: any = model.predict(testData.xs.slice(0, amount));
  const predictions = Array.from(testResult.argMax(1).dataSync());
  const labels = Array.from(testData.labels.slice(0, amount).argMax(1).dataSync());
  console.log(`Test result: ${predictions}`);
  console.log(`Labels: ${labels}`);
  let correct = 0;
  labels.forEach((l, i) => l === predictions[i] && correct++)
  console.log(`\n acc: ${correct / labels.length * 100}%`);
}

const makeModel = async () => {
  console.log("Loading data...");
  await data.load()
    .then(async () => {
      console.log("Data loaded")
      await train()
      await model.save('file://./model/')
    })
}


export default makeModel;