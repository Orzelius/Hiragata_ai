import DataGen from "../data/loadData";
import testData from "../data/testData";

(async () => {
  console.log()
  await testData();
  console.log("Test data has been created in /test-images");
  const dataGen = new DataGen(false);
  await dataGen.load();
  console.log("Successfully initialized DataGen class");
  const aiTestData = dataGen.getTestData();
  console.log("Successfully initalized test-data for the ai");
  console.log("Labels tensor shape:", aiTestData.labels.shape)
  console.log("xs (image data) tensor shape:", aiTestData.xs.shape)
  console.log("\nReady to train the ai!")
})();