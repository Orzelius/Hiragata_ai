import generateImages from "./data/generateImages";
import resizeImages from "./data/resizeImages";
import makeBin from "./data/makeBin";
import testData from "./data/testData";
import MnistData from "./data/loadData";
import makeModel from "./model";
import * as tf from '@tensorflow/tfjs';
require('source-map-support').install();

// generateImages();
// resizeImages();
// makeBin().then(() => {
//   testData();
// });
// const data = new MnistData();
// data.load().then(() => {
//   const testData = data.getTestData();
//   console.log(testData.labels);
//   console.log(testData.xs);  
// })
makeModel();
