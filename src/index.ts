import generateImages from "./data/generateImages";
import resizeImages from "./data/resizeImages";
import makeBin from "./data/makeBin";
import testData from "./data/testData";
import DataGen from "./data/loadData";
import makeModel, { testModel } from "./model";
import * as tf from '@tensorflow/tfjs';
import resizeBinImages from "./data/resizeBinImages";
import * as fs from 'fs';
import { PROPS } from "./const";
import testBrainData from "./data/testBrainData";
import brain from "./brain";
import testBrain from "./testBrain";

// generateImages();
// resizeBinImages();
// makeBin().then(() => {
//   testData();
// });
// testData();
// const data = new MnistData();
// data.load().then(() => {
//   const testData = data.getTestData();
//   console.log(testData.labels);
//   console.log(testData.xs);  
// })
(async () => {
  await makeModel();
  await testModel(458);
})();
// (async () => {
//   const dataGen = new DataGen(true);
//   await dataGen.load();

//   // testBrainData(dataGen);
//   brain(dataGen);
//   await testBrain(dataGen);
//   console.log("FINISHED")
// })();
