import brain, { Input, NeuralNetworkGPU, TrainStream } from 'brain.js';
import { PROPS } from './const';
import DataGen from './data/loadData';
import * as fs from 'fs';
import _, { chunk } from 'lodash';

export default async (dataGen: DataGen) => {
  console.log("Test Data initalized")
  const data = dataGen.getBrainData();
  const brainData = data.images.testImages.map((image, index) => {
    const labelVal = data.label.testLabels[index];
    const outputArr = (new Array<0 | 1>(PROPS.NumClasses).fill(0));
    outputArr[labelVal] = 1;
    return {
    input: image,
    output: outputArr,
  }})
  let net = new NeuralNetworkGPU();
  const brainJson = fs.readFileSync('./ai.json', "utf-8");
  net = net.fromJSON(JSON.parse(brainJson));
  let correctResults = 0;
  const predictions: any = [];
  brainData.forEach(letter => {
    const result: Float32Array = net.run(letter.input);
    const prediction = findGuess(result);
    const correctIndex = letter.output.findIndex(i => i === 1);
    if (prediction.index === correctIndex) correctResults++;
    predictions.push([prediction.index, correctIndex])
  })
  console.log(`${correctResults}/${brainData.length} correct guesses`, predictions)
}


const findGuess = (predictions: Float32Array) => {
  let topChar: {char: any, certainty: number, index: number} = {certainty: 0, char: undefined, index: -1};
  predictions.forEach((pred, i) => {
    if (pred > topChar.certainty) topChar = {certainty: pred, char: PROPS.classes[i], index: i}
  })
  return topChar;
}