const { performance } = require('perf_hooks');
// const tf = require('@tensorflow/tfjs-node-gpu');
import * as tf from '@tensorflow/tfjs-node-gpu';

import { PROPS } from './const';
import MnistData from './data/loadData';
import generateImages from './data/generateImages';
// Optional Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.

// Train a simple model:
const createModel = () => {
  const model = tf.sequential();
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


  // TFJS examples mnist-node
  model.add(tf.layers.conv2d({
    inputShape: [50, 50, 1],
    filters: 32,
    kernelSize: 10,
    activation: 'relu',
  }));
  model.add(tf.layers.conv2d({
    filters: 32,
    kernelSize: 10,
    activation: 'relu',
  }));
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu',
  }));
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu',
  }));
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dropout({rate: 0.25}));
  model.add(tf.layers.dense({units: 512, activation: 'relu'}));
  model.add(tf.layers.dropout({rate: 0.5}));
  model.add(tf.layers.dense({units: PROPS.NumClasses, activation: 'softmax'}));

  model.summary()
  
  console.log('Layers created');

  model.compile({
    optimizer: 'rmsprop',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  console.log('Model compiled');

  return model;
}

const model = createModel();

let data = new MnistData();


const train = async () => {
  // Batch size is another important hyperparameter. It defines the number of
  // examples we group together, or batch, between updates to the model's
  // weights during training. A value that is too low will update weights using
  // too few examples and will not generalize well. Larger batch sizes require
  // more memory resources and aren't guaranteed to perform better.
  const batchSize = 100;

  // Leave out the last 15% of the training data for validation, to monitor
  // overfitting during training.
  const validationSplit = 0.15;

  // We'll keep a buffer of loss and accuracy values over time.
  let trainBatchCount = 0;
  let trainEpochs = 10;

  const trainData = data.getTrainData();
  const testData = data.getTestData();

  // const trainData = data.getTrainDataset();
  // const testData = data.getTestData();

  // const trainDataset = tf.data.zip({xs: trainData.xDataset, ys: trainData.yDataset}).batch(batchSize);

  // During the long-running fit() call for model training, we include
  // callbacks, so that we can plot the loss and accuracy values in the page
  // as the training progresses.
  let valAcc = 0;
  await model.fit(trainData.xs, trainData.labels, {
    epochs: trainEpochs,
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

  const testResult = model.evaluate(testData.xs, testData.labels);

  console.log(`Test result: ${testResult}`); 
}
const makeModel = async () => {
  // createModel();

  console.log("Loading data...");
  await data.load()
    .then(async () => {
      console.log("Data loaded")
      await train()
      await model.save('file://./model/')
    })
}


export default makeModel;