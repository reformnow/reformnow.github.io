const fs = require('fs');
const execSync = require('child_process').execSync;

const oldDataJSON = execSync('git show HEAD~1:assets/geo/tribes.geojson').toString();
const oldData = JSON.parse(oldDataJSON);
const newData = JSON.parse(fs.readFileSync('tmp-tribes.geojson', 'utf-8'));

let featureCount = 0;
for (let f of newData.features) {
  if (f.properties.Name) {
    console.log(f.properties.Name);
  } else {
    featureCount++;
  }
}
console.log("Empty name count:", featureCount);
