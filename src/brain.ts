import brain, { INeuralNetworkState, Input, TrainStream } from 'brain.js';
import { PROPS } from './const';
import DataGen from './data/loadData';
import * as fs from 'fs';
import _, { chunk, shuffle } from 'lodash';

const iterations = 30000;
const logPeriod = 100;

export default (dataGen: DataGen) => {
  console.log("Data initalized")
  const data = dataGen.getBrainData();
  console.log(data.label.testLabels)
  let brainData = data.images.trainImages.map((image, index) => {
    const labelVal = data.label.trainLabels[index];
    const outputArr = (new Array<0 | 1>(PROPS.NumClasses).fill(0));
    outputArr[labelVal] = 1;
    return {
    input: image,
    output: outputArr,
  }})
  brainData = _.shuffle(brainData);
  const net = new brain.NeuralNetworkGPU();
  net.train(brainData, {
    iterations,
    logPeriod,
    log: logAndEstimate,
    learningRate: 0.1,
    errorThresh: 0.0001
  });
  fs.writeFileSync('./ai.json', JSON.stringify(net.toJSON()));
}

let currentIteration = 0;
const times: number[] = [];
let startTime = Date.now();
let totalTime = 0;
let prevErr = 0;

const logAndEstimate = (data: INeuralNetworkState) => {
  currentIteration += logPeriod;
  console.log(`${data.iterations}/${iterations}, err: ${data.error}`);
  const timeTook = times.length === 0 ? Date.now() - startTime : Date.now() - startTime - totalTime;
  totalTime+= timeTook;
  times.push(timeTook);
  const donePercent = 1 - (currentIteration / iterations);
  const average = _.mean(times) / 1000 / 60;
  const estimate = Math.floor((iterations / logPeriod) * donePercent * average)
  console.log(`Estimated remaining time: ${estimate}min`)
  console.log(`Err change: ${prevErr-data.error}`)
  prevErr = data.error;
  console.log();
}